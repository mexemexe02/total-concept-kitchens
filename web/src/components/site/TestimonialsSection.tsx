import { Quote } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { demoTestimonials } from "@/lib/demo-content";

export function TestimonialsSection() {
  return (
    <section className="border-y border-stone-200 bg-stone-50 py-20 dark:border-stone-800 dark:bg-stone-900/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-charcoal dark:text-cream sm:text-4xl">
            Client feedback
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-400">
            Examples of the experience we strive to deliver on every project.
          </p>
        </Reveal>
        <ul className="mt-14 grid gap-8 lg:grid-cols-3">
          {demoTestimonials.map((t, i) => (
            <li key={t.attribution}>
              <Reveal delay={0.07 + i * 0.1}>
                <div className="relative flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition duration-300 hover:border-bronze/25 hover:shadow-md dark:border-stone-700 dark:bg-charcoal dark:hover:border-bronze/30">
                  <Quote
                    className="absolute right-6 top-6 h-8 w-8 text-bronze/25 dark:text-bronze/35"
                    aria-hidden
                  />
                  <blockquote className="relative flex-1 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                    “{t.quote}”
                  </blockquote>
                  <footer className="mt-6 border-t border-stone-100 pt-5 text-sm dark:border-stone-700">
                    <p className="font-semibold text-charcoal dark:text-cream">
                      {t.attribution}
                    </p>
                    <p className="text-stone-500 dark:text-stone-400">
                      {t.context}
                    </p>
                  </footer>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
