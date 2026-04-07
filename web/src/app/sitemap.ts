import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Crawlable URL list for search engines (see `robots.ts` → sitemap).
 * Paths match marketing `(site)` routes only — no portal or API.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const routes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/process", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/gallery", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: path === "" ? `${base}/` : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
