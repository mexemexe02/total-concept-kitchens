import type { GalleryItem } from "@/lib/gallery-types";

/**
 * Real project stills in `public/social/` plus **Instagram caption copy** (opened from
 * each post in the grid, 2026-04-05). `alt` is shortened for accessibility; `caption`
 * mirrors the on-Instagram description visitors see when they tap the post.
 *
 * Permalinks point at the matching `/p/…/` so the tile opens the right post.
 * When `INSTAGRAM_ACCESS_TOKEN` is set, live API media replaces this list.
 */
export const fallbackGalleryItems: GalleryItem[] = [
  {
    id: "fallback-1",
    src: "/social/ig-01.jpg",
    alt: "Kitchen with vaulted ceiling, exposed beams, large island, and extra-tall custom range hood — Elmvale area project",
    caption:
      "Showstopper! From the 15' vaulted ceilings and exposed beams, to the 10'×5' island and 6' tall custom hood range — this kitchen is an entertainer's dream!",
    href: "https://www.instagram.com/p/DMdjufgOvQs/",
    source: "fallback",
  },
  {
    id: "fallback-2",
    src: "/social/ig-02.jpg",
    alt: "Bright kitchen with soft neutral finishes — Barrie area cabinetry project",
    caption:
      "Soft, inviting and timeless tones throughout the space make you feel welcomed the second you walk through the door. We love how this one came together!",
    href: "https://www.instagram.com/p/DNk3AoNuIuu/",
    source: "fallback",
  },
  {
    id: "fallback-3",
    src: "/social/ig-03.jpg",
    alt: "Custom kitchen at Lake Dalrymple — lodge-style project",
    caption: "Project Dalrymple Lodge",
    href: "https://www.instagram.com/p/DWJoek0joZm/",
    source: "fallback",
  },
  {
    id: "fallback-4",
    src: "/social/ig-04.jpg",
    alt: "Finished kitchen install — Midhurst, Ontario home",
    caption:
      "All wrapped up for some incredible clients at this stunning Midhurst home.",
    href: "https://www.instagram.com/p/DMbbT5KuoBK/",
    source: "fallback",
  },
  {
    id: "fallback-5",
    src: "/social/ig-05.jpg",
    alt: "Cabinet wall with custom reeded door fronts — Barrie project",
    caption:
      "Not sure what to do with that empty wall space? We've got you covered! Loving these custom reeded fronts.",
    href: "https://www.instagram.com/p/DVyu6yVjobO/",
    source: "fallback",
  },
  {
    id: "fallback-6",
    src: "/social/ig-06.jpg",
    alt: "Cabinet reface and kitchen update — Orillia area, collaboration project",
    caption: "Cabinet reface with @totalconceptkitchens 💕",
    href: "https://www.instagram.com/p/DT-poocDoIA/",
    source: "fallback",
  },
];

/** Local paths used by the gallery — exported so the hero can avoid repeating any of them. */
export const fallbackGalleryImageSrcs: readonly string[] = fallbackGalleryItems.map(
  (item) => item.src,
);

if (new Set(fallbackGalleryImageSrcs).size !== fallbackGalleryImageSrcs.length) {
  throw new Error(
    "[gallery-fallback] Duplicate src in fallbackGalleryItems — use distinct files under public/social/",
  );
}
