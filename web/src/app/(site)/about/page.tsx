import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { marketingPageMeta } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${siteConfig.name} — custom kitchen design, cabinetry, and installation in Simcoe County and area.`,
  ...marketingPageMeta("/about"),
};

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <PageHeader
        title={`About ${siteConfig.name}`}
        description="Kitchen projects are a major investment. We earn trust with clear communication, reliable scheduling, and installation quality you can see in the details."
      />
      <article className="bg-cream py-20 dark:bg-stone-950">
        <div className="mx-auto max-w-3xl space-y-8 px-4 text-stone-700 dark:text-stone-300 sm:px-6">
          <p className="leading-relaxed text-lg">
            Led by <strong>{siteConfig.ownerName}</strong> ({siteConfig.ownerRole}),{" "}
            {siteConfig.name} gives homeowners one accountable partner from first
            measurements through final adjustments — not multiple crews with no
            clear owner of the outcome.
          </p>
          <p className="leading-relaxed">
            We focus on how you use the space: where groceries land, where homework
            happens, how many people cook at once. That shows up in island depth,
            drawer layout, and lighting — not only in renderings.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            <li>Written scope and milestones so billing aligns with progress.</li>
            <li>Finish samples in hand before full orders are placed.</li>
            <li>Final walkthrough checklist so open items are resolved.</li>
          </ul>
          <p className="leading-relaxed">
            <Link
              href="/contact"
              className="font-semibold text-bronze underline-offset-4 hover:underline dark:text-bronze-light"
            >
              Request a consult
            </Link>
            , explore{" "}
            <Link
              href="/services"
              className="font-semibold text-bronze underline-offset-4 hover:underline dark:text-bronze-light"
            >
              services
            </Link>
            , or see{" "}
            <Link
              href="/process"
              className="font-semibold text-bronze underline-offset-4 hover:underline dark:text-bronze-light"
            >
              how a typical project runs
            </Link>
            .
          </p>
        </div>
      </article>
    </main>
  );
}
