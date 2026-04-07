import { Mail, MapPin, Phone } from "lucide-react";
import { SocialLinks } from "@/components/site/SocialLinks";
import { siteConfig } from "@/lib/site-config";

type ContactSectionProps = {
  /** Optional note from portal — appears above the consultation heading. */
  contactExtraNote?: string | null;
};

/**
 * Dedicated contact page body: structured methods (phone, email, location) plus
 * consultation copy. No implementation notes here — those belong in README / .env.example.
 */
export function ContactSection({ contactExtraNote }: ContactSectionProps = {}) {
  const mailtoConsult = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Kitchen consultation request")}`;
  const extra = contactExtraNote?.trim();

  return (
    <section className="bg-cream py-20 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {extra ? (
          <p className="mb-10 max-w-2xl rounded-xl border border-bronze/25 bg-bronze/5 px-5 py-4 text-sm leading-relaxed text-stone-700 dark:border-bronze/30 dark:bg-bronze/10 dark:text-stone-200">
            {extra}
          </p>
        ) : null}
        <div className="max-w-2xl">
          {/*
            Section H2 scale matches Services / Process / Gallery grids site-wide.
          */}
          <h2 className="text-3xl font-semibold tracking-tight text-charcoal dark:text-cream sm:text-4xl">
            Schedule a consultation
          </h2>
          <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-400">
            Send photos, rough dimensions, or a short wish list.{" "}
            {siteConfig.ownerName}, {siteConfig.ownerRole}, will reply directly
            with next steps and available times.
          </p>
          {siteConfig.serviceArea ? (
            <p className="mt-3 text-sm text-stone-500 dark:text-stone-500">
              {siteConfig.serviceArea}
            </p>
          ) : null}
        </div>

        {/* Icon treatment matches ServicesSection (bronze tile, rounded-lg). */}
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/*
            min-w-0 lets long email addresses wrap inside CSS grid cells instead of
            overflowing or breaking mid-token awkwardly.
          */}
          <li className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-7 shadow-md shadow-stone-200/40 dark:border-stone-800 dark:bg-charcoal dark:shadow-none">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-bronze/15 text-bronze dark:bg-bronze/25 dark:text-bronze-light"
              aria-hidden
            >
              <Phone className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Phone
            </span>
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="mt-2 text-lg font-semibold text-charcoal transition hover:text-bronze dark:text-cream dark:hover:text-bronze-light"
            >
              {siteConfig.phoneDisplay}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Best for discussing timing, scope, and quick questions.
            </p>
          </li>

          <li className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-7 shadow-md shadow-stone-200/40 dark:border-stone-800 dark:bg-charcoal dark:shadow-none">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-bronze/15 text-bronze dark:bg-bronze/25 dark:text-bronze-light"
              aria-hidden
            >
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Email
            </span>
            {/*
              Keep the full address on one line (no mid-string breaks). Narrow viewports
              scroll horizontally inside the card instead of wrapping or clipping.
            */}
            <div className="mt-2 min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
              <a
                href={mailtoConsult}
                className="inline-block whitespace-nowrap text-base font-semibold text-charcoal transition hover:text-bronze dark:text-cream dark:hover:text-bronze-light sm:text-lg"
              >
                {siteConfig.email}
              </a>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Best for photos, measurements, and follow-up details.
            </p>
          </li>

          <li className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-7 shadow-md shadow-stone-200/40 dark:border-stone-800 dark:bg-charcoal dark:shadow-none sm:col-span-2 lg:col-span-1">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-bronze/15 text-bronze dark:bg-bronze/25 dark:text-bronze-light"
              aria-hidden
            >
              <MapPin className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Location
            </span>
            <p className="mt-2 text-lg font-semibold text-charcoal dark:text-cream">
              {siteConfig.streetAddress ? (
                <>
                  {siteConfig.streetAddress}
                  <br />
                </>
              ) : null}
              {siteConfig.city}, {siteConfig.region} {siteConfig.postalCode}
            </p>
            {siteConfig.hours ? (
              <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                {siteConfig.hours}
              </p>
            ) : (
              <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
                Visits and consultations are scheduled by appointment.
              </p>
            )}
          </li>
        </ul>

        {/* Prominent actions — repeated after cards for visitors who scroll for a button */}
        <div className="mt-12 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <a
            href={mailtoConsult}
            className="inline-flex justify-center rounded-full bg-charcoal px-8 py-3.5 text-center text-sm font-semibold text-cream shadow-sm transition hover:bg-bronze dark:bg-bronze dark:text-charcoal dark:hover:bg-bronze-light"
          >
            Email us to book a consult
          </a>
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="inline-flex justify-center rounded-full border border-stone-300 px-8 py-3.5 text-center text-sm font-semibold text-charcoal transition hover:border-charcoal hover:bg-stone-100 dark:border-stone-600 dark:text-cream dark:hover:border-stone-400 dark:hover:bg-stone-800"
          >
            Call {siteConfig.phoneDisplay}
          </a>
        </div>

        <div className="mt-14 border-t border-stone-200 pt-10 text-center dark:border-stone-800">
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Recent projects and updates
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500 dark:text-stone-500">
            Follow{" "}
            <a
              href={siteConfig.social.instagramUrl}
              className="font-medium text-bronze underline-offset-2 hover:underline dark:text-bronze-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.social.instagramHandle}
            </a>{" "}
            on Instagram for photos of completed kitchens.
          </p>
          <div className="mt-6 flex justify-center">
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
