import { describe, expect, it } from "vitest";
import { dedupeGalleryItemsBySrc, mediaKeyForSrc } from "@/lib/gallery-dedupe";
import type { GalleryItem } from "@/lib/gallery-types";

describe("mediaKeyForSrc", () => {
  it("returns local paths unchanged", () => {
    expect(mediaKeyForSrc("/social/ig-01.jpg")).toBe("/social/ig-01.jpg");
  });

  it("strips query string from http URLs", () => {
    const a = "https://cdn.example.com/img.jpg?v=1";
    const b = "https://cdn.example.com/img.jpg?v=2";
    expect(mediaKeyForSrc(a)).toBe(mediaKeyForSrc(b));
    expect(mediaKeyForSrc(a)).toBe("https://cdn.example.com/img.jpg");
  });
});

describe("dedupeGalleryItemsBySrc", () => {
  it("keeps first item when src differs only by query", () => {
    const items: GalleryItem[] = [
      {
        id: "1",
        src: "https://x.com/a.jpg?token=1",
        alt: "a",
        caption: "",
        href: "",
        source: "instagram",
      },
      {
        id: "2",
        src: "https://x.com/a.jpg?token=2",
        alt: "b",
        caption: "",
        href: "",
        source: "instagram",
      },
    ];
    const out = dedupeGalleryItemsBySrc(items);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("1");
  });

  it("keeps distinct paths", () => {
    const items: GalleryItem[] = [
      {
        id: "1",
        src: "/a.jpg",
        alt: "",
        caption: "",
        href: "",
        source: "fallback",
      },
      {
        id: "2",
        src: "/b.jpg",
        alt: "",
        caption: "",
        href: "",
        source: "fallback",
      },
    ];
    expect(dedupeGalleryItemsBySrc(items)).toHaveLength(2);
  });
});
