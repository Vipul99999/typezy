import Link from "next/link";
import { ArrowRight, ChartColumnBig, Flame, Target } from "lucide-react";

export function AnalyticsPreview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="typezy-card p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Why users come back</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-ink">Analytics that actually guide improvement</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Typezy is designed to turn raw sessions into useful next steps with trend views, weak-key signals, streak tracking, and adaptive recommendations.
          </p>
          <Link href="/analytics" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
            Explore the dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <PreviewCard icon={ChartColumnBig} title="Trend analysis" body="See how net WPM and accuracy move over recent sessions instead of guessing." />
          <PreviewCard icon={Target} title="Weak-key focus" body="Surface recurring weak keys and words so the next drill can be intentional." />
          <PreviewCard icon={Flame} title="Streak momentum" body="Keep habit-building visible with clear session counts and streak progress." />
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  icon: Icon,
  title,
  body
}: {
  icon: typeof ChartColumnBig;
  title: string;
  body: string;
}) {
  return (
    <article className="typezy-card-soft p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accentSoft text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
    </article>
  );
}
