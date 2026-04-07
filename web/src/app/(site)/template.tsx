"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Re-mounts on every navigation within `(site)` — light page transition so routes
 * feel connected without heavy “app shell” complexity.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  // Opacity must stay 1 on the server paint — `opacity: 0` SSR + hydration issues left the main column blank in some browsers.
  return (
    <motion.div
      initial={{ opacity: 1, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
