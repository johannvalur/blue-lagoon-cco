export type PackageSeason = "winter" | "summer" | "shoulder" | "year-round";

export interface BlueLagoonHolidaysPackage {
  id: string;
  name: string;
  routeIata: string; // destination IATA (or KEF for inbound stopover packages)
  inboundToIceland: boolean; // true = travellers coming TO Iceland
  hotelId: string; // FK to HOTELS
  nights: number;
  bonus: string;
  priceFromEURPerPerson: number;
  vibe: string[];
  bestSeason: PackageSeason;
  whyShort: string;
}

// Curated bundles. Prices indicative, EUR per person, double occupancy.
export const PACKAGES: BlueLagoonHolidaysPackage[] = [
  // ---- Inbound (stopover-style) -----------------------------------------
  {
    id: "pkg-blue-lagoon-2n",
    name: "Blue Lagoon weekend",
    routeIata: "KEF",
    inboundToIceland: true,
    hotelId: "hot-silica",
    nights: 2,
    bonus: "Blue Lagoon Premium entry, both days",
    priceFromEURPerPerson: 749,
    vibe: ["spa", "geothermal", "design"],
    bestSeason: "year-round",
    whyShort:
      "Two nights at Silica with a private lagoon. Aurora-side in winter, midnight-sun in summer.",
  },
  {
    id: "pkg-aurora-3n",
    name: "Aurora at Hotel Rangá",
    routeIata: "KEF",
    inboundToIceland: true,
    hotelId: "hot-ranga",
    nights: 3,
    bonus: "Aurora wake-up service + south-coast small group day",
    priceFromEURPerPerson: 1190,
    vibe: ["northern-lights", "nature", "lodge"],
    bestSeason: "winter",
    whyShort:
      "Three nights under the south Iceland aurora corridor. Hot tubs, rural quiet, dedicated wake-up call.",
  },
  {
    id: "pkg-ring-road-7n",
    name: "Ring Road self-drive",
    routeIata: "KEF",
    inboundToIceland: true,
    hotelId: "hot-fosshotel-glacier",
    nights: 7,
    bonus: "AWD car included for 7 days + nightly hotel-bed handover",
    priceFromEURPerPerson: 1690,
    vibe: ["adventure", "nature", "self-drive"],
    bestSeason: "summer",
    whyShort:
      "Seven nights, the whole island, hotel-by-hotel handover so you never search for a bed.",
  },
  {
    id: "pkg-reykjavik-design-3n",
    name: "Reykjavík design weekend",
    routeIata: "KEF",
    inboundToIceland: true,
    hotelId: "hot-edition",
    nights: 3,
    bonus: "Sky Lagoon ritual + chef's tasting at the Edition",
    priceFromEURPerPerson: 1390,
    vibe: ["design", "city", "food"],
    bestSeason: "year-round",
    whyShort:
      "Three nights at the Reykjavík Edition with the city's sharpest food and spa picks bundled in.",
  },
  {
    id: "pkg-highlands-4n",
    name: "Highlands & hot springs",
    routeIata: "KEF",
    inboundToIceland: true,
    hotelId: "hot-highland-base",
    nights: 4,
    bonus: "Super-jeep transfer + guided hot-spring hike",
    priceFromEURPerPerson: 1490,
    vibe: ["adventure", "geothermal", "nature"],
    bestSeason: "summer",
    whyShort:
      "Four nights at Highland Base Kerlingarfjöll with a super-jeep in and a guided hot-spring day.",
  },
  {
    id: "pkg-luxe-retreat-3n",
    name: "The Retreat — three nights",
    routeIata: "KEF",
    inboundToIceland: true,
    hotelId: "hot-retreat",
    nights: 3,
    bonus: "Lava restaurant tasting + private silica lagoon access",
    priceFromEURPerPerson: 2490,
    vibe: ["spa", "luxury", "geothermal"],
    bestSeason: "year-round",
    whyShort:
      "The Retreat at its quietest pace — three full days in a private lagoon with the spa included.",
  },

  // ---- Outbound (KEF residents) -----------------------------------------
  {
    id: "pkg-tenerife-7n",
    name: "Tenerife winter sun",
    routeIata: "TFS",
    inboundToIceland: false,
    hotelId: "hot-mad-only-you", // stand-in: Tenerife inventory not in mock
    nights: 7,
    bonus: "Direct from KEF + half-board at Costa Adeje",
    priceFromEURPerPerson: 989,
    vibe: ["warm", "beach", "winter-sun"],
    bestSeason: "winter",
    whyShort:
      "Seven nights in the Canaries when Reykjavík is at its darkest. Direct flight, half-board.",
  },
  {
    id: "pkg-lisbon-4n",
    name: "Lisbon long weekend",
    routeIata: "LIS",
    inboundToIceland: false,
    hotelId: "hot-lis-santiago",
    nights: 4,
    bonus: "Pastéis de Belém class + tram-28 morning pass",
    priceFromEURPerPerson: 690,
    vibe: ["warm", "city", "food"],
    bestSeason: "shoulder",
    whyShort:
      "Four nights at Santiago de Alfama with the city's best food bookings already made.",
  },
  {
    id: "pkg-nyc-stopover-bridge",
    name: "NYC + Iceland stopover bridge",
    routeIata: "JFK",
    inboundToIceland: false,
    hotelId: "hot-jfk-edition-times",
    nights: 5,
    bonus: "3 nights NYC + 2-night Reykjavík stopover at no flight surcharge",
    priceFromEURPerPerson: 1690,
    vibe: ["city", "stopover"],
    bestSeason: "shoulder",
    whyShort:
      "The classic Blue Lagoon move — break the Atlantic crossing with two free nights in Reykjavík.",
  },
  {
    id: "pkg-cph-3n",
    name: "Copenhagen hygge weekend",
    routeIata: "CPH",
    inboundToIceland: false,
    hotelId: "hot-cph-nimb",
    nights: 3,
    bonus: "Tivoli pass + Reffen street-food vouchers",
    priceFromEURPerPerson: 790,
    vibe: ["design", "city", "food"],
    bestSeason: "year-round",
    whyShort:
      "Three nights at Nimb inside Tivoli. Walk to everything, no transport faff.",
  },
];

export function packageSummary(): string {
  const inbound = PACKAGES.filter((p) => p.inboundToIceland).length;
  const outbound = PACKAGES.length - inbound;
  return `${PACKAGES.length} curated Blue Lagoon Holidays packages — ${inbound} inbound (Iceland-side) and ${outbound} outbound from KEF. Bundles flight + hotel + a curated bonus.`;
}
