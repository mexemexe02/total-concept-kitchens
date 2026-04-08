"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Keeps `<html class="dark">` in sync with `?dark=1` / `?dark=0` and system preference.
 * The inline script in `layout.tsx` only runs on full page loads; Next.js client navigations
 * need this effect or `dark:` utilities never activate after in-app routing.
 */
export function DarkModeSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const darkFlag = searchParams.get("dark");

  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      if (darkFlag === "1") {
        root.classList.add("dark");
        return;
      }
      if (darkFlag === "0") {
        root.classList.remove("dark");
        return;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    apply();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pathname, darkFlag]);

  return null;
}
