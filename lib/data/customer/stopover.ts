// Blue Lagoon add-ons — treatments, dining upgrades, products, and
// experience upgrades a guest can layer on top of an entry tier. Replaces
// the old "stopover activities" list. Filename kept stable so other agents'
// imports still resolve.

export type AddonCategory = "treatment" | "dining" | "product" | "upgrade";

export type AddonVibe =
  | "couples"
  | "ritual"
  | "icon"
  | "deep-tissue"
  | "float"
  | "skincare"
  | "evening"
  | "aurora"
  | "tasting"
  | "indulgence";

export interface Addon {
  id: string;
  name: string;
  category: AddonCategory;
  // Duration in minutes when relevant (treatments, dining). Omitted for
  // products and quick upgrades.
  durationMin?: number;
  priceEUR: number;
  vibes: AddonVibe[];
  whyShort: string;
}

export const ADDONS: Addon[] = [
  // ---- Treatments ------------------------------------------------------
  {
    id: "addon-massage-30",
    name: "In-water massage, 30 min",
    category: "treatment",
    durationMin: 30,
    priceEUR: 95,
    vibes: ["ritual"],
    whyShort:
      "Floating massage on a foam mat in a quiet corner of the lagoon. The shortest treatment that still feels like a treatment.",
  },
  {
    id: "addon-massage-60",
    name: "In-water massage, 60 min",
    category: "treatment",
    durationMin: 60,
    priceEUR: 175,
    vibes: ["ritual", "deep-tissue"],
    whyShort:
      "The most-booked single treatment. An hour of warm-water floating massage; sleep-grade afterwards.",
  },
  {
    id: "addon-massage-120",
    name: "In-water massage, 120 min",
    category: "treatment",
    durationMin: 120,
    priceEUR: 320,
    vibes: ["ritual", "indulgence"],
    whyShort:
      "Two-hour signature massage. Reserved well in advance — therapists do at most three of these a day.",
  },
  {
    id: "addon-float-60",
    name: "Float therapy, 60 min",
    category: "treatment",
    durationMin: 60,
    priceEUR: 140,
    vibes: ["float", "ritual"],
    whyShort:
      "Weightless floating session in a quiet pool with low light. Good for tight shoulders and jet lag.",
  },
  {
    id: "addon-silica-scrub",
    name: "Silica salt scrub, 45 min",
    category: "treatment",
    durationMin: 45,
    priceEUR: 85,
    vibes: ["skincare"],
    whyShort:
      "Body exfoliation using mineral salt from the lagoon. Skin feels different for days.",
  },
  {
    id: "addon-algae-wrap",
    name: "Algae mineral wrap, 60 min",
    category: "treatment",
    durationMin: 60,
    priceEUR: 150,
    vibes: ["skincare", "ritual"],
    whyShort:
      "Warm body wrap with Blue Lagoon algae. Pairs well with a 30-minute massage afterwards.",
  },
  {
    id: "addon-couples-ritual",
    name: "Couples ritual, 120 min",
    category: "treatment",
    durationMin: 120,
    priceEUR: 440,
    vibes: ["couples", "ritual", "indulgence"],
    whyShort:
      "Side-by-side: silica scrub, algae wrap, time in a private water room. The popular anniversary booking.",
  },

  // ---- Dining ----------------------------------------------------------
  {
    id: "addon-lava-dinner",
    name: "Lava dinner reservation",
    category: "dining",
    durationMin: 90,
    priceEUR: 0,
    vibes: ["icon"],
    whyShort:
      "Reservation at Lava, set into the lava cliff overlooking the lagoon. Premium tier and above includes it; otherwise it's a paid à la carte booking.",
  },
  {
    id: "addon-moss-tasting",
    name: "Moss tasting menu, 7 courses",
    category: "dining",
    durationMin: 150,
    priceEUR: 280,
    vibes: ["tasting", "indulgence"],
    whyShort:
      "Seven-course tasting menu at Moss, fine dining at The Retreat. Wine pairing extra. Closed Mondays.",
  },

  // ---- Mask bar upgrades ----------------------------------------------
  {
    id: "addon-mask-bar-algae",
    name: "Algae mask at the mask bar",
    category: "upgrade",
    priceEUR: 25,
    vibes: ["skincare"],
    whyShort:
      "Second mask layered on top of the standard silica — algae brightens and firms.",
  },
  {
    id: "addon-mask-bar-mineral",
    name: "Mineral mask at the mask bar",
    category: "upgrade",
    priceEUR: 35,
    vibes: ["skincare"],
    whyShort:
      "Mineral salt clay mask, applied at the in-water mask bar. Slightly warming on the skin.",
  },
  {
    id: "addon-mask-bar-duo",
    name: "Algae + mineral mask combo",
    category: "upgrade",
    priceEUR: 45,
    vibes: ["skincare", "indulgence"],
    whyShort:
      "Both extras at the mask bar — algae first, mineral second, in-between rinse in the lagoon.",
  },

  // ---- Other upgrades --------------------------------------------------
  {
    id: "addon-heated-lounger",
    name: "Heated lounger booking",
    category: "upgrade",
    priceEUR: 45,
    vibes: ["evening", "aurora"],
    whyShort:
      "Reserved heated stone lounger by the lagoon edge. Best on cold winter evenings when you want to come out and warm up.",
  },

  // ---- Skincare products ----------------------------------------------
  {
    id: "addon-skincare-essential",
    name: "Essential skincare bundle",
    category: "product",
    priceEUR: 120,
    vibes: ["skincare"],
    whyShort:
      "Three-step starter kit (silica mud mask, mineral lotion, hydrating cream) packaged for travel.",
  },
  {
    id: "addon-skincare-full",
    name: "Full ritual bundle",
    category: "product",
    priceEUR: 280,
    vibes: ["skincare", "indulgence"],
    whyShort:
      "Seven-piece full home-ritual set, including the algae night mask. Travel-safe, gift-boxed.",
  },
];

export function addonsSummary(): string {
  const byCat: Record<string, number> = {};
  for (const a of ADDONS) byCat[a.category] = (byCat[a.category] ?? 0) + 1;
  const parts = Object.entries(byCat).map(([k, n]) => `${k} ×${n}`);
  return `${ADDONS.length} add-ons across ${parts.join(", ")}.`;
}

// ---- Back-compat shims --------------------------------------------------
// Old code imported STOPOVER_ACTIVITIES / StopoverActivity / etc. We expose
// the same names against the new data so unrelated callers keep compiling
// until their slice owners update.

export type StopoverActivity = Addon;
export const STOPOVER_ACTIVITIES = ADDONS;
export const STOPOVERS = ADDONS;
export const stopoverNetworkSummary = addonsSummary;
