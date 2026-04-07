import type { Metadata } from "next";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { PageHeader } from "@/components/site/PageHeader";
import { getGalleryData } from "@/lib/get-gallery-items";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Kitchen project photos and finishes from ${siteConfig.name}.`,
};

/** Revalidate this route periodically so Instagram-backed tiles refresh without redeploying. */
export const revalidate = 3600;

export default async function GalleryPage() {
  const { items, source, usingRemotePlaceholders } = await getGalleryData();

  return (
    <main>
      <PageHeader
        title="Gallery"
        description={
          source === "instagram"
            ? `Project photos from ${siteConfig.social.instagramHandle} on Instagram.`
            : "Recent kitchen and cabinetry photography from our portfolio."
        }
      />
      <GalleryGrid
        items={items}
        source={source}
        usingRemotePlaceholders={usingRemotePlaceholders}
      />
    </main>
  );
}
