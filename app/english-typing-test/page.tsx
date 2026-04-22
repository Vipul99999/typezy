import type { Metadata } from "next";
import { SeoCopyBlock } from "@/components/marketing/seo-copy-block";

export const metadata: Metadata = {
  title: "English Typing Test",
  description: "Practice English typing with smooth UX, accurate scoring, and net WPM analytics."
};

export default function EnglishTypingTestPage() {
  return (
    <SeoCopyBlock
      title="English Typing Test"
      intro="Practice English typing with a readable prompt area, instant restarts, and analytics that go beyond gross speed. Typezy helps users build cleaner, more repeatable English typing rhythm."
      bullets={["Readable quote and word drills", "Results with consistency and accuracy", "Optimized for desktop and mobile PWA use"]}
    />
  );
}
