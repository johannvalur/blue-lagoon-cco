// The Insider programme — Blue Lagoon's membership tier model. Demo data
// only, hand-curated to mirror a guest who's a few visits into the year and
// pushing toward the top tier.

export type InsiderTier = "Friend" | "Insider" | "Ambassador" | "Patron";

export type EntryTier = "Comfort" | "Premium" | "Signature" | "Retreat Spa";

export interface InsiderVisit {
  id: string;
  date: string; // ISO yyyy-mm-dd
  tier: EntryTier;
  hotelId?: "silica" | "retreat";
  // Free-form list of add-ons used on the visit (treatments, dining, mask
  // bar upgrades, products). Keeps the demo flexible without coupling to
  // the inventory data sets owned by other agents.
  treatments: string[];
  totalEUR: number;
  pointsEarned: number;
}

export interface InsiderVoucher {
  id: string;
  label: string;
  // EUR value of the voucher when expressed as a credit; for non-monetary
  // perks (e.g. a complimentary mask bar upgrade) this is a notional value
  // for the demo card to render.
  value: number;
  expiresOn: string; // ISO yyyy-mm-dd
}

// YTD EUR spend thresholds for each tier. 1 point = €1 spent, so the
// thresholds also describe lifetime-points-this-year.
export const TIER_THRESHOLDS: Record<InsiderTier, number> = {
  Friend: 0,
  Insider: 600,
  Ambassador: 1_800,
  Patron: 5_000,
} as const;

export const TIER_ORDER: InsiderTier[] = [
  "Friend",
  "Insider",
  "Ambassador",
  "Patron",
];

// Per-tier perks, surfaced in the prompt and the year-recap card.
export const TIER_PERKS: Record<InsiderTier, string[]> = {
  Friend: ["Monthly Spa newsletter", "5% off products"],
  Insider: [
    "Queue priority on arrival",
    "10% off treatments",
    "Complimentary mask bar upgrade once per visit",
  ],
  Ambassador: [
    "Complimentary Premium-tier upgrade on day visits",
    "Complimentary mask bar daily",
    "Moss priority booking",
    "15% off products",
  ],
  Patron: [
    "Complimentary Retreat Spa day visit (1 per year)",
    "Private host",
    "20% off everything",
    "Private suite preference at Silica",
  ],
};

// 1 point per €1 spent; points redeem at €0.05 each toward visits or
// products. Round numbers — the demo never needs sub-euro precision.
export const POINT_VALUE_EUR = 0.05;

// Catalogue of things points can redeem against. The redemption tool
// looks values up here; everything else just renders the labels.
export interface RedemptionOption {
  id: string;
  label: string;
  kind: "entry" | "hotel" | "treatment" | "product";
  // Cost in points. Mirrors the cash price divided by POINT_VALUE_EUR,
  // rounded to a friendly number.
  pointsRequired: number;
  // Plain description for the card.
  description: string;
  // Minimum tier required to redeem; null means open to everyone.
  minimumTier: InsiderTier | null;
}

export const REDEMPTION_CATALOGUE: RedemptionOption[] = [
  {
    id: "entry-comfort",
    label: "Comfort entry",
    kind: "entry",
    pointsRequired: 1_800,
    description: "A single Comfort-tier day visit, valid any season.",
    minimumTier: null,
  },
  {
    id: "entry-premium",
    label: "Premium entry",
    kind: "entry",
    pointsRequired: 2_600,
    description:
      "A single Premium-tier day visit with mask bar, robe, and a drink.",
    minimumTier: null,
  },
  {
    id: "entry-signature",
    label: "Signature entry",
    kind: "entry",
    pointsRequired: 4_400,
    description: "Signature ritual day visit with priority access.",
    minimumTier: "Insider",
  },
  {
    id: "entry-retreat",
    label: "Retreat Spa day visit",
    kind: "entry",
    pointsRequired: 9_600,
    description:
      "Full Retreat Spa day visit — Lava cove, in-water Mask Bar, and quiet lounges.",
    minimumTier: "Ambassador",
  },
  {
    id: "treatment-mask-ritual",
    label: "In-water mask ritual",
    kind: "treatment",
    pointsRequired: 1_400,
    description: "A 50-minute layered mask ritual at the in-water Mask Bar.",
    minimumTier: null,
  },
  {
    id: "treatment-massage-60",
    label: "60-minute in-water massage",
    kind: "treatment",
    pointsRequired: 3_400,
    description: "A signature 60-minute in-water massage.",
    minimumTier: null,
  },
  {
    id: "treatment-couples-ritual",
    label: "Couples ritual",
    kind: "treatment",
    pointsRequired: 6_800,
    description: "A two-person guided ritual across float, mask, and massage.",
    minimumTier: "Insider",
  },
  {
    id: "hotel-silica-night",
    label: "One night at Silica Hotel",
    kind: "hotel",
    pointsRequired: 9_000,
    description: "A standard room at Silica Hotel, breakfast at Lava included.",
    minimumTier: "Insider",
  },
  {
    id: "hotel-retreat-night",
    label: "One night at The Retreat",
    kind: "hotel",
    pointsRequired: 28_000,
    description:
      "A Retreat Suite, in-room minibar and full Retreat Spa access.",
    minimumTier: "Ambassador",
  },
  {
    id: "product-skincare-bundle",
    label: "Skincare bundle",
    kind: "product",
    pointsRequired: 1_600,
    description:
      "Silica mud mask, mineral mask, and lava scrub, gift-boxed.",
    minimumTier: null,
  },
];

export const INSIDER_MEMBER = {
  id: "BL 0001 314",
  name: "Sigríður Margrét Oddsdóttir",
  tier: "Ambassador" as InsiderTier,
  points: 18_250,
  ytdEUR: 2_640,
  joinedYear: 2021,
  vouchers: [
    {
      id: "vch-mask-bar",
      label: "Complimentary mask bar upgrade",
      value: 18,
      expiresOn: "2026-12-31",
    },
    {
      id: "vch-skincare-15",
      label: "15% Skincare credit",
      value: 25,
      expiresOn: "2026-09-30",
    },
  ] as InsiderVoucher[],
  // Most recent first. Three this year (Premium day visit, Silica weekend,
  // Retreat day visit) plus two from last year for tenure colour.
  visits: [
    {
      id: "v-2026-05-04",
      date: "2026-05-04",
      tier: "Retreat Spa",
      treatments: [
        "In-water mask ritual",
        "Lava restaurant tasting menu",
      ],
      totalEUR: 720,
      pointsEarned: 720,
    },
    {
      id: "v-2026-04-12",
      date: "2026-04-12",
      tier: "Premium",
      hotelId: "silica",
      treatments: [
        "Two-night Silica stay",
        "Premium entry × 2",
        "Lava dinner",
        "60-minute in-water massage",
      ],
      totalEUR: 1_580,
      pointsEarned: 1_580,
    },
    {
      id: "v-2026-02-22",
      date: "2026-02-22",
      tier: "Premium",
      treatments: ["Mask bar upgrade", "Spa Restaurant lunch"],
      totalEUR: 340,
      pointsEarned: 340,
    },
    {
      id: "v-2025-12-09",
      date: "2025-12-09",
      tier: "Signature",
      treatments: ["Couples ritual", "Moss dinner for two"],
      totalEUR: 880,
      pointsEarned: 880,
    },
    {
      id: "v-2025-09-17",
      date: "2025-09-17",
      tier: "Comfort",
      treatments: ["Silica mud mask retail"],
      totalEUR: 130,
      pointsEarned: 130,
    },
  ] as InsiderVisit[],
};

export type InsiderMember = typeof INSIDER_MEMBER;

export function nextTier(tier: InsiderTier): InsiderTier | null {
  const idx = TIER_ORDER.indexOf(tier);
  if (idx === -1 || idx === TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1];
}

export function gapToNextTierEUR(
  tier: InsiderTier,
  ytdEUR: number,
): { nextTier: InsiderTier | null; eurToGo: number } {
  const next = nextTier(tier);
  if (!next) return { nextTier: null, eurToGo: 0 };
  return {
    nextTier: next,
    eurToGo: Math.max(0, TIER_THRESHOLDS[next] - ytdEUR),
  };
}

export function tierMeetsMinimum(
  current: InsiderTier,
  minimum: InsiderTier | null,
): boolean {
  if (!minimum) return true;
  return TIER_ORDER.indexOf(current) >= TIER_ORDER.indexOf(minimum);
}
