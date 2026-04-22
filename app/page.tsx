import { AnalyticsPreview } from "@/components/marketing/analytics-preview";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HomeFaq } from "@/components/marketing/home-faq";
import { HomeHero } from "@/components/marketing/home-hero";
import { LanguageCards } from "@/components/marketing/language-cards";
import { LaunchShowcase } from "@/components/marketing/launch-showcase";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <LaunchShowcase />
      <AnalyticsPreview />
      <FeatureGrid />
      <LanguageCards />
      <HomeFaq />
    </>
  );
}
