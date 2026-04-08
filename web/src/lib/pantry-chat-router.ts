import { siteConfig } from "@/lib/site-config";

const GREETING_RE =
  /^(hi|hello|hey|hiya|yo|good morning|good afternoon|good evening|sup|what'?s up|howdy)[!. ]*$/i;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns a canned greeting response when the user sends an ultra-short hello.
 * This prevents wasting FAQ/OpenAI budget for simple “hi” messages.
 */
export function routePantryGreeting(message: string): string | null {
  const n = normalize(message);
  if (!n) return null;
  if (n.length > 35) return null;
  if (!GREETING_RE.test(n)) return null;
  return (
    `Hi! I am Pantry, the automated assistant for ${siteConfig.name}. ` +
    "Ask about timelines, cabinets, service area, or consult steps. " +
    `For project-specific advice, contact ${siteConfig.ownerName} at ${siteConfig.phoneDisplay} or ${siteConfig.email}.`
  );
}
