import { siteConfig } from "@/lib/site-config";

/**
 * Structured data for Google / rich results: business + website.
 * Keeps NAP consistent with footer and `siteConfig`.
 */
export function SiteJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${base}/#business`,
        name: siteConfig.name,
        description: siteConfig.tagline,
        url: base,
        telephone: siteConfig.phoneTel,
        email: siteConfig.email,
        image: `${base}/brand/logo.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.streetAddress,
          addressLocality: siteConfig.city,
          addressRegion: siteConfig.region,
          postalCode: siteConfig.postalCode,
          addressCountry: "CA",
        },
        areaServed: siteConfig.serviceArea,
        priceRange: "$$",
        sameAs: [
          siteConfig.social.facebookUrl,
          siteConfig.social.instagramUrl,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: siteConfig.name,
        description: siteConfig.tagline,
        publisher: { "@id": `${base}/#business` },
        inLanguage: "en-CA",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD must be inline for crawlers
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
