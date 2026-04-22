import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line/70 bg-panel/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Typezy</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            A multilingual typing practice system focused on flow, analytics, and local-first simplicity.
          </p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-medium text-ink">Explore</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/features">Features</Link>
            <Link href="/languages">Languages</Link>
            <Link href="/analytics">Analytics</Link>
          </div>
        </div>
        <div className="text-sm text-muted">
          <p className="font-medium text-ink">Company</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
