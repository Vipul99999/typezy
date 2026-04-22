"use client";

import Link from "next/link";
import type { Route } from "next";
import { Keyboard, Menu, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { InstallCtaButton } from "@/components/app/install-cta-button";
import { cn } from "@/lib/utils/format";

const links: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/languages", label: "Languages" },
  { href: "/practice", label: "Practice" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPracticeRoute = pathname === "/practice";

  return (
    <header className={cn("sticky top-0 z-40 border-b border-line/70 backdrop-blur-xl", isPracticeRoute ? "bg-surface/92" : "bg-canvas/90")}>
      <div className={cn("mx-auto flex max-w-7xl items-center justify-between px-6", isPracticeRoute ? "py-3" : "py-4")}>
        <Link href="/" className="flex items-center gap-3 text-ink">
          <div className={cn("flex items-center justify-center rounded-2xl bg-accent text-white shadow-float", isPracticeRoute ? "h-10 w-10" : "h-11 w-11")}>
            <Keyboard className="h-5 w-5" />
          </div>
          <div>
            <p className={cn("font-display font-semibold", isPracticeRoute ? "text-lg" : "text-xl")}>Typezy</p>
            {!isPracticeRoute ? <p className="text-xs uppercase tracking-[0.2em] text-muted">Practice beautifully</p> : null}
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition",
                pathname === link.href ? "bg-panel/80 text-ink" : "text-muted hover:bg-panel hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <InstallCtaButton compact />
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            Start now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-full border border-line bg-surface p-2 text-ink md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-line bg-surface px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm transition",
                  pathname === link.href ? "bg-panel text-ink" : "text-muted hover:bg-panel hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <InstallCtaButton showHint />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
