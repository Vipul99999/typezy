import { describe, expect, it } from "vitest";
import { buildPrompt } from "@/lib/content/languages";

describe("buildPrompt", () => {
  it("expands timed prompts for longer practice sessions", () => {
    const shortPrompt = buildPrompt("en", "time", "", {}, {}, 25, 60);
    const longPrompt = buildPrompt("en", "time", "", {}, {}, 25, 1800);

    expect(shortPrompt.wordCount).toBeGreaterThanOrEqual(180);
    expect(longPrompt.wordCount).toBeGreaterThan(shortPrompt.wordCount ?? 0);
    expect(longPrompt.text.split(/\s+/).length).toBe(longPrompt.wordCount);
  });

  it("respects extended word targets in words mode", () => {
    const prompt = buildPrompt("en", "words", "", {}, {}, 1000, 60);

    expect(prompt.wordCount).toBe(1000);
    expect(prompt.text.split(/\s+/).length).toBe(1000);
  });

  it("uses structured difficulty packs in prompt source selection", () => {
    const beginnerPrompt = buildPrompt("en", "quote", "", {}, {}, 25, 60, "practice", "beginner");
    const advancedPrompt = buildPrompt("en", "quote", "", {}, {}, 25, 60, "practice", "advanced");

    expect(beginnerPrompt.source).toContain("Beginner");
    expect(advancedPrompt.source).toContain("Advanced");
    expect(beginnerPrompt.text.length).toBeGreaterThan(0);
    expect(advancedPrompt.text.length).toBeGreaterThan(0);
  });

  it("provides real Hindi sentence content for text view", () => {
    const prompt = buildPrompt("hi", "time", "", {}, {}, 25, 60, "text", "intermediate");

    expect(prompt.text.length).toBeGreaterThan(40);
    expect(prompt.source).toContain("Intermediate");
  });
});
