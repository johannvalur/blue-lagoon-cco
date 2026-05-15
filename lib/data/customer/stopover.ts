export type StopoverRegion =
  | "reykjavik"
  | "golden-circle"
  | "south-coast"
  | "north"
  | "east"
  | "reykjanes";

export type StopoverSeason = "year-round" | "winter" | "summer";

export type StopoverVibe =
  | "photography"
  | "food"
  | "geothermal"
  | "history"
  | "adventure"
  | "nature"
  | "design"
  | "wildlife"
  | "culture"
  | "family";

export interface StopoverActivity {
  id: string;
  name: string;
  region: StopoverRegion;
  durationHours: number;
  season: StopoverSeason;
  vibes: StopoverVibe[];
  transport: string;
  costEUR: number;
  blurb: string;
}

// Curated stopover activities. Costs are indicative per-person in EUR.
// Vibes are kept to two or three per entry on purpose.
export const STOPOVER_ACTIVITIES: StopoverActivity[] = [
  // ---- Reykjavík ---------------------------------------------------------
  {
    id: "rvk-hallgrimskirkja",
    name: "Hallgrímskirkja",
    region: "reykjavik",
    durationHours: 1,
    season: "year-round",
    vibes: ["history", "design"],
    transport: "walk from city centre",
    costEUR: 10,
    blurb:
      "The basalt-column church on the hill. Take the tower lift for the best 360° view of the coloured rooftops.",
  },
  {
    id: "rvk-harpa",
    name: "Harpa concert hall",
    region: "reykjavik",
    durationHours: 1,
    season: "year-round",
    vibes: ["design", "culture"],
    transport: "walk along the harbour",
    costEUR: 0,
    blurb:
      "Olafur Eliasson's honeycomb glass facade glows differently every hour. Free to wander, ticketed shows most evenings.",
  },
  {
    id: "rvk-roasters",
    name: "Reykjavík Roasters",
    region: "reykjavik",
    durationHours: 1,
    season: "year-round",
    vibes: ["food", "culture"],
    transport: "walk",
    costEUR: 6,
    blurb:
      "The local third-wave benchmark. Two small rooms, single-origin Aeropress, and the city's best people-watching window seat.",
  },
  {
    id: "rvk-kex",
    name: "Kex Hostel bar",
    region: "reykjavik",
    durationHours: 2,
    season: "year-round",
    vibes: ["food", "culture"],
    transport: "walk from city centre",
    costEUR: 25,
    blurb:
      "A converted biscuit factory. Long shared tables, lamb stew, occasional live music — equally good for a long lunch or a late drink.",
  },
  {
    id: "rvk-sundholl",
    name: "Sundhöll thermal pool",
    region: "reykjavik",
    durationHours: 1.5,
    season: "year-round",
    vibes: ["geothermal", "culture"],
    transport: "walk from city centre",
    costEUR: 8,
    blurb:
      "The neighbourhood pool locals actually use. Hot pots, a steam room, a 25m lap pool — Iceland's living room, for a few euros.",
  },

  // ---- Golden Circle -----------------------------------------------------
  {
    id: "gc-thingvellir",
    name: "Þingvellir national park",
    region: "golden-circle",
    durationHours: 2,
    season: "year-round",
    vibes: ["history", "nature"],
    transport: "rental car or coach tour",
    costEUR: 0,
    blurb:
      "Where the Mid-Atlantic ridge surfaces and the Vikings held the world's first parliament. Walk the rift between two continents.",
  },
  {
    id: "gc-geysir",
    name: "Geysir geothermal field",
    region: "golden-circle",
    durationHours: 1,
    season: "year-round",
    vibes: ["geothermal", "photography"],
    transport: "rental car or coach tour",
    costEUR: 0,
    blurb:
      "Strokkur erupts roughly every 7 minutes — a column of boiling water as tall as a five-storey building. Steamy and a bit theatrical.",
  },
  {
    id: "gc-gullfoss",
    name: "Gullfoss waterfall",
    region: "golden-circle",
    durationHours: 1,
    season: "year-round",
    vibes: ["nature", "photography"],
    transport: "rental car or coach tour",
    costEUR: 0,
    blurb:
      "The 'golden falls' — two tiers, a glacial canyon, and usually a rainbow. Wear something waterproof; the spray is generous.",
  },

  // ---- South Coast -------------------------------------------------------
  {
    id: "sc-seljalandsfoss",
    name: "Seljalandsfoss",
    region: "south-coast",
    durationHours: 1,
    season: "year-round",
    vibes: ["photography", "nature"],
    transport: "rental car (1.5h from Reykjavík)",
    costEUR: 8,
    blurb:
      "A 60m waterfall you can walk behind. Bring a rain shell and shoes with grip — the path gets slick.",
  },
  {
    id: "sc-skogafoss",
    name: "Skógafoss",
    region: "south-coast",
    durationHours: 1.5,
    season: "year-round",
    vibes: ["photography", "nature"],
    transport: "rental car (2h from Reykjavík)",
    costEUR: 0,
    blurb:
      "A perfect rectangle of water — wide, loud, frequently rainbowed. Climb the staircase on the right for a view down the valley.",
  },
  {
    id: "sc-reynisfjara",
    name: "Reynisfjara black-sand beach",
    region: "south-coast",
    durationHours: 1.5,
    season: "year-round",
    vibes: ["photography", "nature"],
    transport: "rental car (2.5h from Reykjavík)",
    costEUR: 0,
    blurb:
      "Basalt columns, sea stacks, and waves that catch tourists out. Stay well back from the water — the sneaker waves here are no joke.",
  },
  {
    id: "sc-vik",
    name: "Vík village",
    region: "south-coast",
    durationHours: 2,
    season: "year-round",
    vibes: ["food", "culture"],
    transport: "rental car (2.5h from Reykjavík)",
    costEUR: 30,
    blurb:
      "A 300-soul village under a green-roofed church. A natural overnight stop on a south-coast loop — try the lamb at Suður Vík.",
  },
  {
    id: "sc-fjadrargljufur",
    name: "Fjaðrárgljúfur canyon",
    region: "south-coast",
    durationHours: 1.5,
    season: "year-round",
    vibes: ["photography", "adventure"],
    transport: "rental car (3.5h from Reykjavík)",
    costEUR: 0,
    blurb:
      "A 100m moss-walled canyon carved by an ancient glacial river. The clifftop path is short, the views are not subtle.",
  },

  // ---- North & East ------------------------------------------------------
  {
    id: "n-akureyri",
    name: "Akureyri town",
    region: "north",
    durationHours: 4,
    season: "year-round",
    vibes: ["food", "culture"],
    transport: "domestic flight from RVK (45 min)",
    costEUR: 80,
    blurb:
      "The capital of the north — botanic gardens, a serious coffee scene, and heart-shaped traffic lights. Worth a domestic hop on a longer stopover.",
  },
  {
    id: "n-myvatn",
    name: "Mývatn nature baths",
    region: "north",
    durationHours: 3,
    season: "year-round",
    vibes: ["geothermal", "nature"],
    transport: "drive from Akureyri (1h)",
    costEUR: 50,
    blurb:
      "The Blue Lagoon's quieter, smaller cousin. Sulphur steam, milky-blue water, and pseudo-craters across the lake.",
  },
  {
    id: "n-husavik",
    name: "Húsavík whale watching",
    region: "north",
    durationHours: 3,
    season: "year-round",
    vibes: ["wildlife", "adventure"],
    transport: "drive from Akureyri (1h)",
    costEUR: 95,
    blurb:
      "Skjálfandi bay is one of the most reliable whale spots in Europe. Humpbacks year-round, blues and minkes in summer.",
  },

  // ---- Reykjanes (year-round) -------------------------------------------
  {
    id: "rj-blue-lagoon",
    name: "Blue Lagoon",
    region: "reykjanes",
    durationHours: 3,
    season: "year-round",
    vibes: ["geothermal", "design"],
    transport: "20 min from Keflavík airport",
    costEUR: 90,
    blurb:
      "The icon. Silica-blue water, lava walls, swim-up bar. Book ahead — entry slots fill weeks out, especially around evenings.",
  },
  {
    id: "rvk-sky-lagoon",
    name: "Sky Lagoon",
    region: "reykjavik",
    durationHours: 2.5,
    season: "year-round",
    vibes: ["geothermal", "design"],
    transport: "15 min from city centre",
    costEUR: 75,
    blurb:
      "An ocean-edge infinity pool with a seven-step thermal ritual. More grown-up and less crowded than the Blue Lagoon.",
  },

  // ---- Winter only -------------------------------------------------------
  {
    id: "w-ice-cave",
    name: "Vatnajökull ice cave tour",
    region: "south-coast",
    durationHours: 4,
    season: "winter",
    vibes: ["adventure", "photography"],
    transport: "guided tour from Jökulsárlón",
    costEUR: 180,
    blurb:
      "Crystal-blue caves carved fresh under Europe's largest glacier each winter. November to March only — the ice melts back every spring.",
  },
  {
    id: "w-northern-lights",
    name: "Northern Lights tour",
    region: "reykjavik",
    durationHours: 4,
    season: "winter",
    vibes: ["nature", "photography"],
    transport: "guided coach from Reykjavík",
    costEUR: 70,
    blurb:
      "Aurora season runs September to early April. Pick a tour with a free re-book on cloudy nights — Iceland's weather doesn't read forecasts.",
  },

  // ---- Summer only -------------------------------------------------------
  {
    id: "s-midnight-horse",
    name: "Midnight-sun horseback ride",
    region: "reykjavik",
    durationHours: 2.5,
    season: "summer",
    vibes: ["adventure", "nature"],
    transport: "shuttle from Reykjavík",
    costEUR: 110,
    blurb:
      "Icelandic horses do a fifth gait called the tölt — impossibly smooth. June and July rides go out at 10pm in full daylight.",
  },
  {
    id: "s-puffin-boat",
    name: "Puffin boat tour",
    region: "reykjavik",
    durationHours: 1.5,
    season: "summer",
    vibes: ["wildlife", "family"],
    transport: "departs from Reykjavík harbour",
    costEUR: 55,
    blurb:
      "Mid-May to mid-August, ten million puffins are nesting just offshore. A short hop to Akurey island lands you in the middle of them.",
  },
];

// Short paragraph the system prompt can reference if it wants to. We keep
// data and prose separate so the prompt stays compact.
export function stopoverNetworkSummary(): string {
  const byRegion: Record<string, number> = {};
  for (const a of STOPOVER_ACTIVITIES) {
    byRegion[a.region] = (byRegion[a.region] ?? 0) + 1;
  }
  const parts = Object.entries(byRegion).map(
    ([region, count]) => `${region} (${count})`,
  );
  return `${STOPOVER_ACTIVITIES.length} curated activities across ${parts.join(", ")}.`;
}
