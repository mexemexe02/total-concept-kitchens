import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ServicesSection } from "@/components/site/ServicesSection";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description: `Kitchen design, custom cabinetry, and professional installation — ${siteConfig.name}.`,
};

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        title="Services"
        description="Full remodels and targeted upgrades — one team from measurements through installation."
      />
      <ServicesSection />
    </main>
  );
}
