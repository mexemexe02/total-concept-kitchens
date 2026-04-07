const steps = [
  {
    step: "01",
    title: "Listen & measure",
    body: "We tour your space, talk habits and budget, and document the room accurately.",
  },
  {
    step: "02",
    title: "Design & refine",
    body: "Plans and visuals you can review with confidence; we revise until the layout feels right.",
  },
  {
    step: "03",
    title: "Order & schedule",
    body: "Cabinetry and materials ordered with realistic lead times and a clear install window.",
  },
  {
    step: "04",
    title: "Build & finish",
    body: "Installation, adjustments, and a walkthrough so you know how everything works.",
  },
] as const;

export function ProcessSection() {
  return (
    <section className="border-y border-stone-200 bg-white py-20 dark:border-stone-800 dark:bg-charcoal">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-charcoal dark:text-cream sm:text-4xl">
          From start to finish
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-400">
          Predictable phases and communicated dates — you always know what happens next.
        </p>
        <ol className="mt-14 grid gap-12 md:grid-cols-2">
          {steps.map((s) => (
            <li key={s.step} className="flex gap-6">
              <span
                className="font-mono text-3xl font-light text-bronze dark:text-bronze-light"
                aria-hidden
              >
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold text-charcoal dark:text-cream">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
