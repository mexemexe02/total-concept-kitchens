import { CtaBand } from "@/components/site/CtaBand";
import { HeroSection } from "@/components/site/HeroSection";
import { HomeHighlights } from "@/components/site/HomeHighlights";
import { StatsStrip } from "@/components/site/StatsStrip";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { WhyChooseSection } from "@/components/site/WhyChooseSection";

export default async function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsStrip />
      <WhyChooseSection />
      <TestimonialsSection />
      <CtaBand />
      <HomeHighlights />
    </main>
  );
}
