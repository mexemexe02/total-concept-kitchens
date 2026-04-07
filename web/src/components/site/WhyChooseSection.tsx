import { Reveal } from "@/components/site/Reveal";
import { demoWhyChoose } from "@/lib/demo-content";

export function WhyChooseSection() {
  return (
    <section className="relative bg-cream py-20 dark:bg-stone-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(28,27,25,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(28,27,25,0.03)_1px,transparent_1px)] bg-[size:56px_56px] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-bronze dark:text-bronze-light">
            Why work with us
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-charcoal dark:text-cream sm:text-4xl">
            Clear plans, careful install, and a kitchen built for real life.
          </h2>
        </Reveal>
        <ul className="mt-14 grid gap-10 md:grid-cols-3">
          {demoWhyChoose.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={0.06 + i * 0.1}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm transition duration-300 hover:border-bronze/30 hover:shadow-md dark:border-stone-800 dark:bg-charcoal dark:hover:border-bronze/25">
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bronze/[0.06] via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <h3 className="relative text-lg font-semibold text-charcoal dark:text-cream">
                    {item.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
