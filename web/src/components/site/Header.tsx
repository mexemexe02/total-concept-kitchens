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
        "relative",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <LogoOrWordmark />
        <nav
          className="hidden items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-300 md:flex"
          aria-label="Primary"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-bronze dark:hover:text-bronze-light"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-cream shadow-sm transition hover:bg-bronze dark:bg-bronze dark:text-charcoal dark:hover:bg-bronze-light"
        >
          Book consult
        </Link>
      </div>
      <nav
        className="flex gap-6 overflow-x-auto border-t border-stone-200/80 px-4 py-2 text-sm font-medium text-stone-600 dark:border-stone-800 dark:text-stone-400 md:hidden"
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
