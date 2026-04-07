import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = { className?: string };

/**
 * Simple monogram + wordmark — reads as a real brand in demos.
 * Swap for Ethan’s official logo file in public/brand/ when available.
 */
export function BrandWordmark({ className }: Props) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-charcoal text-xs font-bold tracking-tight text-cream shadow-sm transition group-hover:bg-bronze group-hover:text-charcoal dark:bg-bronze dark:text-charcoal dark:group-hover:bg-bronze-light"
        aria-hidden
      >
        TCK
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight text-charcoal dark:text-cream">
          Total Concept
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
          Kitchens
        </span>
      </span>
    </Link>
  );
}
