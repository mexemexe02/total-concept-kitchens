import Link from "next/link";
import { LogoOrWordmark } from "@/components/site/LogoOrWordmark";
import { mainNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-stone-200/70 bg-cream/80 backdrop-blur-xl backdrop-saturate-150",
        "shadow-sm shadow-stone-900/5 dark:border-stone-800 dark:bg-charcoal/80 dark:shadow-black/20",
        "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-bronze/25 after:to-transparent",
        /* Extra vertical room so logo + ring-offset + pulse glow stay inside the bar, not over the hero */
        "relative",
      )}
    >
      <div className="mx-auto flex min-h-[5.5rem] max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:min-h-[6rem] sm:px-6 sm:py-3.5">
        <LogoOrWordmark />
        <nav
          className="hidden items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-300 md:flex"
          aria-label="Primary"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-[0.9375rem] tracking-tight transition hover:bg-stone-900/[0.04] hover:text-bronze dark:hover:bg-white/[0.06] dark:hover:text-bronze-light"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-cream shadow-sm ring-1 ring-charcoal/20 transition hover:bg-bronze hover:ring-bronze/40 dark:bg-bronze dark:text-charcoal dark:ring-bronze/30 dark:hover:bg-bronze-light"
        >
          Book consult
        </Link>
      </div>
      <nav
        className="flex gap-6 overflow-x-auto border-t border-stone-200/80 px-4 py-2.5 text-sm font-medium text-stone-600 dark:border-stone-800 dark:text-stone-400 md:hidden"
        aria-label="Primary mobile"
      >
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 hover:text-bronze dark:hover:text-bronze-light"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
