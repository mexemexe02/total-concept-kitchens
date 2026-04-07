export type MiseFaqRow = {
  id: number;
  q: string;
  a: string;
  tags?: string[];
};

export type PortalSettings = {
  /** Optional site-wide banner (HTML escaped when rendered as text). */
  announcementBanner: string | null;
  /** Replaces default Mise greeting in the widget. */
  chatGreeting: string | null;
  /** Short note shown under the chat input. */
  chatFooterNote: string | null;
  /** ISO timestamp of last portal save. */
  updatedAt: string | null;
};
