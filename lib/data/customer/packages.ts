// Blue Lagoon spa packages — multi-night bundles built around one of the
// hotels, an entry tier, and a set of treatments + dining. Prices are
// indicative per person, EUR, double occupancy.

export type PackageSeason = "winter" | "summer" | "shoulder" | "year-round";

export interface SpaPackage {
  id: string;
  name: string;
  nights: number;
  hotelId: string; // FK to HOTELS
  entryTierId: "comfort" | "premium" | "signature" | "retreat-spa";
  // The treatments and dining bundled into the package — referenced by
  // ADDONS where possible, otherwise written as free-text.
  treatments: string[];
  dining: string[];
  priceEUR: number;
  vibe: string[];
  bestSeason: PackageSeason;
  whyShort: string;
}

export const PACKAGES: SpaPackage[] = [
  {
    id: "pkg-silica-weekend",
    name: "Silica Weekend",
    nights: 2,
    hotelId: "hot-silica",
    entryTierId: "premium",
    treatments: ["One 30-min in-water massage"],
    dining: ["One Lava dinner reservation"],
    priceEUR: 1490,
    vibe: ["weekend", "couples", "essentials"],
    bestSeason: "year-round",
    whyShort:
      "Two nights at Silica, two Premium entries, one in-water massage, one Lava dinner. The most-booked package year-round.",
  },
  {
    id: "pkg-retreat-indulgence",
    name: "Retreat Indulgence",
    nights: 1,
    hotelId: "hot-retreat",
    entryTierId: "retreat-spa",
    treatments: ["Full Blue Lagoon Ritual (silica, algae, mineral)"],
    dining: ["Moss tasting menu, 7 courses"],
    priceEUR: 2800,
    vibe: ["luxury", "special-occasion", "indulgence"],
    bestSeason: "year-round",
    whyShort:
      "One night in a Retreat suite, a full Retreat Spa journey, and the Moss tasting menu. The high-touch option.",
  },
  {
    id: "pkg-friends-getaway",
    name: "Friends Getaway",
    nights: 1,
    hotelId: "hot-silica",
    entryTierId: "premium",
    treatments: [],
    dining: ["Mask bar duo upgrade"],
    priceEUR: 690,
    vibe: ["friends", "sociable", "value"],
    bestSeason: "year-round",
    whyShort:
      "One night at Silica plus two Premium entries with the algae + mineral mask combo. Designed for groups of two to four friends.",
  },
  {
    id: "pkg-aurora-spa-night",
    name: "Aurora Spa Night",
    nights: 1,
    hotelId: "hot-silica",
    entryTierId: "premium",
    treatments: [],
    dining: ["Heated lounger reservation"],
    priceEUR: 580,
    vibe: ["aurora", "evening", "winter"],
    bestSeason: "winter",
    whyShort:
      "One night at Silica with an evening Premium entry and a heated lounger. Aurora season only (October to March).",
  },
  {
    id: "pkg-wellness-reset",
    name: "Wellness Reset",
    nights: 3,
    hotelId: "hot-silica",
    entryTierId: "signature",
    treatments: [
      "Two 30-min in-water massages",
      "One algae mineral wrap",
      "One silica salt scrub",
    ],
    dining: ["Nutrition consultation with the Retreat dietician"],
    priceEUR: 2490,
    vibe: ["wellness", "reset", "longer-stay"],
    bestSeason: "year-round",
    whyShort:
      "Three nights at Silica with two Signature entries, two treatments, an algae wrap, and a nutrition session. The slower-pace option.",
  },
];

export function packageSummary(): string {
  return `${PACKAGES.length} curated spa packages — from a single-night Aurora Spa Night to a three-night Wellness Reset.`;
}

// ---- Back-compat shim ---------------------------------------------------
// Older code imports BlueLagoonHolidaysPackage from here. We keep the name
// pointing at SpaPackage so unrelated callers keep compiling.

export type BlueLagoonHolidaysPackage = SpaPackage;
