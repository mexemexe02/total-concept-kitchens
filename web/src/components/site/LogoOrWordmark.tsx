import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { BrandWordmark } from "@/components/site/BrandWordmark";
import { siteConfig } from "@/lib/site-config";

const LOGO_EXTENSIONS = ["svg", "png", "jpg", "jpeg", "webp"] as const;

/**
 * Picks the first `logo.{ext}` that exists under `public/brand/`.
 * Server-side check avoids a broken `<img>` flash when raster files are not in the repo.
 */
function resolveLogoPublicPath(): string | null {
  const dir = path.join(process.cwd(), "public", "brand");
  for (const ext of LOGO_EXTENSIONS) {
    if (fs.existsSync(path.join(dir, `logo.${ext}`))) {
      return `/brand/logo.${ext}`;
    }
  }
  return null;
}

export function LogoOrWordmark() {
  const src = resolveLogoPublicPath();
  if (!src) {
    return <BrandWordmark />;
  }

  const isSvg = src.endsWith(".svg");

  return (
    <Link href="/" className="block shrink-0" aria-label={`${siteConfig.name} home`}>
      {isSvg ? (
        // eslint-disable-next-line @next/next/no-img-element -- SVG from public; avoids next/image SVG config
        <img
          src={src}
          alt={`${siteConfig.name} logo`}
          width={820}
          height={473}
          className="h-12 w-auto max-w-[min(420px,72vw)] object-contain object-left sm:h-14 sm:max-w-[min(480px,65vw)]"
        />
      ) : (
        <Image
          src={src}
          alt={`${siteConfig.name} logo`}
          width={820}
          height={473}
          className="h-12 w-auto max-w-[min(420px,72vw)] object-contain object-left sm:h-14 sm:max-w-[min(480px,65vw)]"
          priority
        />
      )}
    </Link>
  );
}
