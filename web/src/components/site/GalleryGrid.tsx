import { GalleryTiles } from "@/components/site/GalleryTiles";
import type { GalleryItem } from "@/lib/gallery-types";
import { siteConfig } from "@/lib/site-config";

type Props = {
  items: GalleryItem[];
  /** Shown under the title when Instagram is not wired yet. */
  source: "instagram" | "fallback";
  /** Unsplash stand-ins when `public/social/ig-*.jpg` are missing. */
  usingRemotePlaceholders?: boolean;
};

export function GalleryGrid({
  items,
  source,
  usingRemotePlaceholders,
}: Props) {
  return (
    <section className="bg-cream py-20 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {usingRemotePlaceholders ? (
          <p
            className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-100"
            role="status"
          >
            You are seeing <strong>sample kitchen photos</strong> (Unsplash) because
            the real JPEGs are not in <code className="rounded bg-black/5 px-1 dark:bg-white/10">public/social/</code>{" "}
            on this machine. Add <code className="rounded bg-black/5 px-1 dark:bg-white/10">ig-01.jpg</code>…
            <code className="rounded bg-black/5 px-1 dark:bg-white/10">ig-06.jpg</code> or set up the Instagram
            Graph API to pull live posts — see <code className="rounded bg-black/5 px-1 dark:bg-white/10">ATTRIBUTION.txt</code>.
          </p>
        ) : null}
        <h2 className="text-3xl font-semibold tracking-tight text-charcoal dark:text-cream sm:text-4xl">
          {source === "instagram" ? "Recent work" : "Project gallery"}
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-400">
          {source === "instagram" ? (
            <>
              From{" "}
              <a
                href={siteConfig.social.instagramUrl}
                className="font-medium text-bronze underline-offset-2 hover:underline dark:text-bronze-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.social.instagramHandle}
              </a>{" "}
              on Instagram. Tap a photo to enlarge; use arrows to browse.
            </>
          ) : (
            <>
              A selection of recent kitchens and built-ins. Tap any image for a
              larger view. For the newest photos, visit{" "}
              <a
                href={siteConfig.social.instagramUrl}
                className="font-medium text-bronze underline-offset-2 hover:underline dark:text-bronze-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.social.instagramHandle}
              </a>
              .
            </>
          )}
        </p>
        <GalleryTiles items={items} source={source} />
      </div>
    </section>
  );
}
