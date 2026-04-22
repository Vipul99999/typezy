"use client";

import { WifiOff } from "lucide-react";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";

export function OfflineIndicator() {
  const isOffline = useOfflineStatus();

  if (!isOffline) {
    return null;
  }

  return (
    <div className="border-b border-warning/40 bg-warning/10">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-2 text-sm text-ink">
        <WifiOff className="h-4 w-4 text-warning" />
        Offline mode active. Cached routes and local history still work.
      </div>
    </div>
  );
}
