// Blue Lagoon stay options. Two are on-site (Silica + The Retreat), two are
// Reykjavík partners (ION City + Hotel Borg) for guests who want a base in
// town and shuttle down for their visit. Price ranges are indicative per
// night, EUR.

export type HotelTier = "design" | "suite" | "city" | "boutique";

export type HotelLocation = "onsite" | "reykjavik";

export interface Hotel {
  id: string;
  name: string;
  location: HotelLocation;
  // Indicative price range per night, EUR.
  priceEURPerNightFrom: number;
  priceEURPerNightTo: number;
  tier: HotelTier;
  vibe: string[];
  whyShort: string;
  // On-site hotels list their restaurants here so the concierge can refer
  // to them without re-deriving from another file.
  restaurantsOnsite?: string[];
  // Whether the hotel sits on the Blue Lagoon site or is in Reykjavík.
  // (Kept as a flag in addition to `location` for clearer rendering.)
  isOnsite: boolean;
}

export const HOTELS: Hotel[] = [
  {
    id: "hot-silica",
    name: "Silica Hotel",
    location: "onsite",
    priceEURPerNightFrom: 450,
    priceEURPerNightTo: 700,
    tier: "design",
    vibe: ["onsite", "design", "quiet"],
    whyShort:
      "35 rooms, five-minute walk to the lagoon. The quieter on-site option — a private silica-bottomed pool just for hotel guests.",
    restaurantsOnsite: ["Spa Restaurant"],
    isOnsite: true,
  },
  {
    id: "hot-retreat",
    name: "The Retreat at Blue Lagoon",
    location: "onsite",
    priceEURPerNightFrom: 1400,
    priceEURPerNightTo: 4500,
    tier: "suite",
    vibe: ["onsite", "luxury", "private-lagoon", "design"],
    whyShort:
      "62 suites attached to the spa with a private lagoon for hotel guests. The most indulgent night on the property.",
    restaurantsOnsite: ["Moss", "Spa Restaurant"],
    isOnsite: true,
  },
  {
    id: "hot-ion-city",
    name: "ION City Hotel",
    location: "reykjavik",
    priceEURPerNightFrom: 220,
    priceEURPerNightTo: 360,
    tier: "design",
    vibe: ["city", "design"],
    whyShort:
      "Design-led base on Laugavegur. Reykjavík Excursions picks up from BSÍ a short walk away — easy shuttle down for a visit.",
    isOnsite: false,
  },
  {
    id: "hot-borg",
    name: "Hotel Borg",
    location: "reykjavik",
    priceEURPerNightFrom: 280,
    priceEURPerNightTo: 480,
    tier: "boutique",
    vibe: ["city", "history", "central"],
    whyShort:
      "1930s art-deco landmark on Austurvöllur square. The most central address in Reykjavík for guests pairing a city stay with a half-day visit.",
    isOnsite: false,
  },
];

export function hotelInventorySummary(): string {
  const onsite = HOTELS.filter((h) => h.isOnsite).length;
  const reyk = HOTELS.length - onsite;
  return `${HOTELS.length} stay options — ${onsite} on-site (Silica, The Retreat) and ${reyk} Reykjavík partners (ION City, Hotel Borg).`;
}
