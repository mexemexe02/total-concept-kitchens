import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

/**
 * Shared chrome for every marketing route — same as a live multi-page site
 * (header + footer on each URL).
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
