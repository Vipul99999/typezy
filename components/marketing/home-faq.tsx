const items = [
  {
    question: "Do I need an account to use Typezy?",
    answer: "No. Typezy is built for instant access, so you can start practicing immediately without a signup wall."
  },
  {
    question: "Does Typezy save my progress?",
    answer: "Yes. Preferences are stored in localStorage, while session history and analytics are stored locally in IndexedDB on your device."
  },
  {
    question: "Can I practice in Hindi?",
    answer: "Yes. Hindi is a launch language, and the engine uses grapheme-aware comparison to handle Devanagari more fairly."
  }
];

export function HomeFaq() {
  return (
    <section className="px-6 py-20">
      <div className="typezy-card mx-auto max-w-5xl p-8">
        <p className="text-sm uppercase tracking-[0.22em] text-muted">FAQ</p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-ink">Useful answers before the first session</h2>
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <article key={item.question} className="typezy-panel p-5">
              <h3 className="font-medium text-ink">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
