import type { PortalSettings } from "@/lib/mise-types";

/** Safe to import from client components — no Node `fs`. */
export const EMPTY_PORTAL_SETTINGS: PortalSettings = {
  announcementBanner: null,
  chatGreeting: null,
  chatFooterNote: null,
  updatedAt: null,
  heroEyebrow: null,
  heroHeadline: null,
  heroSupporting: null,
  heroTrustLine: null,
  businessHoursLine: null,
  reviewPageUrl: null,
  contactPageIntro: null,
  contactExtraNote: null,
  footerTagline: null,
  ownerPrivateNotes: null,
};
