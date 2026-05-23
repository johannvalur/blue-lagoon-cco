import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import {
  HOTELS,
  type Hotel,
  type HotelLocation,
  type HotelTier,
} from "@/lib/data/customer/hotels";
import {
  TRANSFERS,
  type Transfer,
  type TransferPickup,
} from "@/lib/data/customer/cars";
import {
  PACKAGES,
  type SpaPackage,
  type PackageSeason,
} from "@/lib/data/customer/packages";
import { ADDONS, type Addon } from "@/lib/data/customer/stopover";

// ---- Common ranking ---------------------------------------------------

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

// ---- Hotels -----------------------------------------------------------

export interface HotelMatch {
  id: string;
  name: string;
  location: HotelLocation;
  isOnsite: boolean;
  tier: HotelTier;
  priceEURPerNightFrom: number;
  priceEURPerNightTo: number;
  vibe: string[];
  why: string;
  restaurantsOnsite?: string[];
}

export interface SearchHotelsResult {
  query_summary: string;
  hotels: HotelMatch[];
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
      "Search Blue Lagoon stay options. Two on-site hotels (Silica, The Retreat) and two Reykjavík partners (ION City, Hotel Borg). Call this whenever the guest mentions an overnight, a hotel, where to stay, or pairing a stay with a visit.",
    inputSchema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          enum: ["onsite", "reykjavik", "any"],
          description:
            "Where the guest wants to stay. 'onsite' = at the lagoon (Silica or The Retreat). 'reykjavik' = in town. 'any' returns both.",
        },
        vibe: {
          type: "array",
          items: { type: "string" },
          description:
            "Vibe tags drawn from the guest's words: design, quiet, central, luxury, private-lagoon, history, city.",
        },
        tier: {
          type: "string",
          enum: ["design", "suite", "city", "boutique"],
          description: "Optional hotel tier filter.",
        },
        nights: {
          type: "number",
          description: "Number of nights — used in the summary line.",
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
      const loc = (args.location as "onsite" | "reykjavik" | "any" | undefined) ?? "any";
      const wantedVibe = (args.vibe as string[] | undefined) ?? [];
      const tier = args.tier as HotelTier | undefined;
      const budget = args.budget_eur_per_night as number | undefined;
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 3),
        4,
      );

      let candidates = HOTELS.slice();
      if (loc !== "any")
        candidates = candidates.filter((h) => h.location === loc);
      if (tier) candidates = candidates.filter((h) => h.tier === tier);

      const scored = candidates.map((h) => {
        const v = vibeOverlap(h.vibe, wantedVibe);
        const budgetBonus =
          budget !== undefined && h.priceEURPerNightFrom <= budget ? 2 : 0;
        const pricePenalty = h.priceEURPerNightFrom / 3000;
        const score = v * 3 + budgetBonus - pricePenalty;
        return { h, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, maxOptions).map((s) => s.h);

      const summaryBits: string[] = [];
      if (loc !== "any") summaryBits.push(loc === "onsite" ? "on-site" : "Reykjavík");
      if (wantedVibe.length) summaryBits.push(wantedVibe.slice(0, 3).join(" + "));
      if (tier) summaryBits.push(tier);
      const querySummary = summaryBits.length
        ? `Hotels for ${summaryBits.join(", ")}`
        : "Curated Blue Lagoon stays";

      const result: SearchHotelsResult = {
        query_summary: querySummary,
        hotels: top.map((h) => ({
          id: h.id,
          name: h.name,
          location: h.location,
          isOnsite: h.isOnsite,
          tier: h.tier,
          priceEURPerNightFrom: h.priceEURPerNightFrom,
          priceEURPerNightTo: h.priceEURPerNightTo,
          vibe: h.vibe,
          why: buildHotelWhy(h, wantedVibe),
          restaurantsOnsite: h.restaurantsOnsite,
        })),
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- Transfers ---------------------------------------------------------

export interface TransferMatch {
  id: string;
  name: string;
  pickupLocation: TransferPickup;
  pickupLabel: string;
  pricePerPersonEUR: number;
  durationMinutes: number;
  capacity: number;
  why: string;
}

export interface SearchTransfersResult {
  query_summary: string;
  transfers: TransferMatch[];
}

export function makeSearchTransfersTool(
  onResult?: (result: SearchTransfersResult) => void,
) {
  return betaTool({
    name: "search_transfers",
    description:
      "Search how the guest gets to the Blue Lagoon: shared shuttle from BSÍ, private transfer from Reykjavík, KEF airport pickup, or self-drive. Call this whenever the guest asks about getting there, a transfer, a pickup, an airport stop, or a return ride.",
    inputSchema: {
      type: "object",
      properties: {
        pickup: {
          type: "string",
          enum: [
            "reykjavik-bsi",
            "reykjavik-door",
            "kef-airport",
            "self-drive",
            "any",
          ],
          description: "Where the guest is starting from.",
        },
        party_size: {
          type: "number",
          description:
            "Guests on the transfer. Influences the shared vs private pick.",
        },
        budget_eur_per_person: {
          type: "number",
          description: "Soft cap on per-person EUR price.",
        },
        max_options: {
          type: "number",
          description: "Maximum number of transfer matches to return (cap 4).",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const pickup =
        (args.pickup as TransferPickup | "any" | undefined) ?? "any";
      const partySize = Math.max(1, (args.party_size as number | undefined) ?? 1);
      const budget = args.budget_eur_per_person as number | undefined;
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 3),
        4,
      );

      let candidates = TRANSFERS.slice();
      if (pickup !== "any")
        candidates = candidates.filter((t) => t.pickupLocation === pickup);
      if (budget !== undefined)
        candidates = candidates.filter(
          (t) => t.pricePerPersonEUR <= budget * 1.5,
        );

      const scored = candidates.map((t) => {
        let s = 0;
        // Private door pickup wins for parties of 3+; otherwise penalty.
        if (t.pickupLocation === "reykjavik-door") {
          s += partySize >= 3 ? 2 : -1;
        }
        // Shuttle wins for 1-2 guests.
        if (t.pickupLocation === "reykjavik-bsi") {
          s += partySize <= 2 ? 1.5 : 0;
        }
        s -= t.pricePerPersonEUR / 100;
        return { t, s };
      });
      scored.sort((a, b) => b.s - a.s);
      const top = scored.slice(0, maxOptions).map((s) => s.t);

      const summaryBits: string[] = [];
      if (pickup !== "any") summaryBits.push(`from ${pickup}`);
      summaryBits.push(`${partySize} guest${partySize === 1 ? "" : "s"}`);
      const querySummary = `Transfers — ${summaryBits.join(", ")}`;

      const result: SearchTransfersResult = {
        query_summary: querySummary,
        transfers: top.map((t) => ({
          id: t.id,
          name: t.name,
          pickupLocation: t.pickupLocation,
          pickupLabel: t.pickupLabel,
          pricePerPersonEUR: t.pricePerPersonEUR,
          durationMinutes: t.durationMinutes,
          capacity: t.capacity,
          why: t.whyShort,
        })),
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- Packages ---------------------------------------------------------

export interface PackageMatch {
  id: string;
  name: string;
  nights: number;
  hotelId: string;
  hotelName: string | null;
  entryTierId: SpaPackage["entryTierId"];
  treatments: string[];
  dining: string[];
  priceEUR: number;
  vibe: string[];
  why: string;
}

export interface SearchPackagesResult {
  query_summary: string;
  packages: PackageMatch[];
}

function packageSeasonFits(
  pkg: SpaPackage,
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
      "Search Blue Lagoon spa packages: multi-night bundles built around a hotel, an entry tier, and treatments + dining. Call this whenever the guest asks for a package, a weekend, an anniversary trip, a wellness reset, or anything that suggests a multi-night plan.",
    inputSchema: {
      type: "object",
      properties: {
        vibe: {
          type: "array",
          items: { type: "string" },
          description:
            "Vibe tags drawn from the guest's words: couples, friends, wellness, special-occasion, aurora, winter, indulgence, value.",
        },
        nights: {
          type: "number",
          description: "Preferred number of nights.",
        },
        season: {
          type: "string",
          enum: ["winter", "summer", "shoulder", "year-round"],
          description: "Season hint. Aurora season is winter.",
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
      const budget = args.budget_eur_pp as number | undefined;
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 3),
        3,
      );

      let candidates = PACKAGES.filter((p) => packageSeasonFits(p, season));
      if (budget !== undefined) {
        candidates = candidates.filter((p) => p.priceEUR <= budget * 1.2);
      }

      const scored = candidates.map((p) => {
        const v = vibeOverlap(p.vibe, wantedVibe);
        const nightsBonus =
          nights !== undefined && Math.abs(p.nights - nights) <= 1 ? 3 : 0;
        const budgetBonus =
          budget !== undefined && p.priceEUR <= budget ? 2 : 0;
        const pricePenalty = p.priceEUR / 6000;
        const score = v * 3 + nightsBonus + budgetBonus - pricePenalty;
        return { p, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, maxOptions).map((s) => s.p);

      const summaryBits: string[] = [];
      if (wantedVibe.length) summaryBits.push(wantedVibe.slice(0, 3).join(" + "));
      if (nights !== undefined) summaryBits.push(`${nights} nights`);
      if (season) summaryBits.push(season);
      if (budget !== undefined) summaryBits.push(`under €${budget} pp`);
      const querySummary = summaryBits.length
        ? `Packages for ${summaryBits.join(", ")}`
        : "Blue Lagoon spa packages";

      const result: SearchPackagesResult = {
        query_summary: querySummary,
        packages: top.map((p) => {
          const hotel = HOTELS.find((h) => h.id === p.hotelId);
          return {
            id: p.id,
            name: p.name,
            nights: p.nights,
            hotelId: p.hotelId,
            hotelName: hotel?.name ?? null,
            entryTierId: p.entryTierId,
            treatments: p.treatments,
            dining: p.dining,
            priceEUR: p.priceEUR,
            vibe: p.vibe,
            why: p.whyShort,
          };
        }),
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- Add-ons -----------------------------------------------------------

export interface AddonMatch {
  id: string;
  name: string;
  category: Addon["category"];
  durationMin?: number;
  priceEUR: number;
  vibes: Addon["vibes"];
  why: string;
}

export interface SearchAddonsResult {
  query_summary: string;
  addons: AddonMatch[];
}

export function makeSearchAddonsTool(
  onResult?: (result: SearchAddonsResult) => void,
) {
  return betaTool({
    name: "search_addons",
    description:
      "Search Blue Lagoon add-ons — treatments, dining bookings, mask-bar upgrades, and skincare products that layer on top of an entry tier. Call this whenever the guest asks about a massage, a treatment, a wrap, a dinner reservation, mask upgrades, or skincare products to take home.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["treatment", "dining", "product", "upgrade"],
          description:
            "Restrict to one category. Omit to mix across all of them.",
        },
        vibe: {
          type: "array",
          items: { type: "string" },
          description:
            "Vibe tags drawn from the guest's words: couples, ritual, deep-tissue, float, skincare, tasting, indulgence, aurora, evening.",
        },
        duration_max_min: {
          type: "number",
          description: "Soft cap on treatment duration in minutes.",
        },
        budget_eur: {
          type: "number",
          description: "Soft cap on per-add-on EUR price.",
        },
        max_options: {
          type: "number",
          description: "Maximum add-ons to return (cap 5).",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const category = args.category as Addon["category"] | undefined;
      const wantedVibe = (args.vibe as string[] | undefined) ?? [];
      const durationMax = args.duration_max_min as number | undefined;
      const budget = args.budget_eur as number | undefined;
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 4),
        5,
      );

      let candidates = ADDONS.slice();
      if (category) candidates = candidates.filter((a) => a.category === category);
      if (durationMax !== undefined)
        candidates = candidates.filter(
          (a) => (a.durationMin ?? 0) <= durationMax,
        );
      if (budget !== undefined)
        candidates = candidates.filter((a) => a.priceEUR <= budget * 1.3);

      const scored = candidates.map((a) => {
        let s = vibeOverlap(a.vibes, wantedVibe) * 3;
        if (budget !== undefined && a.priceEUR <= budget) s += 1;
        s -= a.priceEUR / 500;
        return { a, s };
      });
      scored.sort((x, y) => y.s - x.s);
      const top = scored.slice(0, maxOptions).map((s) => s.a);

      const summaryBits: string[] = [];
      if (category) summaryBits.push(category);
      if (wantedVibe.length) summaryBits.push(wantedVibe.slice(0, 3).join(" + "));
      if (durationMax !== undefined) summaryBits.push(`≤ ${durationMax} min`);
      if (budget !== undefined) summaryBits.push(`under €${budget}`);
      const querySummary = summaryBits.length
        ? `Add-ons for ${summaryBits.join(", ")}`
        : "Suggested add-ons";

      const result: SearchAddonsResult = {
        query_summary: querySummary,
        addons: top.map((a) => ({
          id: a.id,
          name: a.name,
          category: a.category,
          durationMin: a.durationMin,
          priceEUR: a.priceEUR,
          vibes: a.vibes,
          why: a.whyShort,
        })),
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- Back-compat shims -------------------------------------------------
// Existing handler + components still import old names. We forward them to
// the new constructors so cross-agent imports stay green until each slice
// is rewritten.

export const makeSearchCarsTool = makeSearchTransfersTool;
export type SearchCarsResult = SearchTransfersResult;
