import { Activity, Languages, Rocket, ScanSearch, Smartphone, Zap } from "lucide-react";

const features = [
  {
    title: "Instant practice",
    body: "No signup wall, no dead-end onboarding, and no loading-heavy friction before the first test.",
    icon: Zap
  },
  {
    title: "Premium focus UI",
    body: "Large text, smooth feedback, elegant rhythm, and an interface designed to disappear while you type.",
    icon: Rocket
  },
  {
    title: "Deep analytics",
    body: "Track net WPM, consistency, pace, weak keys, weak words, streaks, and mode-by-language performance.",
    icon: Activity
  },
  {
    title: "Five-language launch",
    body: "English, Hindi, Spanish, French, and German from day one with grapheme-aware scoring.",
    icon: Languages
  },
  {
    title: "PWA reliability",
    body: "Install it, open it like an app, and keep practicing even when your connection drops.",
    icon: Smartphone
  },
  {
    title: "SEO growth engine",
    body: "Dedicated indexable landing pages built to attract useful search traffic without thin content.",
    icon: ScanSearch
  }
];

export function FeatureGrid() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Product pillars</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-ink">Built like a typing improvement system</h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            Typezy combines practice, measurement, analysis, and guidance so returning users feel real progress instead
            of one-off score chasing.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="typezy-card-soft p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accentSoft text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{feature.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
