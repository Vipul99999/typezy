import { describe, expect, it } from "vitest";
import { buildPrompt } from "@/lib/content/languages";

describe("word mode prompt generation", () => {
  it("builds exactly the requested number of words in words mode", () => {
    const prompt = buildPrompt("en", "words", "", {}, {}, 25, 60, "text", "intermediate");
    const words = prompt.text.trim().split(/\s+/).filter(Boolean);

    expect(prompt.wordCount).toBe(25);
    expect(words).toHaveLength(25);
  });
});
