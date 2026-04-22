import type { Metadata } from "next";
import { ResultSessionDetail } from "@/components/app/result-session-detail";

export const metadata: Metadata = {
  title: "Session Result",
  description: "Inspect a specific Typezy session with detailed pace, error, and weak-key analytics."
};

export default async function SessionResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <ResultSessionDetail sessionId={sessionId} />;
}
