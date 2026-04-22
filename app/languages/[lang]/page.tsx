import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageDetail } from "@/components/marketing/language-detail";
import { LANGUAGES } from "@/lib/content/languages";
import { LanguageCode } from "@/lib/types";

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const language = LANGUAGES[lang as LanguageCode];
  if (!language) {
    return {};
  }

  return {
    title: `${language.label} Typing Practice`,
    description: language.seoIntro
  };
}

export default async function LanguagePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) {
    notFound();
  }

  return <LanguageDetail language={lang as LanguageCode} />;
}
