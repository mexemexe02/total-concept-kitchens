/** One tile on the gallery page (Instagram API or local fallback). */
export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  /**
   * Optional visible line(s) under the image — from the Instagram caption when
   * we have it. Keep `alt` concise for screen readers; use `caption` for quotes.
   */
  caption?: string;
  /** Opens the original Instagram post when present. */
  href?: string;
  source: "instagram" | "fallback";
};
