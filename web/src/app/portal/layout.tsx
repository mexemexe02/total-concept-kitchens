import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biz portal",
  robots: { index: false, follow: false },
};

/**
 * Minimal chrome for Ethan’s portal — no marketing header noise.
 */
export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950">
      <header className="border-b border-stone-200 bg-charcoal px-4 py-4 text-cream dark:border-stone-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">
            Total Concept Kitchens — Biz portal
          </span>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-10">{children}</div>
    </div>
  );
}
