import type { Metadata } from "next";
import { ResultsOverview } from "@/components/app/results-overview";

export const metadata: Metadata = {
  title: "Results",
  description: "Review the latest Typezy session with score breakdowns, pace graphs, and targeted recommendations."
};

export default function ResultsPage() {
  return <ResultsOverview />;
}
