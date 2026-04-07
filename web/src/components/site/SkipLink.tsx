import Link from "next/link";

/**
 * Keyboard / screen-reader affordance: jumps past header + breadcrumb into page content.
 * Visible only when focused (WCAG 2.4.1 bypass blocks).
 */
export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-lg bg-bronze px-4 py-3 text-sm font-semibold text-charcoal shadow-lg outline-none ring-2 ring-cream ring-offset-2 ring-offset-charcoal transition-transform focus:translate-y-0 dark:ring-offset-charcoal"
    >
      Skip to main content
    </Link>
  );
}
