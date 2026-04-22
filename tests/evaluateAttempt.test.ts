import { describe, expect, it } from "vitest";
import { evaluateAttempt } from "@/lib/typing/engine";

describe("evaluateAttempt", () => {
  it("computes stable metrics for a perfect run", () => {
    const result = evaluateAttempt("focus rhythm", "focus rhythm", 60000, 0);

    expect(result.netWpm).toBeGreaterThan(0);
    expect(result.accuracy).toBe(100);
    expect(result.errors).toBe(0);
    expect(result.weakKeys).toEqual({});
  });

  it("handles grapheme-aware Hindi input safely", () => {
    const result = evaluateAttempt("कौशल", "कौशल", 30000, 0);

    expect(result.accuracy).toBe(100);
    expect(result.errors).toBe(0);
  });

  it("tracks extra and missed characters", () => {
    const result = evaluateAttempt("habit", "habits", 30000, 1);

    expect(result.extraChars).toBe(1);
    expect(result.errors).toBeGreaterThan(0);
    expect(result.errorRate).toBeGreaterThan(0);
  });

  it("records burst and peak speed from keystroke timing", () => {
    const result = evaluateAttempt("focus", "focus", 5000, 0, [
      { key: "f", expected: "f", actual: "f", correct: true, timestamp: 0, caretIndex: 1 },
      { key: "o", expected: "o", actual: "o", correct: true, timestamp: 100, caretIndex: 2 },
      { key: "c", expected: "c", actual: "c", correct: true, timestamp: 200, caretIndex: 3 },
      { key: "u", expected: "u", actual: "u", correct: true, timestamp: 300, caretIndex: 4 },
      { key: "s", expected: "s", actual: "s", correct: true, timestamp: 1500, caretIndex: 5 }
    ]);

    expect(result.peakWpm).toBeGreaterThanOrEqual(result.burstWpm);
    expect(result.burstWpm).toBeGreaterThan(0);
  });

  it("reduces consistency when backspaces and errors rise", () => {
    const clean = evaluateAttempt("clarity", "clarity", 30000, 0);
    const messy = evaluateAttempt("clarity", "clarotyx", 30000, 4);

    expect(messy.consistency).toBeLessThan(clean.consistency);
  });
});
