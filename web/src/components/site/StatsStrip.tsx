import { ClipboardCheck, Hammer, MapPinned } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { siteConfig } from "@/lib/site-config";

/** Trust-focused strip — concrete promises, no vanity metrics. */
export function StatsStrip() {
  const items = [
    {
      icon: ClipboardCheck,
      title: "Written scope",
      body: "What is included — and what is not — is documented before work begins.",
    },
    {
      icon: Hammer,
      title: "Fit & finish",
      body: "Cabinetry installed level, square, and quiet — the details you notice every day.",
    },
    {
      icon: MapPinned,
      title: "Local focus",
      body: siteConfig.serviceArea,
    },
  ] as const;

  return (
    <section className="border-y border-stone-200 bg-white py-12 dark:border-stone-800 dark:bg-charcoal">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-3 sm:px-6">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="group flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bronze/15 text-bronze ring-1 ring-bronze/10 transition motion-safe:group-hover:scale-105 dark:bg-bronze/20 dark:text-bronze-light dark:ring-bronze/20">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  <h2 className="font-semibold text-charcoal dark:text-cream">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
