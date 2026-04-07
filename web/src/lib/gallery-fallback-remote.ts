import type { GalleryItem } from "@/lib/gallery-types";

/**
 * Used only when **no** Instagram API tiles and **no** local `/social/ig-*.jpg` files exist
 * (e.g. fresh clone without binary assets). Images are from **Unsplash** (their license
 * allows this use); replace with real project JPEGs in `public/social/` when you can.
 *
 * @see https://unsplash.com/license
 */
export const remotePlaceholderGalleryItems: GalleryItem[] = [
  {
    id: "placeholder-unsplash-1",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    alt: "Minimal kitchen with island seating and cabinetry (sample image)",
    caption:
      "Sample imagery from Unsplash — add your project photos to public/social/ to replace this grid.",
    href: "https://www.instagram.com/totalconceptkitchens/",
    source: "fallback",
  },
  {
    id: "placeholder-unsplash-2",
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80",
    alt: "Contemporary kitchen with range hood and counter lighting (sample image)",
    caption:
      "Sample imagery — see public/social/ATTRIBUTION.txt for how to use your own stills.",
    href: "https://www.instagram.com/totalconceptkitchens/",
    source: "fallback",
  },
  {
    id: "placeholder-unsplash-3",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    alt: "Open-plan kitchen and dining with natural light (sample image)",
    caption:
      "Placeholder until ig-01.jpg … ig-06.jpg are restored under public/social/.",
    href: "https://www.instagram.com/totalconceptkitchens/",
    source: "fallback",
  },
  {
    id: "placeholder-unsplash-4",
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80",
    alt: "Contemporary kitchen detail with lighting (sample image)",
    caption:
      "Sample imagery from Unsplash — not a Total Concept Kitchens project photo.",
    href: "https://www.instagram.com/totalconceptkitchens/",
    source: "fallback",
  },
  {
    id: "placeholder-unsplash-5",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    alt: "Minimal kitchen with island seating (sample image)",
    caption:
      "Replace this grid by adding JPEGs and keeping gallery-fallback.ts paths in sync.",
    href: "https://www.instagram.com/totalconceptkitchens/",
    source: "fallback",
  },
  {
    id: "placeholder-unsplash-6",
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
    alt: "Warm-toned kitchen cabinetry (sample image)",
    caption:
      "Configure INSTAGRAM_ACCESS_TOKEN to pull live posts instead of placeholders.",
    href: "https://www.instagram.com/totalconceptkitchens/",
    source: "fallback",
  },
];
