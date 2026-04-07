"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Slug → label for marketing routes (matches nav + About). */
const LABELS: Record<string, string> = {
  services: "Services",
  process: "Process",
  gallery: "Gallery",
  contact: "Contact",
  about: "About",
};

/**
 * Secondary navigation + SEO hint. Hidden on home; current page is plain text (aria-current).
 */
export function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-stone-200/90 bg-cream/95 dark:border-stone-800 dark:bg-charcoal/95"
    >
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-400 sm:px-6">
        <li className="min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md transition hover:text-bronze dark:hover:text-bronze-light"
          >
            <Home className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
            <span>Home</span>
          </Link>
        </li>
        {segments.map((seg, i) => {
          const href = `/${segments.slice(0, i + 1).join("/")}`;
          const label = LABELS[seg] ?? seg.replace(/-/g, " ");
          const last = i === segments.length - 1;
          return (
            <li key={href} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-stone-400 dark:text-stone-500"
                aria-hidden
              />
              {last ? (
                <span
                  className="truncate font-medium text-charcoal dark:text-cream"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="truncate rounded-md transition hover:text-bronze dark:hover:text-bronze-light"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
