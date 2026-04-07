/**
 * Top-of-page title band for inner routes (matches how a live multi-page site reads).
 */
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-stone-200 bg-cream dark:border-stone-800 dark:bg-stone-950">
      {/*
        Vertical rhythm matches section blocks (e.g. Services, Contact): generous top/bottom
        so inner pages feel like one system with the home page, not a separate template.
      */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {/* Bronze rule ties inner pages to the hero’s editorial system without copying the dark hero band */}
        <h1 className="border-l-[3px] border-bronze/55 pl-5 font-display text-3xl font-semibold tracking-tight text-charcoal dark:border-bronze/50 dark:text-cream sm:pl-6 sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 dark:text-stone-400 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
