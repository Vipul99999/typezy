import "@/app/globals.css";
import type { Metadata } from "next";
import { InstallPromptBanner } from "@/components/app/install-prompt-banner";
import { OfflineIndicator } from "@/components/app/offline-indicator";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ServiceWorkerRegister } from "@/components/providers/service-worker-register";
import { ThemeSync } from "@/components/providers/theme-sync";

export const metadata: Metadata = {
  metadataBase: new URL("https://typezy.app"),
  title: {
    default: "Typezy | Beautiful multilingual typing practice",
    template: "%s | Typezy"
  },
  description:
    "Typezy is a fast, SEO-friendly, installable typing practice PWA with five languages, deep analytics, and zero signup friction.",
  applicationName: "Typezy",
  manifest: "/manifest.webmanifest",
  keywords: [
    "typing test",
    "typing practice",
    "typing speed test",
    "hindi typing test",
    "english typing test",
    "multilingual typing"
  ],
  openGraph: {
    title: "Typezy",
    description: "Practice typing beautifully, improve meaningfully, and keep everything fast and simple.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Typezy",
    description: "A premium multilingual typing improvement system."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeSync />
        <ServiceWorkerRegister />
        <InstallPromptBanner />
        <OfflineIndicator />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
