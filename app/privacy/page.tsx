import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Typezy keeps progress local on your device and explains what gets stored."
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="typezy-card p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Privacy</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Your typing data stays with you by default</h1>
        <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
          <p>Typezy is built as a database-free product. Settings live in localStorage, while full session history and analytics live in IndexedDB on your device.</p>
          <p>No account is required for core use, and the current product scaffold does not send session data to a remote database.</p>
        </div>
      </div>
    </div>
  );
}
