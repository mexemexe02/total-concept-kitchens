import type { Metadata } from "next";

/**
 * Canonical URL for a marketing path (relative to `metadataBase` in root layout).
 * We only set `alternates` here so we do not replace the root layout’s full `openGraph` object.
 */
export function marketingPageMeta(path: string): Pick<Metadata, "alternates"> {
  const normalized = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  return {
    alternates: { canonical: normalized },
  };
}
