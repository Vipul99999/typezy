import Link from "next/link";

export function SeoCopyBlock({
  title,
  intro,
  bullets
}: {
  title: string;
  intro: string;
  bullets: string[];
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="typezy-card p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">SEO landing page</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{intro}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {bullets.map((bullet) => (
            <div key={bullet} className="typezy-panel p-4 text-sm leading-7 text-muted">
              {bullet}
            </div>
          ))}
        </div>
        <Link href="/practice" className="mt-8 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white">
          Try Typezy
        </Link>
      </div>
    </div>
  );
}
