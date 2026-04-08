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

/** When no FAQ match, friendly handoff (always ends with human contact). */
export const MISE_FALLBACK =
  "That request is outside Pantry's scope. " +
  "I can help with Total Concept Kitchens services, timelines, process, and consult steps. " +
  "For project-specific advice, contact Ethan from the Contact page.";

export const MISE_GREETING_DEFAULT =
  "Hi! Pantry is the automated assistant for Total Concept Kitchens. " +
  "Ask about timelines, cabinets, service area, process, or booking. " +
  "For project-specific advice, contact Ethan directly.";
