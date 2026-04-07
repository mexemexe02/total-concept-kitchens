/**
 * Business info for the marketing site.
 *
 * Defaults match Meta profiles (verified in browser 2026-04-05). See
 * `content/META_PROFILE_SNAPSHOT.md` and `content/business-profile-source.json`.
 * Override any field with `NEXT_PUBLIC_TCK_*` in `.env.local` (see `.env.example`).
 *
 * Logo: `public/brand/logo.png` (or .jpg / .webp) — see `public/brand/README.txt`.
 */
function env(key: string, fallback: string): string {
  const v = process.env[key];
  return v != null && String(v).trim() !== "" ? String(v).trim() : fallback;
}

function envOptional(key: string): string | undefined {
  const v = process.env[key];
  return v != null && String(v).trim() !== "" ? String(v).trim() : undefined;
}

export const siteConfig = {
  name: "Total Concept Kitchens",

  tagline: env(
    "NEXT_PUBLIC_TCK_TAGLINE",
    "Custom kitchen design, cabinetry, and installation. One team from first drawings to final walkthrough.",
  ),

  ownerName: env("NEXT_PUBLIC_TCK_OWNER_NAME", "Ethan"),
  ownerRole: env("NEXT_PUBLIC_TCK_OWNER_ROLE", "Owner"),

  /** From Facebook Page contact (re-verify before launch). */
  phoneDisplay: env("NEXT_PUBLIC_TCK_PHONE_DISPLAY", "(705) 309-4443"),
  /** E.164 for tel: links */
  phoneTel: env("NEXT_PUBLIC_TCK_PHONE_TEL", "+17053094443"),
  email: env(
    "NEXT_PUBLIC_TCK_EMAIL",
    "totalconceptkitchens@gmail.com",
  ),

  city: env("NEXT_PUBLIC_TCK_CITY", "Barrie"),
  region: env("NEXT_PUBLIC_TCK_REGION", "Ontario"),

  /** Street line from Instagram business profile / Facebook About. */
  streetAddress: env("NEXT_PUBLIC_TCK_STREET_ADDRESS", "438 Dunlop St W"),

  /** Postal code shown after city/region in footer and contact. */
  postalCode: env("NEXT_PUBLIC_TCK_POSTAL", "L4N 1C2"),

  /** e.g. Mon–Fri 8am–5pm — optional, from Page About. */
  hours: envOptional("NEXT_PUBLIC_TCK_HOURS"),

  serviceArea: env(
    "NEXT_PUBLIC_TCK_SERVICE_AREA",
    "Handmade custom cabinetry — Simcoe County, Muskoka & surrounding areas.",
  ),

  /** Canonical site URL for Open Graph (production domain when you launch). */
  url: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3012"),

  presentationMode:
    env("NEXT_PUBLIC_TCK_PRESENTATION_MODE", "true").toLowerCase() === "true",

  social: {
    facebookUrl:
      "https://www.facebook.com/p/Total-Concept-Kitchens-100031038951078/",
    instagramUrl: "https://www.instagram.com/totalconceptkitchens/",
    instagramHandle: "@totalconceptkitchens",
  },
};
