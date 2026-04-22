import { SessionRecord, StatsSummary, WeakMap } from "@/lib/types";

function mergeWeakMaps(base: WeakMap, incoming: WeakMap): WeakMap {
  const merged = { ...base };
  Object.entries(incoming).forEach(([key, value]) => {
    merged[key] = (merged[key] || 0) + value;
  });
  return merged;
}

function calculateStreak(sessions: SessionRecord[]): { streakDays: number; currentStreakStart?: string } {
  const uniqueDays = Array.from(
    new Set(sessions.map((session) => new Date(session.completedAt).toISOString().slice(0, 10)))
  ).sort((left, right) => right.localeCompare(left));

  if (uniqueDays.length === 0) {
    return { streakDays: 0 };
  }

  let streakDays = 1;
  const cursor = new Date(uniqueDays[0]);
  for (let index = 1; index < uniqueDays.length; index += 1) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    const expected = cursor.toISOString().slice(0, 10);
    if (uniqueDays[index] !== expected) {
      break;
    }
    streakDays += 1;
  }

  return {
    streakDays,
    currentStreakStart: uniqueDays[Math.min(streakDays - 1, uniqueDays.length - 1)]
  };
}

export function buildSummary(sessions: SessionRecord[]): StatsSummary {
  const base: StatsSummary = {
    totalSessions: sessions.length,
    totalPracticeMinutes: 0,
    streakDays: 0,
    bestNetWpm: {},
    bestAccuracy: {},
    sessionsByLanguage: {},
    sessionsByMode: {},
    weakKeys: {},
    weakWords: {}
  };

  sessions.forEach((session) => {
    base.totalPracticeMinutes += session.metrics.durationMs / 60000;
    base.sessionsByLanguage[session.language] = (base.sessionsByLanguage[session.language] || 0) + 1;
    base.sessionsByMode[session.mode] = (base.sessionsByMode[session.mode] || 0) + 1;
    base.bestNetWpm[session.language] = Math.max(
      base.bestNetWpm[session.language] || 0,
      session.metrics.netWpm
    );
    base.bestAccuracy[session.language] = Math.max(
      base.bestAccuracy[session.language] || 0,
      session.metrics.accuracy
    );
    base.weakKeys = mergeWeakMaps(base.weakKeys, session.weakKeys);
    base.weakWords = mergeWeakMaps(base.weakWords, session.weakWords);
  });

  const streak = calculateStreak(sessions);
  return {
    ...base,
    totalPracticeMinutes: Number(base.totalPracticeMinutes.toFixed(1)),
    streakDays: streak.streakDays,
    currentStreakStart: streak.currentStreakStart
  };
}

export function topWeakEntries(weakMap: WeakMap, count = 8): Array<{ label: string; value: number }> {
  return Object.entries(weakMap)
    .sort((left, right) => right[1] - left[1])
    .slice(0, count)
    .map(([label, value]) => ({ label, value }));
}
