"use client";

import { ChangeEvent, useState } from "react";
import { ChevronDown } from "lucide-react";
import { playTypeSound, warmTypeSound } from "@/lib/audio/type-sounds";
import { useStatsStore } from "@/stores/useStatsStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function SettingsPanel() {
  const settings = useSettingsStore();
  const exportSessions = useStatsStore((state) => state.exportSessions);
  const importSessions = useStatsStore((state) => state.importSessions);
  const [message, setMessage] = useState<string>("");

  function handleExport() {
    const raw = exportSessions();
    if (typeof window === "undefined") {
      return;
    }
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "typezy-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Local data exported.");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const raw = await file.text();
    await importSessions(raw);
    setMessage("Local data imported.");
  }

  async function handleTestSound() {
    if (!settings.soundEnabled) {
      setMessage("Enable sound effects first.");
      return;
    }

    await warmTypeSound();
    await playTypeSound("type");
    window.setTimeout(() => {
      void playTypeSound("finish");
    }, 120);
    setMessage("Played test sound.");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-12">
      <div className="typezy-card p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Preferences</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Settings</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SelectField
            label="Theme"
            value={settings.theme}
            onChange={(event) => settings.setTheme(event.target.value as "light" | "dark" | "system")}
            options={[
              { value: "system", label: "System" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" }
            ]}
          />
          <SelectField
            label="Caret style"
            value={settings.caretStyle}
            onChange={(event) => settings.setCaretStyle(event.target.value as "bar" | "block" | "underline")}
            options={[
              { value: "underline", label: "Underline" },
              { value: "bar", label: "Bar" },
              { value: "block", label: "Block" }
            ]}
          />
          <SelectField
            label="Practice layout"
            value={settings.practiceLayout}
            onChange={(event) => settings.setPracticeLayout(event.target.value as "rich" | "pro")}
            options={[
              { value: "rich", label: "Rich" },
              { value: "pro", label: "Pro" }
            ]}
          />
          <SelectField
            label="Content difficulty"
            value={settings.contentDifficulty}
            onChange={(event) => settings.setContentDifficulty(event.target.value as "beginner" | "intermediate" | "advanced")}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" }
            ]}
          />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">Font scale</span>
            <input
              type="range"
              min="0.9"
              max="1.3"
              step="0.05"
              value={settings.fontScale}
              onChange={(event) => settings.setFontScale(Number(event.target.value))}
              className="w-full"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3">
            <span className="text-sm font-medium text-ink">Sound effects</span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(event) => settings.setSoundEnabled(event.target.checked)}
            />
          </label>
          <button
            type="button"
            onClick={handleTestSound}
            className="rounded-2xl border border-line bg-panel px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-panel/80"
          >
            Test sound effect
          </button>
          <div className="rounded-2xl border border-line bg-panel px-4 py-3 text-sm leading-7 text-muted">
            Sound starts only after a real user interaction. Use the test button first, then verify typing sound on your target browser and device.
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3">
            <span className="text-sm font-medium text-ink">Reduce motion</span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(event) => settings.setReduceMotion(event.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3">
            <span className="text-sm font-medium text-ink">Show live WPM</span>
            <input
              type="checkbox"
              checked={settings.showLiveWpm}
              onChange={(event) => settings.setShowLiveWpm(event.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3">
            <span className="text-sm font-medium text-ink">Show keyboard hints</span>
            <input
              type="checkbox"
              checked={settings.showKeyboardHints}
              onChange={(event) => settings.setShowKeyboardHints(event.target.checked)}
            />
          </label>
          <div className="rounded-2xl border border-line bg-panel px-4 py-3 text-sm leading-7 text-muted">
            Settings and lightweight preferences persist in localStorage. Full session history persists in IndexedDB.
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-2xl border border-accent bg-accent px-5 py-3 text-sm font-medium text-white"
          >
            Export local data
          </button>
          <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-line bg-panel px-5 py-3 text-sm font-medium text-ink">
            Import local data
            <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </label>
        </div>
        {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <div className="relative overflow-hidden rounded-[1.35rem] border border-line bg-panel transition focus-within:border-accent/70 focus-within:ring-2 focus-within:ring-accent/15">
        <select
          className="typezy-select w-full appearance-none bg-transparent px-4 py-3 pr-11 text-ink outline-none"
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
    </label>
  );
}
