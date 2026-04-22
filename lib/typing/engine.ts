import { KeystrokeLogItem, PacePoint, SessionMetrics, WeakMap } from "@/lib/types";
import { splitGraphemes } from "@/lib/typing/graphemes";
import { analyzeWordProgress } from "@/lib/typing/word-engine";

export type EvaluationResult = SessionMetrics & {
  weakKeys: WeakMap;
  weakWords: WeakMap;
};

export function evaluateAttempt(
  targetText: string,
  typedText: string,
  durationMs: number,
  backspaceCount: number,
  keystrokes: KeystrokeLogItem[] = []
): EvaluationResult {
  const target = splitGraphemes(targetText);
  const typed = splitGraphemes(typedText);
  const minutes = Math.max(durationMs / 60000, 1 / 60);

  let correctChars = 0;
  let errors = 0;
  let extraChars = 0;
  let missedChars = 0;
  const weakKeys: WeakMap = {};
  const weakWords: WeakMap = {};

  const longest = Math.max(target.length, typed.length);
  for (let index = 0; index < longest; index += 1) {
    const expected = target[index];
    const actual = typed[index];

    if (expected === undefined && actual !== undefined) {
      extraChars += 1;
      errors += 1;
      weakKeys[actual] = (weakKeys[actual] || 0) + 1;
      continue;
    }

    if (expected !== undefined && actual === undefined) {
      missedChars += 1;
      errors += 1;
      weakKeys[expected] = (weakKeys[expected] || 0) + 1;
      continue;
    }

    if (expected === actual) {
      correctChars += 1;
      continue;
    }

    errors += 1;
    if (expected) {
      weakKeys[expected] = (weakKeys[expected] || 0) + 1;
    }
  }

  const wordProgress = analyzeWordProgress(typedText, targetText);
  for (let index = 0; index < wordProgress.completedTypedWords; index += 1) {
    const targetWord = wordProgress.targetWords[index];
    const typedWord = wordProgress.typedWords[index];

    if (targetWord && typedWord !== targetWord) {
      weakWords[targetWord] = (weakWords[targetWord] || 0) + 1;
    }
  }

  const grossWpm = Number(((typed.length / 5) / minutes).toFixed(1));
  const netWpm = Number((((correctChars / 5) / minutes) || 0).toFixed(1));
  const accuracy = Number(((correctChars / Math.max(typed.length, 1)) * 100).toFixed(1));
  const consistencyBase = 100 - (errors / Math.max(target.length, 1)) * 100 - backspaceCount * 0.3;
  const consistency = Number(Math.max(25, Math.min(100, consistencyBase)).toFixed(1));
  const rawWpm = grossWpm;
  const intervalBursts = keystrokes.length
    ? keystrokes.reduce<Record<number, number>>((accumulator, item) => {
        const second = Math.floor((item.timestamp - keystrokes[0].timestamp) / 1000);
        accumulator[second] = (accumulator[second] || 0) + 1;
        return accumulator;
      }, {})
    : {};
  const perSecondWpms = Object.values(intervalBursts).map((count) => Number((((count / 5) / (1 / 60)) || 0).toFixed(1)));
  const burstWpm = perSecondWpms.length ? Number((perSecondWpms.reduce((sum, value) => sum + value, 0) / perSecondWpms.length).toFixed(1)) : grossWpm;
  const peakWpm = perSecondWpms.length ? Math.max(...perSecondWpms) : grossWpm;
  const errorRate = Number(((errors / Math.max(typed.length, 1)) * 100).toFixed(1));

  return {
    grossWpm,
    netWpm,
    accuracy,
    consistency,
    errors,
    extraChars,
    missedChars,
    correctChars,
    totalTypedChars: typed.length,
    backspaceCount,
    durationMs,
    rawWpm,
    burstWpm,
    peakWpm,
    errorRate,
    weakKeys,
    weakWords
  };
}

export function buildPaceSeries(
  targetText: string,
  snapshots: { typedText: string; elapsedMs: number }[]
): PacePoint[] {
  return snapshots.map((snapshot, index) => {
    const evaluation = evaluateAttempt(targetText, snapshot.typedText, snapshot.elapsedMs, 0);
    return {
      second: index + 1,
      grossWpm: evaluation.grossWpm,
      netWpm: evaluation.netWpm,
      accuracy: evaluation.accuracy
    };
  });
}
