"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { topWeakEntries } from "@/lib/stats/summary";
import { formatDate } from "@/lib/utils/format";
import { useStatsStore } from "@/stores/useStatsStore";

export function ResultsOverview() {
  const latestSession = useStatsStore((state) => state.latestSession);
  const hydrated = useStatsStore((state) => state.hydrated);
  const hydrateSessions = useStatsStore((state) => state.hydrateSessions);
  const recommendations = useStatsStore((state) => state.recommendations);

  useEffect(() => {
    if (!hydrated) {
      void hydrateSessions();
    }
  }, [hydrated, hydrateSessions]);

  if (!latestSession) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="typezy-card p-8 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink">No results yet</h1>
          <p className="mt-4 text-muted">Complete a practice session to unlock graphs, insights, and recommendations.</p>
          <Link href="/practice" className="mt-8 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white">
            Start a session
          </Link>
        </div>
      </div>
    );
  }

  const weakKeys = topWeakEntries(latestSession.weakKeys, 6);
  const weakWords = topWeakEntries(latestSession.weakWords, 6);
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
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Last session</p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-5xl font-semibold text-ink">{latestSession.metrics.netWpm} net WPM</h1>
            <p className="mt-3 text-muted">
              {latestSession.language.toUpperCase()} / {latestSession.mode} / {formatDate(latestSession.completedAt)}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Gross" value={`${latestSession.metrics.grossWpm}`} />
            <Stat label="Accuracy" value={`${latestSession.metrics.accuracy}%`} />
            <Stat label="Consistency" value={`${latestSession.metrics.consistency}%`} />
            <Stat label="Errors" value={`${latestSession.metrics.errors}`} />
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="typezy-card p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Pace over time</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Speed curve</h2>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latestSession.pace}>
                <defs>
                  <linearGradient id="paceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="second" tick={axisStyle} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-panel)" }} />
                <Area type="monotone" dataKey="netWpm" stroke="#0f766e" fill="url(#paceFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <InsightCard
            title="Recommendation"
            body={recommendations[0]?.body || "Complete another session to unlock more tailored next-step recommendations."}
          />
          <InsightCard
            title="Weak keys"
            body={weakKeys.length ? weakKeys.map((item) => `${item.label} (${item.value})`).join(", ") : "No clear weak key pattern yet."}
          />
          <InsightCard
            title="Weak words"
            body={weakWords.length ? weakWords.map((item) => `${item.label} (${item.value})`).join(", ") : "No recurring weak words yet."}
          />
        </div>
      </section>
      <section className="typezy-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Detailed result view</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Session-specific shareable route</h2>
          </div>
          <Link href={`/results/${latestSession.id}`} className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white">
            Open detailed result
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="typezy-panel p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="typezy-card-soft p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
    </article>
  );
}
