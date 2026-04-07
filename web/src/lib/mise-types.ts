export type MiseFaqRow = {
  id: number;
  q: string;
  a: string;
  tags?: string[];
};

/**
 * Ethan-editable site copy via `/portal` → `content/portal-settings.json`.
 * Most fields are optional overrides; null/empty = use built-in defaults from code/env.
 */
export type PortalSettings = {
  /** Optional site-wide banner (HTML escaped when rendered as text). */
  announcementBanner: string | null;
  /** Replaces default Mise greeting in the widget. */
  chatGreeting: string | null;
  /** Short note shown under the chat input. */
  chatFooterNote: string | null;
  /** ISO timestamp of last portal save. */
  updatedAt: string | null;

  /** 1. Home hero — bronze category line above the headline. */
  heroEyebrow: string | null;
  /** 2. Home hero — main headline (H1). */
  heroHeadline: string | null;
  /** 3. Home hero — supporting paragraph under the headline. */
  heroSupporting: string | null;
  /** 4. Home hero — short trust line (services chips). */
  heroTrustLine: string | null;
  /** 5. Hours / availability — shown in footer & contact; overrides env when set. */
  businessHoursLine: string | null;
  /** 6. Link to Google or Facebook reviews — “Leave a review” in footer. */
  reviewPageUrl: string | null;
  /** 7. Contact page — replaces the subtitle under “Contact us”. */
  contactPageIntro: string | null;
  /** 8. Contact page — extra note above the phone/email cards. */
  contactExtraNote: string | null;
  /** 9. Footer — replaces the default business tagline under the company name. */
  footerTagline: string | null;
  /** 10. Private notes for Ethan only — never shown on the public site. */
  ownerPrivateNotes: string | null;
};
