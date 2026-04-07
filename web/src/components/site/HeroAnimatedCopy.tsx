"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

type Props = {
  eyebrow: string;
  headline: string;
  supporting: string;
  trustLine: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Staggered hero typography + CTAs — “futuristic” through timing and depth,
 * not neon. Skips motion when the visitor prefers reduced motion.
 */
export function HeroAnimatedCopy({
  eyebrow,
  headline,
  supporting,
  trustLine,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 py-28 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-bronze-light">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[3.35rem]">
          {headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300 md:text-xl">
          {supporting}
        </p>
        <p className="mt-4 max-w-2xl text-sm text-stone-500">{trustLine}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-bronze px-7 py-3.5 text-sm font-semibold text-charcoal shadow-lg shadow-black/20 transition hover:bg-bronze-light"
          >
            Schedule a consultation
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-cream/35 bg-cream/5 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition hover:border-cream hover:bg-cream/15"
          >
            View project gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 py-28 sm:px-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.11, delayChildren: 0.08 },
        },
      }}
    >
      <motion.p
        className="text-sm font-medium uppercase tracking-[0.22em] text-bronze-light"
        variants={{
          hidden: { opacity: 1, y: 18 },
          show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
        }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[3.35rem]"
        variants={{
          hidden: { opacity: 1, y: 28 },
          show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
        }}
      >
        {headline}
      </motion.h1>
      <motion.p
        className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300 md:text-xl"
        variants={{
          hidden: { opacity: 1, y: 22 },
          show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
        }}
      >
        {supporting}
      </motion.p>
      <motion.p
        className="mt-4 max-w-2xl text-sm text-stone-500"
        variants={{
          hidden: { opacity: 1, y: 14 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
        }}
      >
        {trustLine}
      </motion.p>
      <motion.div
        className="mt-10 flex flex-wrap gap-4"
        variants={{
          hidden: { opacity: 1, y: 18 },
          show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
        }}
      >
        <Link
          href="/contact"
          className="rounded-full bg-bronze px-7 py-3.5 text-sm font-semibold text-charcoal shadow-lg shadow-black/30 transition hover:bg-bronze-light hover:shadow-xl motion-safe:hover:scale-[1.02]"
        >
          Schedule a consultation
        </Link>
        <Link
          href="/gallery"
          className="rounded-full border border-cream/35 bg-cream/5 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition hover:border-cream hover:bg-cream/15 motion-safe:hover:scale-[1.02]"
        >
          View project gallery
        </Link>
      </motion.div>
    </motion.div>
  );
}
