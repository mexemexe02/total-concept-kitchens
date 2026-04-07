import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { siteConfig } from "@/lib/site-config";

/** Full-width call-to-action before the footer link grid. */
export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-16 text-cream">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-bronze/15 blur-[100px] motion-safe:animate-hero-aurora-slow" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6">
        <Reveal>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to explore what is possible in your space?
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-stone-400">
              Book a consultation with {siteConfig.ownerName}. Bring inspiration
              photos and rough measurements — we will turn ideas into a clear plan.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-bronze px-6 py-3 text-sm font-semibold text-charcoal shadow-lg shadow-black/30 transition hover:bg-bronze-light hover:shadow-xl motion-safe:hover:scale-[1.02]"
            >
              Request a consult
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-cream/25 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition hover:border-cream hover:bg-cream/10 motion-safe:hover:scale-[1.02]"
            >
              Browse the gallery
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
