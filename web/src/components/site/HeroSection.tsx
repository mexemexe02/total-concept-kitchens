import fs from "fs";
import path from "path";
import Image from "next/image";
import { HeroAnimatedCopy } from "@/components/site/HeroAnimatedCopy";
import { demoHero } from "@/lib/demo-content";
import { fallbackGalleryItems } from "@/lib/gallery-fallback";
import { getPortalSettings } from "@/lib/portal-settings";
import { siteConfig } from "@/lib/site-config";

/**
 * Last resort when Ethan’s `public/social/ig-*.jpg` files are not in the deploy (e.g. empty public/).
 * @see https://unsplash.com/license
 */
const HERO_REMOTE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85";

type HeroAsset = { src: string; alt: string; local: boolean };

/**
 * Instagram stills under `public/social/` (same sources as `gallery-fallback.ts`).
 * Order favors **cabinetry-forward** frames for the hero: reeded wall, reface, then full kitchens.
 * We do not use `hero-ig.jpg` (unreliable) or demo stock — Ethan’s downloads only when present.
 */
const HERO_SOCIAL_ORDER = [
  "/social/ig-05.jpg",
  "/social/ig-06.jpg",
  "/social/ig-02.jpg",
  "/social/ig-01.jpg",
  "/social/ig-04.jpg",
  "/social/ig-03.jpg",
] as const;

function resolveHeroAsset(cwd: string): HeroAsset {
  const altBySrc = new Map(
    fallbackGalleryItems.map((item) => [item.src, item.alt] as const),
  );

  for (const src of HERO_SOCIAL_ORDER) {
    const disk = path.join(cwd, "public", ...src.split("/").filter(Boolean));
    if (fs.existsSync(disk)) {
      return {
        src,
        alt:
          altBySrc.get(src) ??
          "Total Concept Kitchens — custom cabinetry project photo",
        local: true,
      };
    }
  }

  return {
    src: HERO_REMOTE,
    alt: "Sample kitchen interior — add Ethan’s JPEGs to public/social/ (ig-01.jpg … ig-06.jpg)",
    local: false,
  };
}

export async function HeroSection() {
  const portal = await getPortalSettings();
  const { src: heroSrc, alt: heroAlt, local: useLocal } = resolveHeroAsset(
    process.cwd(),
  );

  const eyebrow = portal.heroEyebrow?.trim() || demoHero.eyebrow;
  const headline = portal.heroHeadline?.trim() || demoHero.headline;
  const supporting = portal.heroSupporting?.trim() || demoHero.supporting;
  const trustLine = portal.heroTrustLine?.trim() || demoHero.trustLine;

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
        welcomePrefix="Welcome to"
        companyName={siteConfig.name}
        eyebrow={eyebrow}
        headline={headline}
        supporting={supporting}
        trustLine={trustLine}
      />
    </section>
  );
}
