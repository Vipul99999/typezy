import Link from "next/link";
import { ArrowRight, BarChart3, Globe2, ShieldCheck } from "lucide-react";
import { InstallCtaButton } from "@/components/app/install-cta-button";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(224,122,95,0.18),_transparent_32%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex rounded-full border border-line bg-surface/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted">
            Fast typing, smarter progress
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-tight text-ink md:text-7xl">
            Practice typing beautifully. Improve meaningfully.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Typezy is a premium, installable typing practice app with five languages, deep analytics, offline support,
            and zero-signup friction.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-float transition hover:translate-y-[-1px]"
            >
              Launch practice
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition hover:bg-panel"
            >
              Explore features
            </Link>
            <InstallCtaButton showHint />
          </div>
          <div className="mt-10 grid gap-4 text-sm text-muted md:grid-cols-3">
            <div className="rounded-3xl border border-line bg-surface/80 p-4">
              <Globe2 className="mb-3 h-5 w-5 text-accent" />
              5 launch languages
            </div>
            <div className="rounded-3xl border border-line bg-surface/80 p-4">
              <BarChart3 className="mb-3 h-5 w-5 text-accent" />
              Local-first analytics
            </div>
            <div className="rounded-3xl border border-line bg-surface/80 p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-accent" />
              Offline-capable PWA
            </div>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-line bg-surface/88 p-6 backdrop-blur">
          <div className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
            Launch build
          </div>
          <div className="rounded-[1.5rem] border border-line bg-panel p-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted">
              <span>Live session</span>
              <span>English / 60s</span>
            </div>
            <p className="mt-6 font-display text-4xl font-semibold text-ink">82.4 WPM</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Metric label="Accuracy" value="97.8%" />
              <Metric label="Consistency" value="88%" />
              <Metric label="Weak keys" value="g, t, ष" />
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-line/70 bg-surface p-5 text-sm leading-7 text-muted">
              <span className="text-ink">Practice</span> builds confidence long before confidence becomes visible.
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line/70 bg-surface p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Insight</p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Accuracy is strong enough to move into punctuation or adaptive drills next.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-accent/30 bg-[linear-gradient(135deg,rgba(15,118,110,0.92),rgba(19,34,38,0.96))] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/75">Momentum</p>
                <p className="mt-3 font-display text-3xl font-semibold">7 day streak</p>
                <p className="mt-2 text-sm text-white/80">Short daily sessions, strong repeat behavior.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="typezy-panel p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
