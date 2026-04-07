import {
  Hammer,
  LayoutTemplate,
  PenLine,
  Truck,
} from "lucide-react";

const items = [
  {
    icon: PenLine,
    title: "Design & planning",
    body: "Layouts, finishes, and lighting planned around traffic, storage, and how your household uses the space.",
  },
  {
    icon: LayoutTemplate,
    title: "Custom cabinetry",
    body: "Cabinetry sized and detailed for your room — not filler panels to hide poor fit.",
  },
  {
    icon: Hammer,
    title: "Project management",
    body: "One timeline for trades, deliveries, and punch list — with clear updates instead of chasing crews.",
  },
  {
    icon: Truck,
    title: "Installation",
    body: "Careful install and final adjustments so doors, drawers, and hardware feel tight and quiet.",
  },
] as const;

export function ServicesSection() {
  return (
    <section className="bg-cream py-20 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-charcoal dark:text-cream sm:text-4xl">
          What we do
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-400">
          Full kitchen projects from first measurement through final hardware — or
          targeted upgrades when you already know what you want to improve.
        </p>
        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-bronze/15 text-bronze dark:bg-bronze/25 dark:text-bronze-light">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="mt-5 font-semibold text-charcoal dark:text-cream">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
