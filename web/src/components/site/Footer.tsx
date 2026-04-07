import Link from "next/link";
import { SocialLinks } from "@/components/site/SocialLinks";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-stone-200 bg-stone-100 py-12 dark:border-stone-800 dark:bg-charcoal">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-semibold text-charcoal dark:text-cream">
            {siteConfig.name}
          </p>
          <p className="mt-2 max-w-xs text-sm text-stone-600 dark:text-stone-400">
            {siteConfig.tagline}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal dark:text-cream">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600 dark:text-stone-400">
            <li>
              <a
                className="hover:text-bronze dark:hover:text-bronze-light"
                href={`tel:${siteConfig.phoneTel}`}
              >
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                className="hover:text-bronze dark:hover:text-bronze-light"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              {siteConfig.streetAddress ? (
                <>
                  {siteConfig.streetAddress}
                  <br />
                </>
              ) : null}
              {siteConfig.city}, {siteConfig.region}{" "}
              {siteConfig.postalCode}
            </li>
            {siteConfig.hours ? (
              <li className="text-xs text-stone-500 dark:text-stone-500">
                {siteConfig.hours}
              </li>
            ) : null}
            <li className="pt-1 text-xs leading-snug text-stone-500 dark:text-stone-500">
              {siteConfig.serviceArea}
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal dark:text-cream">
            Follow us
          </p>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            New installs on{" "}
            <a
              href={siteConfig.social.instagramUrl}
              className="text-bronze hover:underline dark:text-bronze-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>{" "}
            and{" "}
            <a
              href={siteConfig.social.facebookUrl}
              className="text-bronze hover:underline dark:text-bronze-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            .
          </p>
          <SocialLinks variant="footer" className="mt-4" />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-medium text-charcoal dark:text-cream">
            Quick links
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600 dark:text-stone-400">
            <li>
              <Link className="hover:text-bronze" href="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="hover:text-bronze" href="/process">
                Process
              </Link>
            </li>
            <li>
              <Link className="hover:text-bronze" href="/gallery">
                Gallery
              </Link>
            </li>
            <li>
              <Link className="hover:text-bronze" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-bronze" href="/contact">
                Book a consult
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-stone-500 sm:px-6">
        <Link className="text-bronze hover:underline dark:text-bronze-light" href="/portal">
          Staff portal
        </Link>
        <span className="mx-2 text-stone-400" aria-hidden>
          ·
        </span>
        © {year} {siteConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
