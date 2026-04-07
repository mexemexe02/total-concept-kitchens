import type { Metadata } from "next";
import { ContactSection } from "@/components/site/ContactSection";
import { PageHeader } from "@/components/site/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Book a kitchen consultation with ${siteConfig.name}. Reach us by phone or email.`,
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        title="Contact us"
        description="Ask a question or request a consultation. We respond with clear next steps and available times."
      />
      <ContactSection />
    </main>
  );
}
