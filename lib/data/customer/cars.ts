export type CarTransmission = "manual" | "automatic";

export type CarTerrain =
  | "city-only"
  | "ring-road"
  | "f-roads"
  | "winter"
  | "any";

export interface CarTier {
  id: string;
  name: string; // illustrative model
  category:
    | "compact-2wd"
    | "crossover-awd"
    | "4x4-rugged"
    | "camper-van";
  pricePerDayEUR: number;
  seats: number;
  transmission: CarTransmission;
  goodFor: CarTerrain[];
  pickup: string;
  whyShort: string;
}

// Indicative tiers for Iceland self-drive. Prices are summer-peak.
export const CAR_TIERS: CarTier[] = [
  {
    id: "car-compact",
    name: "Toyota Yaris (or similar)",
    category: "compact-2wd",
    pricePerDayEUR: 45,
    seats: 4,
    transmission: "manual",
    goodFor: ["city-only", "ring-road"],
    pickup: "KEF airport",
    whyShort:
      "Cheapest way to do the Ring Road in summer. No F-roads, no glaciers, but plenty for the south coast.",
  },
  {
    id: "car-compact-auto",
    name: "Hyundai i20 Automatic",
    category: "compact-2wd",
    pricePerDayEUR: 65,
    seats: 4,
    transmission: "automatic",
    goodFor: ["city-only", "ring-road"],
    pickup: "KEF airport",
    whyShort:
      "Auto box for travellers used to one. Same limits as the manual compact.",
  },
  {
    id: "car-awd",
    name: "Dacia Duster AWD",
    category: "crossover-awd",
    pricePerDayEUR: 95,
    seats: 5,
    transmission: "manual",
    goodFor: ["ring-road", "winter"],
    pickup: "KEF airport",
    whyShort:
      "Sweet spot for shoulder-season Ring Road or winter driving. Higher clearance, all-wheel drive, no off-road permission.",
  },
  {
    id: "car-4x4",
    name: "Toyota Land Cruiser 4x4",
    category: "4x4-rugged",
    pricePerDayEUR: 180,
    seats: 5,
    transmission: "automatic",
    goodFor: ["ring-road", "f-roads", "winter"],
    pickup: "KEF airport",
    whyShort:
      "F-road legal: highlands, river crossings, Landmannalaugar. Necessary for any summer highland plan.",
  },
  {
    id: "car-camper-2",
    name: "Happy Camper 2-berth",
    category: "camper-van",
    pricePerDayEUR: 140,
    seats: 2,
    transmission: "manual",
    goodFor: ["ring-road"],
    pickup: "Reykjavík city",
    whyShort:
      "Sleep where you stop. Best for summer Ring Road; campsites only. No F-roads.",
  },
  {
    id: "car-camper-4",
    name: "Indie 4x4 Camper",
    category: "camper-van",
    pricePerDayEUR: 240,
    seats: 4,
    transmission: "manual",
    goodFor: ["ring-road", "f-roads"],
    pickup: "Reykjavík city",
    whyShort:
      "4x4 camper with a roof tent. F-road legal, highland-capable, sleeps four.",
  },
];

export function carTierSummary(): string {
  const cats: Record<string, number> = {};
  for (const c of CAR_TIERS) cats[c.category] = (cats[c.category] ?? 0) + 1;
  const parts = Object.entries(cats).map(([k, n]) => `${k} ×${n}`);
  return `${CAR_TIERS.length} car tiers: ${parts.join(", ")}. Pickup at KEF airport or Reykjavík city.`;
}
