"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Achievement, Recommendation, SessionRecord, StatsSummary } from "@/lib/types";
import {
  loadSessionByIdFromIndexedDb,
  loadSessionsFromIndexedDb,
  replaceSessionsInIndexedDb,
  saveSessionToIndexedDb
} from "@/lib/storage/indexed-db";
import { parseImportedSessions, serializeSessions } from "@/lib/storage/export-import";
import { buildRecommendations } from "@/lib/analytics/recommendations";
import { buildAchievements } from "@/lib/analytics/achievements";
import { buildSummary } from "@/lib/stats/summary";

type StatsState = {
  sessions: SessionRecord[];
  summary: StatsSummary;
  recommendations: Recommendation[];
  achievements: Achievement[];
  hydrated: boolean;
  latestSession?: SessionRecord;
  hydrateSessions: () => Promise<void>;
  recordSession: (session: SessionRecord) => Promise<void>;
  getSessionById: (id: string) => Promise<SessionRecord | undefined>;
  exportSessions: () => string;
  importSessions: (raw: string) => Promise<void>;
};

const emptySummary: StatsSummary = {
  totalSessions: 0,
  totalPracticeMinutes: 0,
  streakDays: 0,
  bestNetWpm: {},
  bestAccuracy: {},
  sessionsByLanguage: {},
  sessionsByMode: {},
  weakKeys: {},
  weakWords: {}
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      sessions: [],
      summary: emptySummary,
      recommendations: [],
      achievements: [],
      hydrated: false,
      latestSession: undefined,
      hydrateSessions: async () => {
        const sessions = await loadSessionsFromIndexedDb();
        set({
          sessions,
          summary: buildSummary(sessions),
          recommendations: buildRecommendations(sessions),
          achievements: buildAchievements(sessions),
          latestSession: sessions[0],
          hydrated: true
        });
      },
      recordSession: async (session) => {
        await saveSessionToIndexedDb(session);
        const sessions = [session, ...get().sessions];
        set({
          sessions,
          summary: buildSummary(sessions),
          recommendations: buildRecommendations(sessions),
          achievements: buildAchievements(sessions),
          latestSession: session,
          hydrated: true
        });
      },
      getSessionById: async (id) => {
        const existing = get().sessions.find((session) => session.id === id);
        if (existing) {
          return existing;
        }
        return loadSessionByIdFromIndexedDb(id);
      },
      exportSessions: () => {
        return serializeSessions(get().sessions);
      },
      importSessions: async (raw) => {
        const sessions = parseImportedSessions(raw).sort((left, right) => right.completedAt.localeCompare(left.completedAt));
        await replaceSessionsInIndexedDb(sessions);
        set({
          sessions,
          summary: buildSummary(sessions),
          recommendations: buildRecommendations(sessions),
          achievements: buildAchievements(sessions),
          latestSession: sessions[0],
          hydrated: true
        });
      }
    }),
    {
      name: "typezy-stats-summary",
      partialize: (state) => ({
        summary: state.summary,
        latestSession: state.latestSession,
        recommendations: state.recommendations,
        achievements: state.achievements
      })
    }
  )
);
