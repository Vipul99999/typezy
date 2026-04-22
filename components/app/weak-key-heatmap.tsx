"use client";

import { topWeakEntries } from "@/lib/stats/summary";
import { WeakMap } from "@/lib/types";

export function WeakKeyHeatmap({ weakKeys }: { weakKeys: WeakMap }) {
  const entries = topWeakEntries(weakKeys, 18);
  const max = Math.max(...entries.map((item) => item.value), 1);

  if (!entries.length) {
    return <p className="text-sm text-muted">Complete a few sessions to unlock weak-key heatmap insights.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {entries.map((item) => {
        const intensity = item.value / max;
        return (
          <div
            key={item.label}
            className="rounded-2xl border border-line p-4 text-center"
            style={{ backgroundColor: `rgba(224, 122, 95, ${0.14 + intensity * 0.36})` }}
          >
            <p className="text-2xl font-semibold text-ink">{item.label}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">{item.value} misses</p>
          </div>
        );
      })}
    </div>
  );
}
