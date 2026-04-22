import type { Metadata } from "next";
import { LanguageCards } from "@/components/marketing/language-cards";

export const metadata: Metadata = {
  title: "Languages",
  description: "Practice English, Hindi, Spanish, French, and German typing with Typezy."
};

export default function LanguagesPage() {
  return <LanguageCards />;
}
