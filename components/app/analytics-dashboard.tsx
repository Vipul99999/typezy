"use client";

import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RecentSessionsTable } from "@/components/app/recent-sessions-table";
import { WeakKeyHeatmap } from "@/components/app/weak-key-heatmap";
import { topWeakEntries } from "@/lib/stats/summary";
import { formatDuration } from "@/lib/utils/format";
import { useStatsStore } from "@/stores/useStatsStore";

export function AnalyticsDashboard() {
  const { sessions, summary, hydrated, hydrateSessions, recommendations, achievements } = useStatsStore();

  useEffect(() => {
    if (!hydrated) {
      void hydrateSessions();
    }
  }, [hydrated, hydrateSessions]);

  const languageData = Object.entries(summary.sessionsByLanguage).map(([language, count]) => ({
    language: language.toUpperCase(),
    count
  }));
  const trendData = sessions.slice(0, 10).reverse().map((session) => ({
    date: new Date(session.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    netWpm: session.metrics.netWpm,
    accuracy: session.metrics.accuracy
  }));
  const weakKeyData = topWeakEntries(summary.weakKeys);
  const modeData = Object.entries(summary.sessionsByMode).map(([mode, count]) => ({
    mode,
    count
  }));
  const latest = sessions[0];
  const nextRecommendation = recommendations[0];
  const dailyChallenge = latest
    ? latest.metrics.accuracy < 95
      ? "Finish one clean 60-second run above 95% accuracy today."
      : latest.metrics.netWpm < 55
        ? "Add one longer timed session today and keep your accuracy above 94%."
        : "Push one adaptive or punctuation drill today to stretch control under pressure."
    : "Start with a short timed session today so Typezy can build your first practice baseline.";
  const tooltipStyle = {
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-line)",
    color: "var(--color-ink)",
    borderRadius: 16
  };
  const axisStyle = { fill: "var(--color-muted)", fontSize: 12 };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-12">
      <section className="grid gap-4 md:grid-cols-4">
        <Panel title="Sessions" value={`${summary.totalSessions}`} />
        <Panel title="Practice time" value={formatDuration(summary.totalPracticeMinutes)} />
        <Panel title="Current streak" value={`${summary.streakDays} days`} />
        <Panel
          title="Best net WPM"
          value={`${Math.max(...Object.values(summary.bestNetWpm).map(Number), 0)}`}
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="typezy-card p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Progress</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Recent session trend</h1>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="date" tick={axisStyle} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-panel)" }} />
                <Bar dataKey="netWpm" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="typezy-card p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Language mix</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Where practice is happening</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  dataKey="count"
                  nameKey="language"
                  outerRadius={120}
                  fill="#e07a5f"
                  label={{ fill: "var(--color-muted)", fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="typezy-card p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Weak keys heatmap</p>
          <div className="mt-6">
            <WeakKeyHeatmap weakKeys={summary.weakKeys} />
          </div>
        </div>

        <div className="typezy-card p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Recommendations</p>
          <div className="mt-6 space-y-4">
            <div className="typezy-panel p-4">
              <p className="font-medium text-ink">Daily challenge</p>
              <p className="mt-2 text-sm leading-7 text-muted">{dailyChallenge}</p>
            </div>
            <div className="typezy-panel p-4">
              <p className="font-medium text-ink">Next best session</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                {nextRecommendation?.body || "Complete another session to unlock a stronger next-step recommendation."}
              </p>
            </div>
            {recommendations.map((item) => (
              <div key={item.id} className="typezy-panel p-4">
                <p className="font-medium text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="typezy-card p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Mode mix</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Practice distribution by mode</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modeData}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="mode" tick={axisStyle} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={{ stroke: "var(--color-line)" }} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-panel)" }} />
                <Bar dataKey="count" fill="#e07a5f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="typezy-card p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Achievements</p>
          <div className="mt-6 space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="typezy-panel px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-ink">{achievement.title}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted">
                    {achievement.unlockedAt ? "Unlocked" : achievement.progress ? `${Math.min(100, Math.round(achievement.progress * 100))}%` : "Locked"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="typezy-card p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Recent sessions</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Session history at a glance</h2>
          <div className="mt-6">
            <RecentSessionsTable sessions={sessions} />
          </div>
        </div>
        <div className="typezy-card p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Top weak keys</p>
          <div className="mt-6 space-y-3">
            {weakKeyData.length ? (
              weakKeyData.map((item) => (
                <div key={item.label} className="flex items-center justify-between typezy-panel px-4 py-3">
                  <span className="font-medium text-ink">{item.label}</span>
                  <span className="text-sm text-muted">{item.value} misses</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">Complete a few sessions to unlock weak-key analysis.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, value }: { title: string; value: string }) {
  return (
    <div className="typezy-card-soft p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{title}</p>
      <p className="mt-3 font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}
