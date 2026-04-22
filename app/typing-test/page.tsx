import type { Metadata } from "next";
import { SeoCopyBlock } from "@/components/marketing/seo-copy-block";

export const metadata: Metadata = {
  title: "Typing Test",
  description: "Take a fast, free typing test with elegant UX, local analytics, and multilingual support."
};

export default function TypingTestPage() {
  return (
    <SeoCopyBlock
      title="Typing Test"
      intro="Typezy offers a fast typing test experience that balances premium feel with meaningful insight. Start instantly, see net WPM and accuracy clearly, and keep improving with local-first analytics."
      bullets={["Instant start with no signup", "Pace graph and weak-key insights", "Installable PWA for repeat practice"]}
    />
  );
}
