import type { GalleryItem } from "@/lib/gallery-types";

/**
 * Fetches recent media via the official Instagram Graph API.
 *
 * Why not scrape facebook.com / instagram.com?
 * - Violates Meta Terms of Service and breaks when HTML changes.
 * - Logged-out pages often block server-side fetch.
 *
 * Setup (summary):
 * 1. Instagram account must be Business or Creator.
 * 2. Link it to a Facebook Page you manage.
 * 3. Create a Meta app → add Instagram Graph API → generate a long-lived User/Page token with instagram_basic (and permissions for media).
 * 4. Find Instagram User ID (Graph API Explorer: {page-id}?fields=instagram_business_account).
 *
 * Docs: https://developers.facebook.com/docs/instagram-api
 */
const GRAPH_VERSION = "v21.0";

type IgMediaNode = {
  id: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  caption?: string;
};

function imageUrlForMedia(m: IgMediaNode): string | null {
  if (m.media_type === "VIDEO") {
    return m.thumbnail_url ?? m.media_url ?? null;
  }
  return m.media_url ?? m.thumbnail_url ?? null;
}

function altFromCaption(caption: string | undefined, index: number): string {
  if (!caption?.trim()) {
    return `Photo ${index + 1} from Total Concept Kitchens on Instagram`;
  }
  const oneLine = caption.replace(/\s+/g, " ").trim();
  /** Alt text should stay short; full copy lives in `caption` on the item. */
  return oneLine.length > 125 ? `${oneLine.slice(0, 122)}…` : oneLine;
}

const CAPTION_UI_MAX = 280;

function captionForUi(caption: string | undefined): string | undefined {
  if (!caption?.trim()) {
    return undefined;
  }
  const t = caption.replace(/\s+/g, " ").trim();
  return t.length > CAPTION_UI_MAX ? `${t.slice(0, CAPTION_UI_MAX - 1)}…` : t;
}

export async function fetchInstagramGallery(
  limit = 12,
): Promise<GalleryItem[] | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) {
    return null;
  }

  const url = new URL(
    `https://graph.facebook.com/${GRAPH_VERSION}/${userId}/media`,
  );
  url.searchParams.set(
    "fields",
    "id,media_type,media_url,thumbnail_url,permalink,caption",
  );
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  const json: { data?: IgMediaNode[] } = await res.json();
  const nodes = json.data;
  if (!nodes?.length) {
    return null;
  }

  const items: GalleryItem[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const m = nodes[i];
    const src = imageUrlForMedia(m);
    if (!src) {
      continue;
    }
    items.push({
      id: m.id,
      src,
      alt: altFromCaption(m.caption, i),
      caption: captionForUi(m.caption),
      href: m.permalink,
      source: "instagram",
    });
  }

  return items.length ? items : null;
}
