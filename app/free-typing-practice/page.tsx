import type { Metadata } from "next";
import { SeoCopyBlock } from "@/components/marketing/seo-copy-block";

export const metadata: Metadata = {
  title: "Free Typing Practice",
  description: "Free typing practice with a premium interface, adaptive drills, and offline-ready session history."
};

export default function FreeTypingPracticePage() {
  return (
    <SeoCopyBlock
      title="Free Typing Practice"
      intro="Free typing practice should feel focused and motivating, not cluttered. Typezy turns regular drills into a clear improvement system with beautiful pacing and useful feedback."
      bullets={["Time, words, quote, code, and zen modes", "Language support including Hindi", "Local history with streak tracking"]}
    />
  );
}
