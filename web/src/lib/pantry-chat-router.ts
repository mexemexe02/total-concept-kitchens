import { siteConfig } from "@/lib/site-config";

const GREETING_RE =
  /^(hi|hello|hey|hiya|yo|good morning|good afternoon|good evening|sup|what'?s up|howdy)[!. ]*$/i;

/**
 * Matches common “ask for a joke” phrasing. Kept separate from FAQ so we can
 * serve kitchen/business humor instead of the off-topic redirect FAQ rows.
 */
const JOKE_REQUEST_RE =
  /\b(tell\s+(me\s+)?(a\s+)?(quick\s+)?jokes?|give\s+me\s+(a\s+)?jokes?|got\s+any\s+jokes?|any\s+(good\s+)?jokes?|know\s+(a\s+)?(good\s+)?jokes?|make\s+me\s+laugh|say\s+something\s+funny|share\s+(a\s+)?jokes?|got\s+a\s+pun|any\s+puns?)\b/i;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * True when the user is clearly asking for humor, not e.g. “this isn’t funny”.
 */
export function isPantryJokeRequest(message: string): boolean {
  const n = normalize(message);
  if (!n || n.length > 140) return false;
  if (!JOKE_REQUEST_RE.test(n)) return false;
  // Avoid “funny” alone in long complaint-like text (heuristic).
  if (/\b(don'?t|not|isn'?t|wasn'?t)\b.*\bfunny\b/.test(n) && !/\bjokes?\b/.test(n)) {
    return false;
  }
  return true;
}

/** Short, PG kitchen/remodel one-liners when OpenAI is unavailable. __OWNER__ / __NAME__ filled from site config. */
const CANNED_BUSINESS_JOKES: string[] = [
  "Why did the cabinet need a break? Too many drawers pulling it in every direction. For cabinetry that actually fits your life, that’s what __NAME__ does — see Services or Contact __OWNER__.",
  "Kitchen rule: measure twice, cut once, snack twelve times. When you’re past the snacks and ready to plan a real kitchen, __NAME__ is here — Services or Contact __OWNER__.",
  "I asked a countertop for gossip. It said everything was on the level. For honest timelines and process questions, peek at Process or Contact __OWNER__.",
  "The spice rack’s New Year’s resolution? Less thyme wasted. For real scheduling and consult steps, __OWNER__ is on the Contact page.",
  "What’s a carpenter’s favorite type of music? Anything with good trim. __NAME__ does the serious trim and layout work — Services has the overview.",
];

/**
 * Deterministic pick so the same message doesn’t shuffle on retry; still feels varied across users.
 */
export function cannedBusinessKitchenJoke(message: string): string {
  let h = 0;
  for (let i = 0; i < message.length; i++) h = (h * 31 + message.charCodeAt(i)) >>> 0;
  const tpl = CANNED_BUSINESS_JOKES[h % CANNED_BUSINESS_JOKES.length];
  return tpl.replace(/__OWNER__/g, siteConfig.ownerName).replace(/__NAME__/g, siteConfig.name);
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
