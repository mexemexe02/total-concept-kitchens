"use client";

import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SHOW_AFTER_PX = 400;

/**
 * Fixed control away from Mise (bottom-right) — left side, same vertical band.
 * Respects reduced motion for scroll behavior.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Back to top"
      className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-cream/95 text-charcoal shadow-lg backdrop-blur-sm transition hover:border-bronze/40 hover:bg-bronze hover:text-charcoal dark:border-stone-600 dark:bg-charcoal/95 dark:text-cream dark:hover:bg-bronze dark:hover:text-charcoal"
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2} aria-hidden />
    </button>
  );
}
