import type { Metadata } from "next";
import { CtaBand } from "@/components/site/CtaBand";
import { HeroSection } from "@/components/site/HeroSection";
import { HomeHighlights } from "@/components/site/HomeHighlights";
import { StatsStrip } from "@/components/site/StatsStrip";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { WhyChooseSection } from "@/components/site/WhyChooseSection";
import { marketingPageMeta } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...marketingPageMeta("/"),
};

export default async function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <HeroSection />
      <StatsStrip />
      <WhyChooseSection />
      <TestimonialsSection />
      <CtaBand />
      <HomeHighlights />
    </main>
  );
}
