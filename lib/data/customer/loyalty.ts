export interface SagaTrip {
  from: string;
  to: string;
  date: string; // ISO yyyy-mm-dd
  segments: number;
  ptsEarned: number;
}

export interface SagaVoucher {
  name: string;
  expires: string; // ISO yyyy-mm-dd
}

export const SAGA_MEMBER = {
  id: "Saga 4321",
  name: "Anna J.",
  tier: "Gold" as const,
  points: 84_500,
  ytdSpendEUR: 5_320,
  joinedYear: 2019,
  history: [
    // Most recent first — Anna's a KEF-based traveller who flies a couple of
    // times a year to North America and a handful of European city breaks.
    { from: "KEF", to: "BOS", date: "2026-02-14", segments: 1, ptsEarned: 4_200 },
    { from: "BOS", to: "KEF", date: "2026-02-21", segments: 1, ptsEarned: 4_200 },
    { from: "KEF", to: "CPH", date: "2025-11-08", segments: 1, ptsEarned: 1_800 },
    { from: "CPH", to: "KEF", date: "2025-11-12", segments: 1, ptsEarned: 1_800 },
    { from: "KEF", to: "LIS", date: "2025-04-18", segments: 1, ptsEarned: 2_400 },
    { from: "LIS", to: "KEF", date: "2025-04-25", segments: 1, ptsEarned: 2_400 },
  ] as SagaTrip[],
  vouchers: [
    { name: "€50 partner voucher (Blue Lagoon)", expires: "2026-12-31" },
    { name: "1 Saga lounge pass", expires: "2026-08-31" },
  ] as SagaVoucher[],
};

// Points needed for a one-way economy redemption from KEF.
// Short-haul Europe sits in the 30k-40k band, mid-haul Iberia 40k,
// transatlantic 55k-75k.
export const REDEMPTION_RATES_PTS: Record<string, number> = {
  // North America
  BOS: 60_000,
  JFK: 60_000,
  YYZ: 55_000,
  SEA: 75_000,
  DEN: 75_000,
  // Europe — short
  CPH: 30_000,
  LHR: 30_000,
  AMS: 30_000,
  BER: 32_000,
  // Europe — mid
  CDG: 35_000,
  // Europe — Iberia / canaries
  MAD: 40_000,
  BCN: 40_000,
  LIS: 40_000,
  TFS: 45_000,
  // Iceland domestic
  AEY: 12_000,
};

// Approximate great-circle miles from KEF for the recap. Good enough for
// demo numbers; we don't need GIS-grade accuracy.
const KEF_DISTANCE_MI: Record<string, number> = {
  BOS: 2_410,
  JFK: 2_590,
  YYZ: 2_660,
  SEA: 3_640,
  DEN: 3_400,
  CPH: 1_400,
  LHR: 1_180,
  AMS: 1_320,
  BER: 1_490,
  CDG: 1_400,
  MAD: 1_870,
  BCN: 1_960,
  LIS: 1_810,
  TFS: 2_510,
  AEY: 240,
  KEF: 0,
};

export function milesForLeg(from: string, to: string): number {
  const a = KEF_DISTANCE_MI[from.toUpperCase()] ?? 0;
  const b = KEF_DISTANCE_MI[to.toUpperCase()] ?? 0;
  // One leg always involves KEF in Anna's network — the non-KEF endpoint
  // gives the leg distance directly.
  return Math.max(a, b);
}

// Tier thresholds (EUR YTD spend) — mirrors the static ladder on the page.
export const TIER_THRESHOLDS_EUR = {
  Bronze: 0,
  Silver: 1_500,
  Gold: 4_000,
  Platinum: 8_000,
} as const;

export type SagaTier = keyof typeof TIER_THRESHOLDS_EUR;

export function nextTierGap(
  tier: SagaTier,
  ytdSpendEUR: number,
): { nextTier: SagaTier | null; eurToGo: number } {
  const order: SagaTier[] = ["Bronze", "Silver", "Gold", "Platinum"];
  const idx = order.indexOf(tier);
  if (idx === -1 || idx === order.length - 1) {
    return { nextTier: null, eurToGo: 0 };
  }
  const next = order[idx + 1];
  return {
    nextTier: next,
    eurToGo: Math.max(0, TIER_THRESHOLDS_EUR[next] - ytdSpendEUR),
  };
}
