import type { Metadata } from "next";
import { SeoCopyBlock } from "@/components/marketing/seo-copy-block";

export const metadata: Metadata = {
  title: "Improve Typing Speed",
  description: "Improve typing speed with data-backed drills, consistency tracking, and adaptive practice."
};

export default function ImproveTypingSpeedPage() {
  return (
    <SeoCopyBlock
      title="Improve Typing Speed"
      intro="Improving typing speed is easier when the feedback loop is short and honest. Typezy combines pace tracking, weak-key analysis, and repeatable drills so you can increase speed without sacrificing control."
      bullets={["Recommendations after every session", "Adaptive drills for weak keys and words", "Streaks and personal best tracking"]}
    />
  );
}
