/**
 * Central marketing copy for the home page (hero, differentiators, testimonials).
 * Swap testimonial text for verified quotes when you have written permission to publish.
 */
export const demoHero = {
  eyebrow: "Kitchen design · Cabinetry · Installation",
  headline: "A kitchen that works hard — and still feels like home.",
  supporting:
    "We plan around how you live: traffic patterns, storage, and finishes you will still love years from now. One team carries the project from measurements through installation.",
  trustLine:
    "Full remodels · Refacing & upgrades · Islands · Pantries · Lighting",
} as const;

export const demoWhyChoose = [
  {
    title: "One team, one timeline",
    body: "Design, ordering, and installation stay with one team — instead of coordinating separate crews for schedules and details.",
  },
  {
    title: "Plans you can understand",
    body: "Layouts, elevations, and finish selections explained in plain language — no jargon required to make decisions.",
  },
  {
    title: "Install that respects your home",
    body: "Protection, dust control, and a clear punch list so the rest of your house stays livable while we work.",
  },
] as const;

/** Example tone for testimonials — replace with approved quotes and attributions when available. */
export const demoTestimonials = [
  {
    quote:
      "They listened to how we cook and entertain. The island layout was the third option — and it was the one we would never have thought of ourselves.",
    attribution: "Sarah & James M.",
    context: "Whole-kitchen remodel",
  },
  {
    quote:
      "Clear pricing phases and no surprise add-ons. We always knew what was next on the calendar.",
    attribution: "David R.",
    context: "Cabinetry & counters",
  },
  {
    quote:
      "The install crew was meticulous. Drawers and doors line up better than the builder-grade kitchen we started with.",
    attribution: "Elena V.",
    context: "Full renovation",
  },
] as const;
