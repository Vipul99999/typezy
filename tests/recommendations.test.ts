import { describe, expect, it } from "vitest";
import { buildRecommendations } from "@/lib/analytics/recommendations";
import { SessionRecord } from "@/lib/types";

function makeSession(overrides: Partial<SessionRecord> = {}): SessionRecord {
  return {
    id: "session-1",
    completedAt: "2026-04-20T12:00:00.000Z",
    language: "en",
    mode: "time",
    durationSec: 60,
    promptId: "prompt-1",
    promptPreview: "focus rhythm clarity",
    promptLength: 20,
    metrics: {
      grossWpm: 60,
      netWpm: 52,
      accuracy: 98,
      consistency: 90,
      errors: 1,
      extraChars: 0,
      missedChars: 0,
      correctChars: 20,
      totalTypedChars: 21,
      backspaceCount: 0,
      durationMs: 60000,
      rawWpm: 60,
      burstWpm: 64,
      peakWpm: 70,
      errorRate: 4.8
    },
    pace: [{ second: 1, grossWpm: 60, netWpm: 52, accuracy: 98 }],
    weakKeys: { g: 3, t: 2 },
    weakWords: { focus: 2 },
    keystrokes: [],
    ...overrides
  };
}

describe("buildRecommendations", () => {
  it("suggests adaptive practice for strong control", () => {
    const recommendations = buildRecommendations([makeSession()]);
    expect(recommendations.some((item) => item.mode === "adaptive")).toBe(true);
  });

  it("suggests easier control work when accuracy is low", () => {
    const seed = makeSession();
    const recommendations = buildRecommendations([
      makeSession({
        metrics: {
          ...seed.metrics,
          accuracy: 84,
          consistency: 61
        }
      })
    ]);

    expect(recommendations.some((item) => item.mode === "quote")).toBe(true);
  });
});
