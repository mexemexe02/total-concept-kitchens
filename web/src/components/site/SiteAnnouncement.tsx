/**
 * Optional banner from `content/portal-settings.json` (edited in /portal).
 * Plain text only — no HTML injection.
 */
export function SiteAnnouncement({ text }: { text: string }) {
  const t = text.trim();
  if (!t) return null;
  return (
    <div
      role="status"
      className="border-b border-bronze/40 bg-bronze/15 px-4 py-2 text-center text-sm font-medium text-charcoal dark:bg-bronze/25 dark:text-cream"
    >
      {t}
    </div>
  );
}
