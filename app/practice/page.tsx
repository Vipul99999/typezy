import type { Metadata } from "next";
import { PracticeWorkspace } from "@/components/app/practice-workspace";

export const metadata: Metadata = {
  title: "Practice",
  description: "Start typing instantly with multilingual modes, local-first state, and a focused practice workspace."
};

export default async function PracticePage({
  searchParams
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  return <PracticeWorkspace initialLanguage={params.lang} />;
}
