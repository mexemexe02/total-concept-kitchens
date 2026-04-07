import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Larger hit targets in footer. */
  variant?: "default" | "footer";
};

/** Facebook + Instagram icons (simple SVGs, no extra dependency). */
export function SocialLinks({ className, variant = "default" }: Props) {
  const size = variant === "footer" ? "h-10 w-10" : "h-9 w-9";
  const label = "Follow Total Concept Kitchens";

  return (
    <div className={cn("flex items-center gap-3", className)} role="group" aria-label={label}>
      <a
        href={siteConfig.social.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center justify-center rounded-full bg-stone-200 text-charcoal transition hover:bg-[#1877F2] hover:text-white dark:bg-stone-700 dark:text-cream dark:hover:bg-[#1877F2]",
          size,
        )}
        aria-label="Facebook page"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      </a>
      <a
        href={siteConfig.social.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center justify-center rounded-full bg-stone-200 transition hover:opacity-90 dark:bg-stone-700",
          size,
        )}
        aria-label="Instagram profile"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current text-[#E1306C]" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </div>
  );
}
