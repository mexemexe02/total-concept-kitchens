import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ServicesSection } from "@/components/site/ServicesSection";
import { marketingPageMeta } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description: `Kitchen design, custom cabinetry, and professional installation — ${siteConfig.name}.`,
  ...marketingPageMeta("/services"),
};

export default function ServicesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <PageHeader
        title="Services"
        description="Full remodels and targeted upgrades — one team from measurements through installation."
      />
      <ServicesSection />
    </main>
  );
}
