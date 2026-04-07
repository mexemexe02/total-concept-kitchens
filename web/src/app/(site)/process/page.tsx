import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ProcessSection } from "@/components/site/ProcessSection";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Process",
  description: `How a kitchen project runs with ${siteConfig.name}: clear phases from design through installation.`,
};

export default function ProcessPage() {
  return (
    <main>
      <PageHeader
        title="Our process"
        description="What to expect from the first visit through the final walkthrough."
      />
      <ProcessSection />
    </main>
  );
}
