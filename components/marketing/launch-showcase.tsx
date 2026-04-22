import { ChartColumnBig, Crown, Languages, Sparkles } from "lucide-react";

const cards = [
  {
    icon: Sparkles,
    title: "Focused practice",
    body: "A calm typing canvas with large text, low clutter, and fast restart behavior."
  },
  {
    icon: ChartColumnBig,
    title: "Meaningful analytics",
    body: "Net WPM, consistency, weak keys, weak words, pace charts, and streak context."
  },
  {
    icon: Languages,
    title: "Five launch languages",
    body: "English, Hindi, Spanish, French, and German with script-aware handling."
  },
  {
    icon: Crown,
    title: "Installable and premium",
    body: "Built as a local-first PWA that still feels polished enough for a public launch."
  }
];

export function LaunchShowcase() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-line bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(224,122,95,0.1))] p-8 shadow-float md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted">Launch polish</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold text-ink md:text-5xl">
              Designed to look strong in screenshots and feel strong in daily use
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              Typezy now has the structure of a serious launch: stronger content depth, richer analytics surfaces, offline readiness, and a cleaner premium visual rhythm.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ScoreTile label="Core routes" value="31" />
              <ScoreTile label="Launch languages" value="5" />
              <ScoreTile label="Test coverage" value="12 checks" />
              <ScoreTile label="PWA core" value="verified" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="typezy-card-soft p-6 backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="typezy-panel p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
