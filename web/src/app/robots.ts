import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Block staff portal and server routes from indexing; advertise sitemap URL.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
