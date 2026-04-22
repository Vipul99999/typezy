import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the Typezy product direction and why it is built as a typing improvement system."
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="typezy-card p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">About Typezy</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">A typing platform people want to return to</h1>
        <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
          <p>
            Typezy is designed to feel fast, premium, personal, and motivating. It is not just a typing test site. It
            is a local-first typing improvement system that helps people practice, measure, analyze, and improve.
          </p>
          <p>
            The launch focus is clear: world-class typing flow, accurate multilingual scoring, useful analytics, PWA
            reliability, and SEO pages that genuinely help search visitors.
          </p>
        </div>
      </div>
    </div>
  );
}
