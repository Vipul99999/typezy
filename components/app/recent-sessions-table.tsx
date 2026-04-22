"use client";

import Link from "next/link";
import { SessionRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";

export function RecentSessionsTable({ sessions }: { sessions: SessionRecord[] }) {
  if (!sessions.length) {
    return <p className="text-sm text-muted">No session history yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-line">
      <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] bg-panel px-4 py-3 text-xs uppercase tracking-[0.18em] text-muted">
        <span>Session</span>
        <span>Mode</span>
        <span>Net WPM</span>
        <span>Accuracy</span>
        <span>Open</span>
      </div>
      {sessions.slice(0, 8).map((session) => (
        <div
          key={session.id}
          className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr] items-center border-t border-line px-4 py-4 text-sm text-ink"
        >
          <div>
            <p className="font-medium">{session.language.toUpperCase()}</p>
            <p className="text-xs text-muted">{formatDate(session.completedAt)}</p>
          </div>
          <span className="capitalize">{session.mode}</span>
          <span>{session.metrics.netWpm}</span>
          <span>{session.metrics.accuracy}%</span>
          <Link href={`/results/${session.id}`} className="text-accent">
            View
          </Link>
        </div>
      ))}
    </div>
  );
}
