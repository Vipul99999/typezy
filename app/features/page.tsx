import type { Metadata } from "next";
import { FeatureGrid } from "@/components/marketing/feature-grid";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore Typezy features including multilingual practice, deep analytics, offline support, and adaptive drills."
};

export default function FeaturesPage() {
  return <FeatureGrid />;
}
