import Link from "next/link";
import { LANGUAGES } from "@/lib/content/languages";
import { LanguageCode } from "@/lib/types";

export function LanguageDetail({ language }: { language: LanguageCode }) {
  const config = LANGUAGES[language];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-16">
      <section className="typezy-card p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Language pack</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
          {config.label} typing practice
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">{config.seoIntro}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Info label="Script" value={config.script} />
          <Info label="Direction" value={config.direction} />
          <Info label="Word source" value={config.wordSourceVersion} />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="typezy-card p-8">
          <h2 className="font-display text-3xl font-semibold text-ink">Included modes</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["words", "time", "quote", "numbers", "punctuation", "code", "adaptive"].map((mode) => (
              <div key={mode} className="typezy-panel px-4 py-3 text-sm capitalize text-ink">
                {mode}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-muted">{config.keyboardNotes}</p>
        </div>

        <div className="typezy-card p-8">
          <h2 className="font-display text-3xl font-semibold text-ink">Sample preview</h2>
          <div className="mt-6 rounded-[1.5rem] border border-line/70 bg-panel/55 p-6 text-lg leading-8 text-ink">
            {config.sampleQuotes[0]}
          </div>
          <Link
            href={`/practice?lang=${language}`}
            className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white"
          >
            Start {config.label} practice
          </Link>
        </div>
      </section>

      <section className="typezy-card p-8">
        <h2 className="font-display text-3xl font-semibold text-ink">FAQs</h2>
        <div className="mt-6 space-y-5">
          {config.faq.map((item) => (
            <div key={item.question} className="typezy-panel p-5">
              <p className="font-medium text-ink">{item.question}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="typezy-panel p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold capitalize text-ink">{value}</p>
    </div>
  );
}
