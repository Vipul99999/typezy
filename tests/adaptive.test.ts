import { describe, expect, it } from "vitest";
import { buildAdaptiveSequence } from "@/lib/content/adaptive";

describe("buildAdaptiveSequence", () => {
  it("prioritizes weak words when available", () => {
    const sequence = buildAdaptiveSequence(
      ["focus", "rhythm", "clarity", "system"],
      { y: 2 },
      { rhythm: 4 },
      8
    );

    const parts = sequence.split(" ");
    expect(parts.filter((part) => part === "rhythm").length).toBeGreaterThan(1);
  });

  it("falls back cleanly without weakness data", () => {
    const sequence = buildAdaptiveSequence(["focus", "clarity"], {}, {}, 4);
    expect(sequence.split(" ")).toEqual(["focus", "clarity", "focus", "clarity"]);
  });
});
