"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Extra delay (seconds) — use for staggered grids. */
  delay?: number;
};

/**
 * Scroll-triggered fade-up — reads as intentional “product” motion, not gimmicky.
 * Respects `prefers-reduced-motion` (no animation when the user opts out).
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  // SSR uses `initial`; `opacity: 0` hid entire sections until JS ran — bad first paint / fragile hydration.
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 1, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
