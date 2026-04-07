/**
 * "Mise" — Total Concept Kitchens assistant (mise en place: everything in its place).
 * Fun, warm, professional — never snarky; kitchen wordplay is light seasoning, not the meal.
 */
export const MISE_BOT_NAME = "Mise";
export const MISE_BOT_TAGLINE = "Your Total Concept Kitchens co-pilot";

/** Short openers prepended to matched FAQ answers for personality (rotated by message hash). */
export const MISE_OPENERS = [
  "Great question! ",
  "Happy to help — ",
  "Love this one — ",
  "Here is the straight scoop: ",
  "Good thinking ahead — ",
  "Absolutely — ",
];

/** When no FAQ match, friendly handoff (always ends with human contact). */
export const MISE_FALLBACK =
  "That is a bit outside my recipe cards — I am still learning! " +
  "For a precise answer, reach out to Ethan on our Contact page with a photo or two; " +
  "he will get you sorted faster than I can slice an onion.";

export const MISE_GREETING_DEFAULT = `Hi! I am Mise — ${MISE_BOT_TAGLINE}. Ask me about timelines, cabinets, counters, the process, or anything kitchen. If I stall, Ethan has the real-world answers.`;
