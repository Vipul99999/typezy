"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import { cn } from "@/lib/utils/format";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

type InstallCtaButtonProps = {
  className?: string;
  compact?: boolean;
  showHint?: boolean;
  hideWhenInstalled?: boolean;
};

export function InstallCtaButton({
  className,
  compact = false,
  showHint = false,
  hideWhenInstalled = true
}: InstallCtaButtonProps) {
  const { canInstall, isInstalled, supportsManualInstall, promptInstall } = useInstallPrompt();
  const [hint, setHint] = useState("");

  if (isInstalled && hideWhenInstalled) {
    return null;
  }

  const label = isInstalled ? "Installed" : "Install app";

  const handleClick = async () => {
    if (isInstalled) {
      setHint("Typezy is already installed on this device.");
      return;
    }

    if (canInstall) {
      const result = await promptInstall();
      if (result.outcome === "dismissed") {
        setHint("If the browser dismissed install, try the address-bar install icon or browser menu.");
      } else {
        setHint("Typezy was added successfully.");
      }
      return;
    }

    if (supportsManualInstall) {
      setHint("On iPhone Safari, tap Share and then Add to Home Screen.");
      return;
    }

    setHint("If no prompt appears yet, use Chrome or Edge on HTTPS and open the browser menu to install the app.");
  };

  return (
    <div className={cn("flex flex-col gap-2", compact && "items-end", className)}>
      <button
        type="button"
        onClick={() => void handleClick()}
        title={supportsManualInstall ? "Install Typezy using Add to Home Screen" : "Install Typezy"}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-medium transition",
          isInstalled
            ? "border-line bg-panel px-4 py-2 text-ink"
            : "border-accent bg-accent px-4 py-2 text-white hover:brightness-110",
          compact ? "px-4 py-2" : "px-6 py-3"
        )}
      >
        {isInstalled ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        {label}
      </button>
      {showHint && hint ? (
        <p className={cn("max-w-xs text-xs leading-6 text-muted", compact && "text-right")}>{hint}</p>
      ) : null}
    </div>
  );
}
