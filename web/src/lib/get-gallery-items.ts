import { cache } from "react";
import { dedupeGalleryItemsBySrc } from "@/lib/gallery-dedupe";
import { remotePlaceholderGalleryItems } from "@/lib/gallery-fallback-remote";
import { fallbackGalleryItems } from "@/lib/gallery-fallback";
import type { GalleryItem } from "@/lib/gallery-types";
import { filterToExistingPublicFiles } from "@/lib/gallery-local-files";
import { fetchInstagramGallery } from "@/lib/instagram-graph";

export type GalleryData = {
  items: GalleryItem[];
  source: "instagram" | "fallback";
  /** True when Unsplash placeholders are used (no local `/social/` JPEGs and no IG tiles). */
  usingRemotePlaceholders?: boolean;
};

const GALLERY_TILE_TARGET = 12;
/** Fetch extra from Graph API so we still fill the grid after removing duplicate URLs. */
const INSTAGRAM_FETCH_BUFFER = 18;

/**
 * One fetch per request (deduped). Prefers Instagram when API credentials work.
 */
export const getGalleryData = cache(async (): Promise<GalleryData> => {
  const ig = await fetchInstagramGallery(INSTAGRAM_FETCH_BUFFER);
  if (ig?.length) {
    const unique = dedupeGalleryItemsBySrc(ig);
    if (unique.length > 0) {
      return {
        items: unique.slice(0, GALLERY_TILE_TARGET),
        source: "instagram",
        usingRemotePlaceholders: false,
      };
    }
  }

  const localReady = filterToExistingPublicFiles(
    dedupeGalleryItemsBySrc([...fallbackGalleryItems]),
  );
  if (localReady.length > 0) {
    return {
      items: localReady.slice(0, GALLERY_TILE_TARGET),
      source: "fallback",
      usingRemotePlaceholders: false,
    };
  }

  return {
    items: remotePlaceholderGalleryItems.slice(0, GALLERY_TILE_TARGET),
    source: "fallback",
    usingRemotePlaceholders: true,
  };
});
