export type HotelTier =
  | "boutique"
  | "design"
  | "comfort"
  | "ryokan-style"
  | "lodge";

export type HotelWalkability = "walkable" | "car-helpful" | "car-needed";

export interface Hotel {
  id: string;
  name: string;
  cityIata: string;
  area: string;
  tier: HotelTier;
  priceEURPerNight: number;
  vibe: string[];
  whyShort: string;
  walkability: HotelWalkability;
  geothermalOnsite: boolean;
}

// Iceland-weighted curated inventory. Prices indicative per night, EUR.
// Outbound destinations have a thinner layer so packages still work.
export const HOTELS: Hotel[] = [
  // ---- Reykjavík ---------------------------------------------------------
  {
    id: "hot-borg",
    name: "Hotel Borg",
    cityIata: "KEF",
    area: "Reykjavík city centre",
    tier: "boutique",
    priceEURPerNight: 320,
    vibe: ["design", "city", "history"],
    whyShort:
      "1930s art deco landmark on Austurvöllur square — most central address in town.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-sand",
    name: "Sand Hótel",
    cityIata: "KEF",
    area: "Reykjavík, Laugavegur",
    tier: "boutique",
    priceEURPerNight: 230,
    vibe: ["design", "city", "food"],
    whyShort:
      "Quiet pocket on the main shopping street. Excellent breakfast, no fuss.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-101",
    name: "101 Hotel",
    cityIata: "KEF",
    area: "Reykjavík city centre",
    tier: "design",
    priceEURPerNight: 360,
    vibe: ["design", "art", "city"],
    whyShort:
      "Ingibjörg Pálmadóttir's gallery-hotel — sleek black-and-white rooms, rotating Icelandic art.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-edition",
    name: "Reykjavík Edition",
    cityIata: "KEF",
    area: "Reykjavík harbour",
    tier: "design",
    priceEURPerNight: 480,
    vibe: ["design", "city", "harbour"],
    whyShort:
      "Ian Schrager on the harbour — rooftop bar, spa, the city's sharpest hotel restaurant.",
    walkability: "walkable",
    geothermalOnsite: true,
  },
  {
    id: "hot-kex",
    name: "Kex Hostel",
    cityIata: "KEF",
    area: "Reykjavík harbour",
    tier: "comfort",
    priceEURPerNight: 110,
    vibe: ["budget", "social", "city"],
    whyShort:
      "Old biscuit factory, long shared tables, the city's best lamb stew. Private rooms or dorms.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-skuggi",
    name: "Skuggi Hotel",
    cityIata: "KEF",
    area: "Reykjavík city centre",
    tier: "comfort",
    priceEURPerNight: 175,
    vibe: ["comfort", "city"],
    whyShort:
      "Quiet midprice base two blocks off Laugavegur. Reliable rooms, walkable to everything.",
    walkability: "walkable",
    geothermalOnsite: false,
  },

  // ---- Reykjanes (Blue Lagoon) ------------------------------------------
  {
    id: "hot-retreat",
    name: "The Retreat at Blue Lagoon",
    cityIata: "KEF",
    area: "near Blue Lagoon",
    tier: "ryokan-style",
    priceEURPerNight: 920,
    vibe: ["spa", "geothermal", "design", "luxury"],
    whyShort:
      "Lava-side suites with a private lagoon. The most indulgent night in Iceland.",
    walkability: "car-needed",
    geothermalOnsite: true,
  },
  {
    id: "hot-silica",
    name: "Silica Hotel",
    cityIata: "KEF",
    area: "near Blue Lagoon",
    tier: "design",
    priceEURPerNight: 420,
    vibe: ["spa", "geothermal", "design"],
    whyShort:
      "Quieter sister to the Retreat. Private silica lagoon, walking distance from the public Blue Lagoon.",
    walkability: "car-needed",
    geothermalOnsite: true,
  },

  // ---- South coast -------------------------------------------------------
  {
    id: "hot-ranga",
    name: "Hotel Rangá",
    cityIata: "KEF",
    area: "Hella, south Iceland",
    tier: "lodge",
    priceEURPerNight: 380,
    vibe: ["nature", "northern-lights", "lodge"],
    whyShort:
      "Log-cabin lodge with an aurora wake-up call service. Hot tubs under the sky.",
    walkability: "car-needed",
    geothermalOnsite: true,
  },
  {
    id: "hot-magma",
    name: "Magma Hotel",
    cityIata: "KEF",
    area: "Vík, south coast",
    tier: "lodge",
    priceEURPerNight: 290,
    vibe: ["nature", "design", "lodge"],
    whyShort:
      "Standalone cabins on a glacial lagoon. Floor-to-ceiling glass, total quiet.",
    walkability: "car-needed",
    geothermalOnsite: false,
  },
  {
    id: "hot-fosshotel-glacier",
    name: "Fosshotel Glacier Lagoon",
    cityIata: "KEF",
    area: "Hof, south-east Iceland",
    tier: "comfort",
    priceEURPerNight: 240,
    vibe: ["nature", "comfort"],
    whyShort:
      "20 min from Jökulsárlón. The most practical base for ice-cave tours and Diamond Beach.",
    walkability: "car-needed",
    geothermalOnsite: false,
  },

  // ---- North & Highlands ------------------------------------------------
  {
    id: "hot-kea",
    name: "Kea by Keahotels",
    cityIata: "AEY",
    area: "Akureyri centre",
    tier: "comfort",
    priceEURPerNight: 195,
    vibe: ["city", "north"],
    whyShort:
      "On Akureyri's main square. Walkable to the botanic gardens and the harbour cafés.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-deplar",
    name: "Deplar Farm",
    cityIata: "AEY",
    area: "Troll Peninsula",
    tier: "lodge",
    priceEURPerNight: 1900,
    vibe: ["adventure", "lodge", "luxury"],
    whyShort:
      "Eleven Experience's heli-ski-and-fly-fish lodge. All-inclusive, weather-dictated, unforgettable.",
    walkability: "car-needed",
    geothermalOnsite: true,
  },
  {
    id: "hot-highland-base",
    name: "Highland Base Kerlingarfjöll",
    cityIata: "KEF",
    area: "central highlands",
    tier: "lodge",
    priceEURPerNight: 310,
    vibe: ["adventure", "nature", "lodge"],
    whyShort:
      "Year-round mountain base in the Kerlingarfjöll geothermal range. F-road or super-jeep access.",
    walkability: "car-needed",
    geothermalOnsite: true,
  },
  {
    id: "hot-ion",
    name: "ION Adventure Hotel",
    cityIata: "KEF",
    area: "Þingvellir, Golden Circle",
    tier: "design",
    priceEURPerNight: 350,
    vibe: ["design", "nature", "northern-lights"],
    whyShort:
      "Cantilevered lava-stone hotel beside Lake Þingvallavatn. Northern-lights bar, geothermal spa.",
    walkability: "car-helpful",
    geothermalOnsite: true,
  },

  // ---- Outbound thin layer (for non-Iceland trips) ----------------------
  {
    id: "hot-cph-nimb",
    name: "Nimb Hotel",
    cityIata: "CPH",
    area: "Copenhagen, Tivoli",
    tier: "boutique",
    priceEURPerNight: 410,
    vibe: ["design", "city", "food"],
    whyShort:
      "Moorish-revival hotel inside Tivoli Gardens. Walk to Strøget in 5 minutes.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-lhr-soho-house",
    name: "The Standard, London",
    cityIata: "LHR",
    area: "London, King's Cross",
    tier: "design",
    priceEURPerNight: 380,
    vibe: ["design", "city", "food"],
    whyShort:
      "Brutalist 1974 block opposite St Pancras. Three restaurants, Eurostar at the door.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-jfk-edition-times",
    name: "The Times Square Edition",
    cityIata: "JFK",
    area: "Manhattan, Midtown",
    tier: "design",
    priceEURPerNight: 520,
    vibe: ["city", "design"],
    whyShort:
      "Quiet luxury inside Times Square's noise. Two blocks from the Theater District.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-lis-santiago",
    name: "Santiago de Alfama",
    cityIata: "LIS",
    area: "Lisbon, Alfama",
    tier: "boutique",
    priceEURPerNight: 280,
    vibe: ["design", "history", "food"],
    whyShort:
      "Renovated 15th-century palace tucked into Alfama's lanes. Tiny pool, big charm.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
  {
    id: "hot-mad-only-you",
    name: "Only YOU Boutique Hotel",
    cityIata: "MAD",
    area: "Madrid, Chueca",
    tier: "boutique",
    priceEURPerNight: 240,
    vibe: ["design", "city", "nightlife"],
    whyShort:
      "Restored Chueca palace. Walk to Gran Vía in five, the Prado in fifteen.",
    walkability: "walkable",
    geothermalOnsite: false,
  },
];

export function hotelInventorySummary(): string {
  const byCity: Record<string, number> = {};
  for (const h of HOTELS) {
    byCity[h.cityIata] = (byCity[h.cityIata] ?? 0) + 1;
  }
  const parts = Object.entries(byCity)
    .sort((a, b) => b[1] - a[1])
    .map(([iata, n]) => `${iata} (${n})`);
  return `${HOTELS.length} curated hotels across ${parts.join(", ")}. Tiers: boutique, design, comfort, ryokan-style, lodge.`;
}
