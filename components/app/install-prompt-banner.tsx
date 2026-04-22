"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useStatsStore } from "@/stores/useStatsStore";

export function InstallPromptBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const { canInstall, supportsManualInstall, promptInstall } = useInstallPrompt();
  const totalSessions = useStatsStore((state) => state.summary.totalSessions);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextVisitCount = Number(window.localStorage.getItem("typezy-install-visits") || "0") + 1;
    window.localStorage.setItem("typezy-install-visits", String(nextVisitCount));
    setVisitCount(nextVisitCount);

    const dismissedUntil = Number(window.localStorage.getItem("typezy-install-dismissed-until") || "0");
    setDismissed(dismissedUntil > Date.now());
  }, []);

  const shouldShow = useMemo(
    () => (canInstall || supportsManualInstall) && totalSessions >= 2 && visitCount >= 2 && !dismissed,
    [canInstall, supportsManualInstall, totalSessions, visitCount, dismissed]
  );

  if (!shouldShow) {
    return null;
  }

  const dismissBanner = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("typezy-install-dismissed-until", String(Date.now() + 3 * 24 * 60 * 60 * 1000));
    }
    setDismissed(true);
  };

  return (
    <div className="border-b border-line bg-accent text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div>
          <p className="text-sm font-medium">Install Typezy for faster repeat practice</p>
          <p className="text-xs text-white/80">
            {supportsManualInstall
              ? "On iPhone, use Share and then Add to Home Screen for a clean app-like launch."
              : "Open it like an app, reach practice faster, and keep your typing flow one tap away."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {supportsManualInstall ? (
            <div className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-accent">Share → Add to Home Screen</div>
          ) : (
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium text-accent"
            >
              <Download className="h-4 w-4" />
              Install
            </button>
          )}
          <button
            type="button"
            onClick={dismissBanner}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30"
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
