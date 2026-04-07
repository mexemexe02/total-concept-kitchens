import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SkipLink } from "@/components/site/SkipLink";

/** 404 uses root layout only — repeat site chrome so it matches other pages. */
export default async function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-[50vh] bg-cream px-4 py-24 text-center outline-none dark:bg-stone-950 sm:px-6"
      >
        <p className="text-sm font-medium uppercase tracking-widest text-bronze">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-charcoal dark:text-cream">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-stone-600 dark:text-stone-400">
          We could not find that page. Head home or use the links below.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-cream dark:bg-bronze dark:text-charcoal"
          >
            Home
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-stone-300 px-6 py-2.5 text-sm font-medium dark:border-stone-600"
          >
            Contact
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
