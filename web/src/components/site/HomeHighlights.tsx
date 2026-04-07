import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { siteConfig } from "@/lib/site-config";

export function HomeHighlights() {
  const cards = [
    {
      href: "/services",
      title: "Services",
      body: "Everything we take on — from full remodels to targeted upgrades — with one accountable team.",
    },
    {
      href: "/process",
      title: "Process",
      body: "Four clear phases from first visit through final walkthrough.",
    },
    {
      href: "/gallery",
      title: "Gallery",
      body: "Kitchen photography and finishes from recent projects.",
    },
    {
      href: "/contact",
      title: "Contact",
      body: `Speak with ${siteConfig.ownerName} about your kitchen or cabinetry project.`,
    },
  ] as const;

  return (
    <section className="bg-cream py-20 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-charcoal dark:text-cream sm:text-4xl">
            Explore the site
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-400">
            Services, how we work, project photos, and contact — each has its own page.
          </p>
        </Reveal>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {cards.map((c, i) => (
            <li key={c.href}>
              <Reveal delay={0.05 + i * 0.09}>
                <Link
                  href={c.href}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white p-7 shadow-md shadow-stone-200/40 transition duration-300 hover:border-bronze/45 hover:shadow-xl dark:border-stone-800 dark:bg-charcoal dark:shadow-none dark:hover:border-bronze/35"
                >
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-bronze/10 blur-2xl transition duration-500 group-hover:bg-bronze/20"
                    aria-hidden
                  />
                  <div className="relative">
                    <h3 className="font-semibold text-charcoal dark:text-cream">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                      {c.body}
                    </p>
                  </div>
                  <span className="relative mt-6 inline-flex items-center gap-1 text-sm font-medium text-bronze dark:text-bronze-light">
                    Learn more
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-sm text-stone-500 dark:text-stone-400">
          <Link
            href="/about"
            className="font-medium text-bronze underline-offset-4 hover:underline dark:text-bronze-light"
          >
            Meet {siteConfig.name}
          </Link>
        </p>
      </div>
    </section>
  );
}
