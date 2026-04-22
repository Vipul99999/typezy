export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="typezy-card p-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Offline mode</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">You can keep practicing offline</h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Typezy caches core routes and keeps your local progress on-device, so your practice flow still works when the
          network drops.
        </p>
      </div>
    </div>
  );
}
