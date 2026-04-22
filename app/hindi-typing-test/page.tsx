import type { Metadata } from "next";
import { SeoCopyBlock } from "@/components/marketing/seo-copy-block";

export const metadata: Metadata = {
  title: "Hindi Typing Test",
  description: "Train Hindi typing with grapheme-aware comparison built for Devanagari input."
};

export default function HindiTypingTestPage() {
  return (
    <SeoCopyBlock
      title="Hindi Typing Test"
      intro="Hindi typing needs more than naive character splitting. Typezy uses grapheme-aware comparison so Devanagari input can be scored more accurately and feel trustworthy."
      bullets={["Unicode-aware grapheme segmentation", "Hindi-specific practice content", "Analytics that surface real weak keys"]}
    />
  );
}
