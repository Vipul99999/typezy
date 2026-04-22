import { describe, expect, it } from "vitest";
import { parseImportedSessions, serializeSessions } from "@/lib/storage/export-import";
import { SessionRecord } from "@/lib/types";

const session: SessionRecord = {
  id: "s1",
  completedAt: "2026-04-20T12:00:00.000Z",
  language: "en",
  mode: "words",
  durationSec: 30,
  promptId: "p1",
  promptPreview: "focus rhythm",
  promptLength: 12,
  metrics: {
    grossWpm: 55,
    netWpm: 50,
    accuracy: 96,
    consistency: 88,
    errors: 1,
    extraChars: 0,
    missedChars: 0,
    correctChars: 12,
    totalTypedChars: 13,
    backspaceCount: 1,
    durationMs: 30000,
    rawWpm: 55,
    burstWpm: 58,
    peakWpm: 63,
    errorRate: 7.6
  },
  pace: [{ second: 1, grossWpm: 55, netWpm: 50, accuracy: 96 }],
  weakKeys: { h: 1 },
  weakWords: { rhythm: 1 },
  keystrokes: []
};

describe("export/import", () => {
  it("round-trips exported sessions", () => {
    const raw = serializeSessions([session]);
    const parsed = parseImportedSessions(raw);
    expect(parsed).toEqual([session]);
  });

  it("rejects invalid payloads", () => {
    expect(() => parseImportedSessions(JSON.stringify({ nope: true }))).toThrow();
  });

  it("rejects malformed JSON", () => {
    expect(() => parseImportedSessions("{invalid json")).toThrow();
  });

  it("rejects oversized imports", () => {
    const hugeRaw = "x".repeat(5 * 1024 * 1024 + 1);
    expect(() => parseImportedSessions(hugeRaw)).toThrow("Import file is too large.");
  });

  it("rejects sessions with missing required fields", () => {
    const raw = JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: [{ language: "en", mode: "words" }]
    });

    expect(() => parseImportedSessions(raw)).toThrow("Import file does not contain valid Typezy sessions.");
  });

  it("rejects invalid language and mode values", () => {
    const raw = JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: [{ ...session, language: "jp", mode: "sprint" }]
    });

    expect(() => parseImportedSessions(raw)).toThrow("Import file does not contain valid Typezy sessions.");
  });

  it("rejects corrupted metrics shapes", () => {
    const raw = JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: [{ ...session, metrics: { grossWpm: 60 } }]
    });

    expect(() => parseImportedSessions(raw)).toThrow("Import file does not contain valid Typezy sessions.");
  });

  it("rejects sessions with unknown top-level fields", () => {
    const raw = JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: [{ ...session, injected: "unexpected" }]
    });

    expect(() => parseImportedSessions(raw)).toThrow("Import file does not contain valid Typezy sessions.");
  });

  it("normalizes numeric ranges and drops invalid nested entries", () => {
    const raw = JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: [
        {
          ...session,
          durationSec: -100,
          metrics: {
            ...session.metrics,
            grossWpm: 9999,
            accuracy: -20,
            durationMs: 99_999_999
          },
          weakKeys: {
            a: 5,
            broken: "bad"
          },
          keystrokes: [
            {
              key: "a",
              expected: "a",
              actual: "a",
              correct: true,
              timestamp: 1,
              caretIndex: 1
            },
            {
              key: "b",
              expected: "b",
              actual: "b",
              correct: true,
              timestamp: 2,
              caretIndex: 2,
              extra: "not allowed"
            },
            {
              expected: "c",
              actual: "c",
              correct: true,
              timestamp: 3,
              caretIndex: 3
            }
          ]
        }
      ]
    });

    const [parsed] = parseImportedSessions(raw);
    expect(parsed.durationSec).toBe(1);
    expect(parsed.metrics.grossWpm).toBe(400);
    expect(parsed.metrics.accuracy).toBe(0);
    expect(parsed.metrics.durationMs).toBe(4 * 60 * 60 * 1000);
    expect(parsed.weakKeys).toEqual({ a: 5 });
    expect(parsed.keystrokes).toHaveLength(1);
  });
});
