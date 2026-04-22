import { LANGUAGES } from "@/lib/content/languages";

export function LanguageCards() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Launch languages</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-ink">Global reach with a strong India edge</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(LANGUAGES).map(([code, language]) => (
            <article key={code} className="typezy-card-soft p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">{code}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{language.label}</h3>
              <p className="mt-1 text-sm text-muted">{language.nativeLabel}</p>
              <p className="mt-4 text-sm leading-7 text-muted">{language.sampleWords.slice(0, 5).join(" • ")}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
