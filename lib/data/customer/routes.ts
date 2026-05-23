// Blue Lagoon "Experiences" — the canonical entry tiers expressed as
// guest-shaped wellness experiences. The four tiers cover most visits;
// each one anchors a different pace and depth. Companion add-ons and
// hotel pairings hang off the tier the guest picks.

export type ExperienceCategory =
  | "day-visit"
  | "half-day"
  | "overnight"
  | "private-journey";

export type ExperienceSeason = "year-round" | "aurora" | "summer";

export interface Experience {
  id: string;
  // The entry-tier id this experience anchors. Pairs with ENTRY_TIERS.
  tierId: "comfort" | "premium" | "signature" | "retreat-spa";
  name: string;
  category: ExperienceCategory;
  durationHours: number;
  priceFromEUR: number;
  vibe: string[];
  bestSeason: ExperienceSeason;
  suggestedAddons: string[]; // Addon ids
  whyShort: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-comfort",
    tierId: "comfort",
    name: "Comfort visit",
    category: "day-visit",
    durationHours: 3,
    priceFromEUR: 90,
    vibe: ["essentials", "icon", "layover-friendly"],
    bestSeason: "year-round",
    suggestedAddons: ["addon-mask-upgrade-algae"],
    whyShort:
      "Three or so hours in the main lagoon with a towel, the silica mud mask, and a drink at the swim-up bar. The original Blue Lagoon experience, no extras.",
  },
  {
    id: "exp-premium",
    tierId: "premium",
    name: "Premium visit",
    category: "day-visit",
    durationHours: 4,
    priceFromEUR: 130,
    vibe: ["essentials", "food", "icon"],
    bestSeason: "year-round",
    suggestedAddons: ["addon-lava-dinner", "addon-mask-bar-duo"],
    whyShort:
      "Adds the algae mask, slippers, sparkling wine, and a Lava restaurant reservation. The default if it's your first time and you want to linger over dinner.",
  },
  {
    id: "exp-signature",
    tierId: "signature",
    name: "Signature half-day",
    category: "half-day",
    durationHours: 5,
    priceFromEUR: 220,
    vibe: ["treatment", "privacy", "design"],
    bestSeason: "year-round",
    suggestedAddons: ["addon-massage-30"],
    whyShort:
      "Private changing, robe, and one 30-minute in-water massage. The right tier for a half-day reset without an overnight.",
  },
  {
    id: "exp-retreat-spa",
    tierId: "retreat-spa",
    name: "Retreat Spa journey",
    category: "private-journey",
    durationHours: 5,
    priceFromEUR: 480,
    vibe: ["luxury", "privacy", "ritual"],
    bestSeason: "year-round",
    suggestedAddons: ["addon-moss-tasting"],
    whyShort:
      "Five hours at The Retreat — private lagoon, full Blue Lagoon Ritual, Spa Restaurant included. The quiet, slow option.",
  },
  {
    id: "exp-aurora-evening",
    tierId: "premium",
    name: "Aurora evening visit",
    category: "day-visit",
    durationHours: 4,
    priceFromEUR: 130,
    vibe: ["aurora", "evening", "photography"],
    bestSeason: "aurora",
    suggestedAddons: ["addon-heated-lounger"],
    whyShort:
      "A Premium ticket booked for an evening slot in aurora season (Oct–Mar). Steam, dark skies, and on clear nights, the sky lights up overhead.",
  },
  {
    id: "exp-couples-ritual",
    tierId: "signature",
    name: "Couples ritual",
    category: "half-day",
    durationHours: 4,
    priceFromEUR: 440,
    vibe: ["couples", "ritual", "privacy"],
    bestSeason: "year-round",
    suggestedAddons: ["addon-couples-ritual"],
    whyShort:
      "Signature entry with the side-by-side couples ritual: silica scrub, algae wrap, time in a private water room. Easy gift for an anniversary.",
  },
];

// Compatibility shim — the canonical export the rest of the slice imports.
// Other agents may still import NETWORK from older code; if so they will
// switch to EXPERIENCES as they rewrite their slice.
export type Route = Experience;
export const NETWORK = EXPERIENCES;

export function experiencesSummary(): string {
  return EXPERIENCES.map(
    (e) =>
      `- ${e.name} (${e.tierId} tier) — ${e.durationHours}h, from €${e.priceFromEUR}, vibe: ${e.vibe.join(", ")}.`,
  ).join("\n");
}

// Back-compat alias used by older imports in the trip prompt.
export const networkSummary = experiencesSummary;
