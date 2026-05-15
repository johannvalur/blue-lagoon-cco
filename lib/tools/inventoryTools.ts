import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import {
  HOTELS,
  type Hotel,
  type HotelTier,
} from "@/lib/data/customer/hotels";
import {
  CAR_TIERS,
  type CarTier,
  type CarTerrain,
} from "@/lib/data/customer/cars";
import {
  PACKAGES,
  type BlueLagoonHolidaysPackage,
  type PackageSeason,
} from "@/lib/data/customer/packages";

// ---- Hotels ------------------------------------------------------------

export interface HotelMatch {
  id: string;
  name: string;
  cityIata: string;
  area: string;
  tier: HotelTier;
  priceEURPerNight: number;
  vibe: string[];
  why: string;
  walkability: Hotel["walkability"];
  geothermalOnsite: boolean;
}

export interface SearchHotelsResult {
  query_summary: string;
  hotels: HotelMatch[];
}

function vibeOverlap(
  itemVibes: readonly string[],
  wanted: readonly string[],
): number {
  if (wanted.length === 0) return 0;
  const set = new Set(itemVibes.map((v) => v.toLowerCase()));
  let n = 0;
  for (const w of wanted) {
    if (set.has(w.toLowerCase())) n += 1;
  }
  return n;
}

function buildHotelWhy(hotel: Hotel, wanted: readonly string[]): string {
  const matched = hotel.vibe.filter((v) =>
    wanted.map((w) => w.toLowerCase()).includes(v.toLowerCase()),
  );
  const head = matched.length
    ? `Hits the ${matched.slice(0, 2).join(" + ")} brief.`
    : `Leans into ${hotel.vibe.slice(0, 2).join(" and ")}.`;
  return `${head} ${hotel.whyShort}`;
}

export function makeSearchHotelsTool(
  onResult?: (result: SearchHotelsResult) => void,
) {
  return betaTool({
    name: "search_hotels",
    description:
      "Search Blue Lagoon Holidays' hotel inventory. Iceland-weighted (Reykjavík, Blue Lagoon, south coast, Akureyri, highlands) with a thin layer of outbound destinations for KEF travellers. Call this whenever the traveller mentions where to stay, a hotel, a city to base out of, or a number of nights.",
    inputSchema: {
      type: "object",
      properties: {
        area_iata: {
          type: "string",
          description:
            "City IATA the hotels should sit in or near, e.g. 'KEF' for Reykjavík/south Iceland, 'AEY' for Akureyri, 'CPH' for Copenhagen.",
        },
        city: {
          type: "string",
          description:
            "Free-text city or area, e.g. 'Reykjavík', 'near Blue Lagoon', 'south coast'.",
        },
        vibe: {
          type: "array",
          items: { type: "string" },
          description:
            "Vibe tags drawn from the traveller's words: design, spa, geothermal, lodge, city, food, adventure, luxury, budget.",
        },
        tier: {
          type: "string",
          enum: ["boutique", "design", "comfort", "ryokan-style", "lodge"],
          description: "Optional hotel tier filter.",
        },
        nights: {
          type: "number",
          description: "Number of nights — used to compute total estimate.",
        },
        budget_eur_per_night: {
          type: "number",
          description: "Soft cap on per-night EUR price.",
        },
        max_options: {
          type: "number",
          description: "Maximum number of hotel matches to return (cap 4).",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const areaIata = (args.area_iata as string | undefined)?.toUpperCase();
      const city = (args.city as string | undefined)?.toLowerCase();
      const wantedVibe = (args.vibe as string[] | undefined) ?? [];
      const tier = args.tier as HotelTier | undefined;
      const budget = args.budget_eur_per_night as number | undefined;
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 3),
        4,
      );

      let candidates = HOTELS.slice();
      if (areaIata) candidates = candidates.filter((h) => h.cityIata === areaIata);
      if (city)
        candidates = candidates.filter(
          (h) =>
            h.area.toLowerCase().includes(city) ||
            h.name.toLowerCase().includes(city),
        );
      if (tier) candidates = candidates.filter((h) => h.tier === tier);

      const scored = candidates.map((h) => {
        const v = vibeOverlap(h.vibe, wantedVibe);
        const budgetBonus =
          budget !== undefined && h.priceEURPerNight <= budget ? 2 : 0;
        const pricePenalty = h.priceEURPerNight / 2000;
        const score = v * 3 + budgetBonus - pricePenalty;
        return { h, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, maxOptions).map((s) => s.h);

      const summaryBits: string[] = [];
      if (areaIata) summaryBits.push(areaIata);
      if (city) summaryBits.push(city);
      if (wantedVibe.length) summaryBits.push(wantedVibe.slice(0, 3).join(" + "));
      if (tier) summaryBits.push(tier);
      const querySummary = summaryBits.length
        ? `Hotel picks for ${summaryBits.join(", ")}`
        : "Curated Blue Lagoon Holidays hotels";

      const result: SearchHotelsResult = {
        query_summary: querySummary,
        hotels: top.map((h) => ({
          id: h.id,
          name: h.name,
          cityIata: h.cityIata,
          area: h.area,
          tier: h.tier,
          priceEURPerNight: h.priceEURPerNight,
          vibe: h.vibe,
          why: buildHotelWhy(h, wantedVibe),
          walkability: h.walkability,
          geothermalOnsite: h.geothermalOnsite,
        })),
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- Cars --------------------------------------------------------------

export interface CarMatch {
  id: string;
  name: string;
  category: CarTier["category"];
  pricePerDayEUR: number;
  seats: number;
  transmission: CarTier["transmission"];
  why: string;
  pickup: string;
}

export interface SearchCarsResult {
  query_summary: string;
  cars: CarMatch[];
}

function carFitsTerrain(c: CarTier, terrain?: CarTerrain): boolean {
  if (!terrain || terrain === "any") return true;
  return c.goodFor.includes(terrain);
}

export function makeSearchCarsTool(
  onResult?: (result: SearchCarsResult) => void,
) {
  return betaTool({
    name: "search_cars",
    description:
      "Search Iceland car-rental tiers (compact 2WD, AWD crossover, 4x4, camper). Call this whenever the traveller says drive, rent a car, Ring Road, F-roads, highlands, or any self-drive cue. Pickup is at KEF airport unless the traveller says otherwise.",
    inputSchema: {
      type: "object",
      properties: {
        pickup_iata: {
          type: "string",
          description: "Pickup IATA. Defaults to KEF.",
        },
        pickup_date: {
          type: "string",
          description: "ISO yyyy-mm-dd. Used only for the summary line.",
        },
        return_date: {
          type: "string",
          description: "ISO yyyy-mm-dd. Used only for the summary line.",
        },
        days: {
          type: "number",
          description:
            "Number of rental days. Used to compute the total estimate.",
        },
        season: {
          type: "string",
          enum: ["winter", "summer", "shoulder"],
          description:
            "Season hint. F-roads only open in summer; winter favours AWD.",
        },
        terrain: {
          type: "string",
          enum: ["city-only", "ring-road", "f-roads", "winter", "any"],
          description:
            "What the traveller plans to drive on. F-roads requires a 4x4.",
        },
        passengers: {
          type: "number",
          description: "Number of passengers (≥ 1).",
        },
        max_options: {
          type: "number",
          description: "Maximum number of car matches to return (cap 3).",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const pickupIata =
        (args.pickup_iata as string | undefined)?.toUpperCase() ?? "KEF";
      const days = Math.max(1, (args.days as number | undefined) ?? 1);
      const season = args.season as
        | "winter"
        | "summer"
        | "shoulder"
        | undefined;
      const terrain = args.terrain as CarTerrain | undefined;
      const passengers = Math.max(
        1,
        (args.passengers as number | undefined) ?? 2,
      );
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 3),
        3,
      );

      let candidates = CAR_TIERS.filter((c) => c.seats >= passengers);
      if (terrain && terrain !== "any") {
        candidates = candidates.filter((c) => carFitsTerrain(c, terrain));
      }

      // Light scoring: prefer 4x4 in winter or for f-roads, prefer compact for city-only,
      // then tiebreak by price.
      const scored = candidates.map((c) => {
        let score = 0;
        if (season === "winter" && c.category !== "compact-2wd") score += 3;
        if (terrain === "f-roads" && c.category === "4x4-rugged") score += 5;
        if (terrain === "ring-road" && c.category === "crossover-awd") score += 3;
        if (terrain === "city-only" && c.category === "compact-2wd") score += 4;
        score -= c.pricePerDayEUR / 200;
        return { c, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, maxOptions).map((s) => s.c);

      const summaryBits: string[] = [];
      summaryBits.push(`Pickup ${pickupIata}`);
      if (terrain && terrain !== "any") summaryBits.push(`${terrain} terrain`);
      if (season) summaryBits.push(season);
      summaryBits.push(`${days} day${days === 1 ? "" : "s"}`);
      summaryBits.push(`${passengers} pax`);
      const querySummary = `Car picks — ${summaryBits.join(", ")}`;

      const result: SearchCarsResult = {
        query_summary: querySummary,
        cars: top.map((c) => ({
          id: c.id,
          name: c.name,
          category: c.category,
          pricePerDayEUR: c.pricePerDayEUR,
          seats: c.seats,
          transmission: c.transmission,
          why: c.whyShort,
          pickup: c.pickup,
        })),
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- Packages ----------------------------------------------------------

export interface PackageMatch {
  id: string;
  name: string;
  routeIata: string;
  inboundToIceland: boolean;
  hotelId: string;
  nights: number;
  bonus: string;
  priceFromEURPerPerson: number;
  vibe: string[];
  why: string;
}

export interface SearchPackagesResult {
  query_summary: string;
  packages: PackageMatch[];
}

function packageSeasonFits(
  pkg: BlueLagoonHolidaysPackage,
  wanted?: PackageSeason,
): boolean {
  if (!wanted) return true;
  if (pkg.bestSeason === "year-round") return true;
  return pkg.bestSeason === wanted;
}

export function makeSearchPackagesTool(
  onResult?: (result: SearchPackagesResult) => void,
) {
  return betaTool({
    name: "search_packages",
    description:
      "Search Blue Lagoon Holidays bundled packages (flight + hotel + a curated bonus). Call this whenever the traveller says package, deal, all-in, flight + hotel, or an Iceland stopover. Mix inbound (to Iceland) and outbound (from KEF) packages by setting inbound_to_iceland.",
    inputSchema: {
      type: "object",
      properties: {
        vibe: {
          type: "array",
          items: { type: "string" },
          description:
            "Vibe tags drawn from the traveller's words: spa, design, adventure, warm, food, northern-lights, etc.",
        },
        nights: {
          type: "number",
          description: "Preferred number of nights.",
        },
        season: {
          type: "string",
          enum: ["winter", "summer", "shoulder", "year-round"],
          description: "Season hint.",
        },
        inbound_to_iceland: {
          type: "boolean",
          description:
            "True for stopover-style packages bringing travellers to Iceland; false for outbound packages from KEF; omit for both.",
        },
        budget_eur_pp: {
          type: "number",
          description: "Soft cap on per-person package price in EUR.",
        },
        max_options: {
          type: "number",
          description: "Maximum number of package matches to return (cap 3).",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const wantedVibe = (args.vibe as string[] | undefined) ?? [];
      const nights = args.nights as number | undefined;
      const season = args.season as PackageSeason | undefined;
      const inbound = args.inbound_to_iceland as boolean | undefined;
      const budget = args.budget_eur_pp as number | undefined;
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 3),
        3,
      );

      let candidates = PACKAGES.filter((p) => packageSeasonFits(p, season));
      if (inbound !== undefined) {
        candidates = candidates.filter((p) => p.inboundToIceland === inbound);
      }
      if (budget !== undefined) {
        candidates = candidates.filter(
          (p) => p.priceFromEURPerPerson <= budget * 1.2,
        );
      }

      const scored = candidates.map((p) => {
        const v = vibeOverlap(p.vibe, wantedVibe);
        const nightsBonus =
          nights !== undefined && Math.abs(p.nights - nights) <= 1 ? 3 : 0;
        const budgetBonus =
          budget !== undefined && p.priceFromEURPerPerson <= budget ? 2 : 0;
        const pricePenalty = p.priceFromEURPerPerson / 4000;
        const score = v * 3 + nightsBonus + budgetBonus - pricePenalty;
        return { p, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, maxOptions).map((s) => s.p);

      const summaryBits: string[] = [];
      if (wantedVibe.length) summaryBits.push(wantedVibe.slice(0, 3).join(" + "));
      if (nights !== undefined) summaryBits.push(`${nights} nights`);
      if (season) summaryBits.push(season);
      if (inbound !== undefined) {
        summaryBits.push(inbound ? "to Iceland" : "from KEF");
      }
      if (budget !== undefined) summaryBits.push(`under €${budget} pp`);
      const querySummary = summaryBits.length
        ? `Packages for ${summaryBits.join(", ")}`
        : "Blue Lagoon Holidays packages";

      const result: SearchPackagesResult = {
        query_summary: querySummary,
        packages: top.map((p) => ({
          id: p.id,
          name: p.name,
          routeIata: p.routeIata,
          inboundToIceland: p.inboundToIceland,
          hotelId: p.hotelId,
          nights: p.nights,
          bonus: p.bonus,
          priceFromEURPerPerson: p.priceFromEURPerPerson,
          vibe: p.vibe,
          why: p.whyShort,
        })),
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}
