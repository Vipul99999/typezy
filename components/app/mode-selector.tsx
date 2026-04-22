"use client";

import { PracticeMode } from "@/lib/types";
import { cn } from "@/lib/utils/format";
import { useSettingsStore } from "@/stores/useSettingsStore";

const modes: PracticeMode[] = ["time", "words", "quote", "numbers", "punctuation", "custom", "code", "zen", "adaptive"];

export function ModeSelector() {
  const mode = useSettingsStore((state) => state.mode);
  const setMode = useSettingsStore((state) => state.setMode);

  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setMode(option)}
          className={cn(
            "rounded-full px-4 py-2 text-sm capitalize transition",
            mode === option ? "bg-ink text-white" : "bg-panel text-muted hover:bg-surface hover:text-ink"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
