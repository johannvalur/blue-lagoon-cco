// Blue Lagoon entry tiers — the four canonical price points a guest picks
// when booking a visit. "Comfort" is the ground floor; "Retreat Spa" is the
// private five-hour journey at The Retreat. Inclusions are the things the
// guest actually receives (towel, mask, robe, treatment, etc.) — not airline
// rules. Refundability and change policy are deliberately spa-soft, not
// fare-rule strict.

export type EntryTierId =
  | "comfort"
  | "premium"
  | "signature"
  | "retreat-spa";

export interface EntryTier {
  id: EntryTierId;
  name: string;
  priceEUR: number;
  description: string;
  inclusions: string[];
  refundable: boolean;
  // Days the guest can change/cancel without a fee, counted from arrival.
  freeChangeWindowHours: number;
  changeFeeEUR: number;
  whoItsFor: string;
}

export const ENTRY_TIERS: EntryTier[] = [
  {
    id: "comfort",
    name: "Comfort",
    priceEUR: 90,
    description:
      "Entry to the main lagoon with a towel, the silica mud mask, and one drink at the swim-up bar.",
    inclusions: [
      "Entry to the outdoor lagoon",
      "Bathrobe-free towel hire",
      "Silica mud mask",
      "One drink at the swim-up bar",
    ],
    refundable: true,
    freeChangeWindowHours: 24,
    changeFeeEUR: 0,
    whoItsFor:
      "First-timers who want the icon, no extras. The right pick for a layover stop or a quick 3-hour float.",
  },
  {
    id: "premium",
    name: "Premium",
    priceEUR: 130,
    description:
      "Adds the algae mask, slippers, sparkling wine, and a Lava restaurant reservation. The default if you're staying for dinner.",
    inclusions: [
      "Entry to the outdoor lagoon",
      "Towel and slippers",
      "Silica mud mask + algae mask",
      "One drink at the swim-up bar",
      "Glass of sparkling wine with dinner",
      "Reservation for Lava restaurant",
    ],
    refundable: true,
    freeChangeWindowHours: 24,
    changeFeeEUR: 0,
    whoItsFor:
      "Most first-time guests. Premium covers a half-day comfortably with dinner at Lava.",
  },
  {
    id: "signature",
    name: "Signature",
    priceEUR: 220,
    description:
      "Private changing, robe, and one 30-minute in-water massage. Quieter, slower, with treatment built in.",
    inclusions: [
      "Premium tier inclusions",
      "Private changing suite",
      "Bathrobe and sandals to keep",
      "One 30-minute in-water massage",
      "Skincare amenities by Blue Lagoon",
    ],
    refundable: true,
    freeChangeWindowHours: 48,
    changeFeeEUR: 0,
    whoItsFor:
      "Guests who want a treatment included and prefer to skip the busy changing rooms. Good for couples and special-occasion afternoons.",
  },
  {
    id: "retreat-spa",
    name: "Retreat Spa",
    priceEUR: 480,
    description:
      "A five-hour private journey at The Retreat with the full Blue Lagoon Ritual and Spa Restaurant included.",
    inclusions: [
      "Five-hour private journey",
      "Access to the private Retreat lagoon",
      "Full Blue Lagoon Ritual (silica, algae, mineral)",
      "Retreat changing suite with skincare amenities",
      "Lunch or dinner at Spa Restaurant",
    ],
    refundable: true,
    freeChangeWindowHours: 72,
    changeFeeEUR: 0,
    whoItsFor:
      "Guests who want a quiet, private day — anniversaries, milestone trips, anyone who'd rather not be near the main lagoon at peak hours.",
  },
];

export function entryTierSummary(): string {
  return ENTRY_TIERS.map(
    (t) =>
      `- ${t.name} (€${t.priceEUR}): ${t.description} ${t.whoItsFor}`,
  ).join("\n");
}

// ---- Back-compat shims --------------------------------------------------
// Older code (manage tool, manage prompt) imported FARE_RULES + FareRule and
// expected fields like `id`, `name`, `description`, `changeFee`, `refundable`.
// We expose the same shape against the new data so other slices can keep
// compiling until they switch over.

export type FareRule = {
  id: EntryTierId;
  name: string;
  description: string;
  changeFee: number;
  refundable: boolean;
  bagsIncluded: number;
  seatSelection: "free" | "paid";
  loungeAccess: boolean;
};

export const FARE_RULES: FareRule[] = ENTRY_TIERS.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  changeFee: t.changeFeeEUR,
  refundable: t.refundable,
  // The next three are vestigial — kept so legacy imports don't break.
  bagsIncluded: 0,
  seatSelection: "free",
  loungeAccess: false,
}));

export const fareSummary = entryTierSummary;
