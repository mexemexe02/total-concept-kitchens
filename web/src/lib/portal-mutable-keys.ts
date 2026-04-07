import type { PortalSettings } from "@/lib/mise-types";

/** Keys Ethan can POST from the portal (everything except `updatedAt`, set server-side). */
export const PORTAL_MUTABLE_KEYS: readonly (keyof PortalSettings)[] = [
  "announcementBanner",
  "chatGreeting",
  "chatFooterNote",
  "heroEyebrow",
  "heroHeadline",
  "heroSupporting",
  "heroTrustLine",
  "businessHoursLine",
  "reviewPageUrl",
  "contactPageIntro",
  "contactExtraNote",
  "footerTagline",
  "ownerPrivateNotes",
];
