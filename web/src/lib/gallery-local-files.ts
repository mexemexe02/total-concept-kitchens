import fs from "fs";
import path from "path";
import type { GalleryItem } from "@/lib/gallery-types";

/**
 * Keeps only items whose `src` is a remote URL or an existing file under `public/`.
 * When `/social/ig-*.jpg` were never committed, the gallery would otherwise point at 404s.
 */
export function filterToExistingPublicFiles(items: GalleryItem[]): GalleryItem[] {
  return items.filter((item) => {
    if (!item.src.startsWith("/")) {
      return true;
    }
    const rel = item.src.replace(/^\//, "");
    const abs = path.join(process.cwd(), "public", rel);
    return fs.existsSync(abs);
  });
}
