import type { Metadata } from "next";
import { SettingsPanel } from "@/components/app/settings-panel";

export const metadata: Metadata = {
  title: "Settings",
  description: "Adjust Typezy theme, sound, font scale, and local-first behavior settings."
};

export default function SettingsPage() {
  return <SettingsPanel />;
}
