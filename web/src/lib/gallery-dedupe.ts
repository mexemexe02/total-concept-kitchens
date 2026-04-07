import type { GalleryItem } from "@/lib/gallery-types";

/**
 * Instagram (and Meta) image URLs often differ only by query string (cache-busters,
 * auth tokens). Treat origin + pathname as one logical asset so the grid does not
 * show the same photo twice when the API returns duplicates.
 */
export function mediaKeyForSrc(src: string): string {
  if (!src.startsWith("http://") && !src.startsWith("https://")) {
    return src;
  }
  try {
    const u = new URL(src);
    return `${u.origin}${u.pathname}`;
  } catch {
    return src;
  }
}

/**
 * Keeps the first tile for each unique image URL / local path.
 */
export function dedupeGalleryItemsBySrc(items: GalleryItem[]): GalleryItem[] {
  const seen = new Set<string>();
  const out: GalleryItem[] = [];
  for (const item of items) {
    const key = mediaKeyForSrc(item.src);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(item);
  }
  return out;
}
