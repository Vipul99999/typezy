import { describe, expect, it } from "vitest";
import { buildPaceSeries } from "@/lib/typing/engine";

describe("buildPaceSeries", () => {
  it("returns one pace point per snapshot", () => {
    const series = buildPaceSeries("focus rhythm", [
      { typedText: "focus", elapsedMs: 1000 },
      { typedText: "focus rhythm", elapsedMs: 2000 }
    ]);

    expect(series).toHaveLength(2);
    expect(series[0].second).toBe(1);
    expect(series[1].second).toBe(2);
  });
});
