"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { topWeakEntries } from "@/lib/stats/summary";
import { formatDate } from "@/lib/utils/format";
import { SessionRecord } from "@/lib/types";
import { useStatsStore } from "@/stores/useStatsStore";

export function ResultSessionDetail({ sessionId }: { sessionId: string }) {
  const hydrated = useStatsStore((state) => state.hydrated);
  const hydrateSessions = useStatsStore((state) => state.hydrateSessions);
  const getSessionById = useStatsStore((state) => state.getSessionById);
  const [session, setSession] = useState<SessionRecord | null>(null);

  useEffect(() => {
    async function load() {
      if (!hydrated) {
        await hydrateSessions();
      }
      const found = await getSessionById(sessionId);
      setSession(found || null);
    }

    void load();
  }, [getSessionById, hydrateSessions, hydrated, sessionId]);

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="typezy-card p-8 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink">Session not found</h1>
          <p className="mt-4 text-muted">This result is not available in local storage right now.</p>
          <Link href="/results" className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white">
            Back to results
          </Link>
        </div>
      </div>
    );
  }

  const weakKeys = topWeakEntries(session.weakKeys, 8);
  const weakWords = topWeakEntries(session.weakWords, 8);
  const tooltipStyle = {
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-line)",
    color: "var(--color-ink)",
    borderRadius: 16
  };
  const axisStyle = { fill: "var(--color-muted)", fontSize: 12 };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <section className="typezy-card p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Session result</p>
        <h1 className="mt-3 font-display text-5xl font-semibold text-ink">{session.metrics.netWpm} net WPM</h1>
        <p className="mt-3 text-muted">
          {session.language.toUpperCase()} / {session.mode} / {formatDate(session.completedAt)}
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-5">
          <DetailStat label="Gross WPM" value={`${session.metrics.grossWpm}`} />
          <DetailStat label="Raw WPM" value={`${session.metrics.rawWpm}`} />
          <DetailStat label="Accuracy" value={`${session.metrics.accuracy}%`} />
          <DetailStat label="Consistency" value={`${session.metrics.consistency}%`} />
          <DetailStat label="Peak WPM" value={`${session.metrics.peakWpm}`} />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="typezy-card p-8">
          <h2 className="font-display text-3xl font-semibold text-ink">Pace timeline</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={session.pace}>
                <defs>
                  <linearGradient id="sessionPaceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="second" tick={axisStyle} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-panel)" }} />
                <Area type="monotone" dataKey="netWpm" stroke="#0f766e" fill="url(#sessionPaceFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <Insight title="Error breakdown" body={`${session.metrics.errors} total errors, ${session.metrics.extraChars} extra chars, ${session.metrics.missedChars} missed chars, ${session.metrics.backspaceCount} backspaces.`} />
          <Insight title="Weak keys" body={weakKeys.length ? weakKeys.map((item) => `${item.label} (${item.value})`).join(", ") : "No strong weak-key cluster detected in this session."} />
          <Insight title="Weak words" body={weakWords.length ? weakWords.map((item) => `${item.label} (${item.value})`).join(", ") : "No recurring weak-word signal detected in this session."} />
        </div>
      </section>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="typezy-panel p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <article className="typezy-card-soft p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
    </article>
  );
}
