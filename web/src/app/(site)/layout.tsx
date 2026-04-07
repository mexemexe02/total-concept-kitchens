import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { SiteJsonLd } from "@/components/site/SiteJsonLd";
import { SkipLink } from "@/components/site/SkipLink";

/**
 * Shared chrome for every marketing route — same as a live multi-page site
 * (header + footer on each URL), plus pro touches: JSON-LD, skip link, breadcrumbs, scroll control.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteJsonLd />
      <SkipLink />
      <Header />
      <Breadcrumbs />
      {children}
      <ScrollToTop />
      <Footer />
    </>
  );
}
