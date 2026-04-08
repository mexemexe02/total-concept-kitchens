/**
 * "Pantry" — non-human assistant label for Total Concept Kitchens.
 * Friendly and useful, but always clearly automated.
 */
export const MISE_BOT_NAME = "Pantry";
export const MISE_BOT_TAGLINE = "Automated website assistant";

/**
 * Short openers prepended to matched FAQ answers (rotated by message hash).
 * Wording stays earnest — avoids phrases that could read as mocking if the user was venting or sarcastic.
 */
export const MISE_OPENERS = [
  "Great question! ",
  "Happy to help — ",
  "Thanks for asking — ",
  "Here is the straight scoop: ",
  "Good thinking ahead — ",
  "Absolutely — ",
];

/** When no FAQ match and OpenAI is not configured — explains the limit without sounding dismissive. */
export const MISE_FALLBACK_NO_OPENAI =
  "Pantry can answer a wide range of questions when the AI assistant is enabled on the server — right now only the fixed FAQ is active for open-ended topics. " +
  "Ask anything about Total Concept Kitchens: services, timelines, cabinets, service area, or booking — or reach Ethan from the Contact page for project-specific help.";

/** When OpenAI is configured but the request failed (timeout, empty reply, error). */
export const MISE_FALLBACK_OPENAI_FAILED =
  "I couldn’t complete that reply just now (connection or model hiccup). Please try again in a moment. " +
  "I can still help with kitchen design, cabinetry, process, and our service area when your question matches our FAQ — or contact Ethan from the Contact page.";

/** @deprecated Use MISE_FALLBACK_NO_OPENAI or route-specific fallback; kept for imports that expect one string. */
export const MISE_FALLBACK = MISE_FALLBACK_NO_OPENAI;

export const MISE_GREETING_DEFAULT =
  "Hi! Pantry is the automated assistant for Total Concept Kitchens. " +
  "Ask about timelines, cabinets, service area, process, or booking. " +
  "For project-specific advice, contact Ethan directly.";
