import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/app/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Inspect streaks, weak keys, session trends, and language-wise progress in the Typezy analytics dashboard."
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
