import fs from "fs";
import path from "path";
import Image from "next/image";
import { HeroAnimatedCopy } from "@/components/site/HeroAnimatedCopy";
import { demoHero } from "@/lib/demo-content";
import { fallbackGalleryImageSrcs } from "@/lib/gallery-fallback";

/** Prefer a real still under `public/social/` — see `ATTRIBUTION.txt`. */
const HERO_LOCAL = "/social/hero-ig.jpg";
/** Shown when `hero-ig.jpg` is missing (e.g. clone without binary assets). Unsplash license. */
const HERO_REMOTE =
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2000&q=85";

if (fallbackGalleryImageSrcs.includes(HERO_LOCAL)) {
  throw new Error(
    "[HeroSection] Hero image must not reuse a gallery fallback file — pick another JPEG in public/social/",
  );
}

export async function HeroSection() {
  const disk = path.join(process.cwd(), "public", "social", "hero-ig.jpg");
  const useLocal = fs.existsSync(disk);
  const heroSrc = useLocal ? HERO_LOCAL : HERO_REMOTE;
  const heroAlt = useLocal
    ? "Custom kitchen with large island, tall range hood, and wood ceiling beams"
    : "Sample kitchen interior — replace with public/social/hero-ig.jpg for your project photo";

  return (
    <section className="relative overflow-hidden bg-charcoal text-cream">
      <div className="absolute inset-0">
        {useLocal ? (
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            priority
            className="object-cover opacity-45"
            sizes="100vw"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- remote Unsplash: plain img avoids optimizer edge cases in dev / strict networks
          <img
            src={heroSrc}
            alt={heroAlt}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            fetchPriority="high"
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light"
          aria-hidden
        >
          <div className="absolute -left-[20%] top-[15%] h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full bg-bronze/40 blur-[100px] motion-safe:animate-hero-aurora" />
          <div className="absolute -right-[15%] bottom-[10%] h-[min(55vw,380px)] w-[min(55vw,380px)] rounded-full bg-amber-100/30 blur-[90px] motion-safe:animate-hero-aurora-slow" />
        </div>
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream/25 to-transparent"
          aria-hidden
        />
      </div>
      <HeroAnimatedCopy
        eyebrow={demoHero.eyebrow}
        headline={demoHero.headline}
        supporting={demoHero.supporting}
        trustLine={demoHero.trustLine}
      />
    </section>
  );
}
