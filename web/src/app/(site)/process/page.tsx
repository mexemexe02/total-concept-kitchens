import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ProcessSection } from "@/components/site/ProcessSection";
import { marketingPageMeta } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Process",
  description: `How a kitchen project runs with ${siteConfig.name}: clear phases from design through installation.`,
  ...marketingPageMeta("/process"),
};

export default function ProcessPage() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <PageHeader
        title="Our process"
        description="What to expect from the first visit through the final walkthrough."
      />
      <ProcessSection />
    </main>
  );
}
