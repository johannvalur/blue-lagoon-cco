import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import {
  ENTRY_TIERS,
  type EntryTier,
  type EntryTierId,
} from "@/lib/data/customer/fares";
import { ADDONS, type Addon } from "@/lib/data/customer/stopover";
import { HOTELS } from "@/lib/data/customer/hotels";

// ----- Public result types ---------------------------------------------

export interface SearchExperiencesOption {
  tierId: EntryTierId;
  name: string;
  priceEUR: number;
  inclusions: string[];
  vibe: string[];
  why: string;
}

export interface SearchExperiencesAddon {
  id: string;
  name: string;
  category: Addon["category"];
  priceEUR: number;
  durationMin?: number;
  whyShort: string;
}

export interface SearchExperiencesResult {
  query_summary: string;
  tiers: SearchExperiencesOption[];
  addons: SearchExperiencesAddon[];
  note?: string;
}

export interface HoldReservationAddon {
  id: string;
  name: string;
  priceEUR: number;
}

export interface HoldReservationResult {
  reservation_ref: string;
  tier_id: EntryTierId;
  tier_name: string;
  hotel_id: string | null;
  hotel_name: string | null;
  // ISO yyyy-mm-dd
  date: string;
  // HH:MM 24h
  arrival_time: string;
  // Number of nights (0 if day-visit only).
  nights: number;
  addons: HoldReservationAddon[];
  guests: number;
  total_eur: number;
  message: string;
}

export interface SaveTripIdeaLeg {
  // Kept as a generic "where" field — for spa visits we encode tier name +
  // hotel name here so older renderers still have something to show.
  origin: string;
  destination: string;
  iata: string;
  departDate?: string;
  returnDate?: string;
  // Vestigial — older renderers expect these fields. We leave them
  // populated only when meaningful.
  flightTimeHrs?: number;
  fareEUR?: number;
}

export interface SaveTripIdeaPayload {
  id: string;
  title: string;
  summary: string;
  legs: SaveTripIdeaLeg[];
  hotels: Array<{
    id: string;
    name: string;
    nights: number;
    pricePerNightEUR: number;
  }>;
  // Renamed conceptually from "cars" to "transfers/addons" but the field
  // shape is preserved so the share-link codec stays stable.
  cars: Array<{
    id: string;
    name: string;
    days: number;
    pricePerDayEUR: number;
  }>;
  packages: Array<{
    id: string;
    name: string;
    priceFromEURPerPerson: number;
  }>;
  totalEstimateEUR?: number;
  travelers: number;
  notes?: string;
  createdAt: string;
}

export interface SaveTripIdeaResult {
  trip_id: string;
  share_path: string;
  payload: SaveTripIdeaPayload;
  message: string;
}

// ---- Discovery helpers -------------------------------------------------

function vibeOverlap(a: readonly string[], b: readonly string[]): number {
  if (b.length === 0) return 0;
  const set = new Set(a.map((v) => v.toLowerCase()));
  let n = 0;
  for (const w of b) if (set.has(w.toLowerCase())) n += 1;
  return n;
}

function rankTiers(
  vibe: readonly string[],
  budget: number | undefined,
  partyMood: "solo" | "couple" | "friends" | "anyone",
): EntryTier[] {
  const scored = ENTRY_TIERS.map((t) => {
    let s = 0;
    // Light vibe match against tier inclusions text.
    const tierVibe = [
      ...(t.id === "comfort" ? ["essentials", "icon", "layover"] : []),
      ...(t.id === "premium" ? ["food", "essentials", "icon"] : []),
      ...(t.id === "signature" ? ["treatment", "privacy", "couples"] : []),
      ...(t.id === "retreat-spa"
        ? ["luxury", "privacy", "ritual", "indulgence", "couples"]
        : []),
    ];
    s += vibeOverlap(tierVibe, vibe) * 3;

    if (budget !== undefined) {
      if (t.priceEUR <= budget) s += 2;
      // Don't completely exclude tiers above budget — surface as a stretch.
      else s -= (t.priceEUR - budget) / 200;
    }

    if (partyMood === "couple" && (t.id === "signature" || t.id === "retreat-spa"))
      s += 1.5;
    if (partyMood === "friends" && t.id === "premium") s += 1;

    return { t, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored.map((x) => x.t);
}

function rankAddons(
  category: Addon["category"] | undefined,
  vibe: readonly string[],
  durationMaxMin: number | undefined,
  budget: number | undefined,
): Addon[] {
  let candidates = ADDONS.slice();
  if (category) candidates = candidates.filter((a) => a.category === category);
  if (durationMaxMin !== undefined)
    candidates = candidates.filter(
      (a) => (a.durationMin ?? 0) <= durationMaxMin,
    );
  if (budget !== undefined)
    candidates = candidates.filter((a) => a.priceEUR <= budget * 1.2);

  const scored = candidates.map((a) => {
    let s = vibeOverlap(a.vibes, vibe) * 3;
    if (budget !== undefined && a.priceEUR <= budget) s += 1.5;
    s -= a.priceEUR / 500;
    return { a, s };
  });
  scored.sort((x, y) => y.s - x.s);
  return scored.map((x) => x.a);
}

function buildTierWhy(tier: EntryTier, wanted: readonly string[]): string {
  const tierVibe =
    tier.id === "comfort"
      ? ["essentials", "icon"]
      : tier.id === "premium"
        ? ["food", "icon"]
        : tier.id === "signature"
          ? ["treatment", "privacy"]
          : ["luxury", "ritual"];
  const matched = tierVibe.filter((v) =>
    wanted.map((w) => w.toLowerCase()).includes(v.toLowerCase()),
  );
  const head = matched.length
    ? `Hits the ${matched.slice(0, 2).join(" + ")} brief.`
    : `Leans into ${tierVibe.slice(0, 2).join(" and ")}.`;
  return `${head} ${tier.whoItsFor}`;
}

// ---- Ref + id generators ----------------------------------------------

function genReservationRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "BL";
  for (let i = 0; i < 6; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function genTripIdeaId(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "vi_";
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

// ---- search_experiences -----------------------------------------------

export function makeSearchExperiencesTool(
  onResult?: (result: SearchExperiencesResult) => void,
) {
  return betaTool({
    name: "search_experiences",
    description:
      "Search Blue Lagoon visit options: returns ranked entry tiers (Comfort, Premium, Signature, Retreat Spa) and a small set of add-ons (treatments, dining, mask-bar upgrades) suited to the guest's brief. Call this first when the guest is exploring or asks about prices, packages, what's included, or what kind of visit fits a window. Use vibe + budget + how-long to shape the picks.",
    inputSchema: {
      type: "object",
      properties: {
        vibe: {
          type: "array",
          items: { type: "string" },
          description:
            "Vibe tags drawn from the guest's words: essentials, icon, food, couples, treatment, privacy, luxury, aurora, evening, ritual, wellness.",
        },
        time_window_hours: {
          type: "number",
          description:
            "How many hours the guest has on site. 2-3 favours Comfort; 4-5 favours Premium or Signature; 5+ with overnight cues The Retreat.",
        },
        party_mood: {
          type: "string",
          enum: ["solo", "couple", "friends", "anyone"],
          description: "Loose hint at who's visiting.",
        },
        budget_eur: {
          type: "number",
          description: "Soft cap on the per-person entry tier in EUR.",
        },
        include_addons: {
          type: "boolean",
          description:
            "Whether to include suggested add-ons. Defaults to true.",
        },
        addon_category: {
          type: "string",
          enum: ["treatment", "dining", "product", "upgrade"],
          description:
            "Restrict add-on suggestions to a single category.",
        },
        max_options: {
          type: "number",
          description:
            "Maximum tiers to return (cap 4) and add-ons to return (cap 4).",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const vibe = (args.vibe as string[] | undefined) ?? [];
      const window = args.time_window_hours as number | undefined;
      const mood =
        (args.party_mood as
          | "solo"
          | "couple"
          | "friends"
          | "anyone"
          | undefined) ?? "anyone";
      const budget = args.budget_eur as number | undefined;
      const includeAddons =
        (args.include_addons as boolean | undefined) ?? true;
      const addonCategory = args.addon_category as
        | Addon["category"]
        | undefined;
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 3),
        4,
      );

      const ranked = rankTiers(vibe, budget, mood);
      const topTiers = ranked.slice(0, maxOptions);

      let topAddons: Addon[] = [];
      if (includeAddons) {
        topAddons = rankAddons(addonCategory, vibe, undefined, undefined).slice(
          0,
          maxOptions,
        );
      }

      const summaryBits: string[] = [];
      if (vibe.length) summaryBits.push(vibe.slice(0, 3).join(" + "));
      if (window !== undefined) summaryBits.push(`${window}h on site`);
      if (budget !== undefined) summaryBits.push(`under €${budget}`);
      const querySummary = summaryBits.length
        ? `Picks for ${summaryBits.join(", ")}`
        : "Suggested entry tiers";

      const note =
        window !== undefined && window <= 3
          ? "A 2-3 hour visit reads as Comfort or Premium — no overnight needed."
          : window !== undefined && window >= 8
            ? "For a full day plus dinner, Premium or Signature pair best."
            : undefined;

      const result: SearchExperiencesResult = {
        query_summary: querySummary,
        tiers: topTiers.map((t) => ({
          tierId: t.id,
          name: t.name,
          priceEUR: t.priceEUR,
          inclusions: t.inclusions,
          vibe:
            t.id === "comfort"
              ? ["essentials", "icon"]
              : t.id === "premium"
                ? ["food", "icon"]
                : t.id === "signature"
                  ? ["treatment", "privacy"]
                  : ["luxury", "ritual"],
          why: buildTierWhy(t, vibe),
        })),
        addons: topAddons.map((a) => ({
          id: a.id,
          name: a.name,
          category: a.category,
          priceEUR: a.priceEUR,
          durationMin: a.durationMin,
          whyShort: a.whyShort,
        })),
        note,
      };

      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- hold_reservation -------------------------------------------------

export function makeHoldReservationTool(
  onResult?: (result: HoldReservationResult) => void,
) {
  return betaTool({
    name: "hold_reservation",
    description:
      "Hold a specific Blue Lagoon visit reservation: tier, date, arrival time, optional hotel + nights, and any selected add-ons. Use this only after the guest has settled on the tier and the date. Returns a reservation reference and total in EUR. This is a demo hold — no payment is taken.",
    inputSchema: {
      type: "object",
      properties: {
        tier_id: {
          type: "string",
          enum: ["comfort", "premium", "signature", "retreat-spa"],
          description: "Entry tier the guest has chosen.",
        },
        date: {
          type: "string",
          description: "ISO yyyy-mm-dd date of the visit (or first night).",
        },
        arrival_time: {
          type: "string",
          description:
            "Arrival time, HH:MM 24h. Defaults to 14:00 if omitted.",
        },
        hotel_id: {
          type: "string",
          description:
            "Optional hotel id (e.g. hot-silica, hot-retreat). Omit for day-visit only.",
        },
        nights: {
          type: "number",
          description:
            "Number of nights when a hotel is included. Defaults to 1 if hotel_id is set.",
        },
        addon_ids: {
          type: "array",
          items: { type: "string" },
          description:
            "Addon ids from ADDONS — treatments, dining, mask-bar upgrades, products.",
        },
        guests: {
          type: "number",
          description: "Number of guests on the booking (≥ 1).",
        },
      },
      required: ["tier_id", "date", "guests"],
    } as const,
    run: (args) => {
      const tierId = args.tier_id as EntryTierId;
      const date = args.date as string;
      const arrival = (args.arrival_time as string | undefined) ?? "14:00";
      const hotelId = args.hotel_id as string | undefined;
      const requestedNights = args.nights as number | undefined;
      const addonIds = (args.addon_ids as string[] | undefined) ?? [];
      const guests = Math.max(1, (args.guests as number) ?? 1);

      const tier = ENTRY_TIERS.find((t) => t.id === tierId);
      if (!tier) {
        return JSON.stringify({
          error: `Unknown entry tier ${tierId}.`,
        });
      }

      const hotel = hotelId
        ? HOTELS.find((h) => h.id === hotelId) ?? null
        : null;
      const nights = hotel
        ? Math.max(1, requestedNights ?? 1)
        : 0;

      const addons = addonIds
        .map((id) => ADDONS.find((a) => a.id === id))
        .filter((a): a is Addon => Boolean(a))
        .map((a) => ({
          id: a.id,
          name: a.name,
          priceEUR: a.priceEUR,
        }));

      const tierTotal = tier.priceEUR * guests;
      const hotelTotal = hotel
        ? hotel.priceEURPerNightFrom * nights
        : 0;
      const addonsTotal = addons.reduce(
        (sum, a) => sum + a.priceEUR * guests,
        0,
      );
      const total = Math.round(tierTotal + hotelTotal + addonsTotal);

      const result: HoldReservationResult = {
        reservation_ref: genReservationRef(),
        tier_id: tier.id,
        tier_name: tier.name,
        hotel_id: hotel?.id ?? null,
        hotel_name: hotel?.name ?? null,
        date,
        arrival_time: arrival,
        nights,
        addons,
        guests,
        total_eur: total,
        message: hotel
          ? `Held — ${hotel.name}, ${nights} night${nights === 1 ? "" : "s"}, ${tier.name} entry.`
          : `Held — ${tier.name} entry on ${date} at ${arrival}.`,
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- save_trip_idea (semantics: shareable visit idea) -----------------

function base64urlEncode(s: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(s, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  // eslint-disable-next-line no-undef
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function makeSaveTripIdeaTool(
  onResult?: (result: SaveTripIdeaResult) => void,
) {
  return betaTool({
    name: "save_trip_idea",
    description:
      "Save the guest's visit idea — tier, hotel, add-ons, date — into a shareable URL. Call this proactively once the plan is coherent (after search_experiences and at least one of search_hotels / search_transfers / search_packages / search_addons). The client persists the idea to localStorage. The returned share_path is browser-shareable.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description:
            "Short title for the visit idea, e.g. 'Aurora evening + Silica overnight'.",
        },
        summary: {
          type: "string",
          description:
            "One-line summary, ≤ 200 chars, plain language.",
        },
        // Loose container: each "leg" is a step in the plan — usually a
        // single entry tier with an optional hotel. We keep the array shape
        // so the existing share-link codec stays valid.
        legs: {
          type: "array",
          description:
            "Steps in the plan. For a spa visit, normally a single entry — origin = 'Reykjavík' or 'KEF', destination = 'Blue Lagoon', iata = tier id (comfort/premium/signature/retreat-spa).",
          items: {
            type: "object",
            properties: {
              origin: { type: "string" },
              destination: { type: "string" },
              iata: { type: "string" },
              departDate: { type: "string" },
              returnDate: { type: "string" },
              flightTimeHrs: { type: "number" },
              fareEUR: { type: "number" },
            },
            required: ["origin", "destination", "iata"],
          },
        },
        hotels: {
          type: "array",
          description: "Hotels added to the visit idea.",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              nights: { type: "number" },
              pricePerNightEUR: { type: "number" },
            },
            required: ["id", "name", "nights", "pricePerNightEUR"],
          },
        },
        cars: {
          type: "array",
          description:
            "Transfers added to the visit idea (we keep the field name for compatibility with the share-link codec).",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              days: { type: "number" },
              pricePerDayEUR: { type: "number" },
            },
            required: ["id", "name", "days", "pricePerDayEUR"],
          },
        },
        packages: {
          type: "array",
          description: "Spa packages added to the visit idea.",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              priceFromEURPerPerson: { type: "number" },
            },
            required: ["id", "name", "priceFromEURPerPerson"],
          },
        },
        total_estimate_eur: {
          type: "number",
          description: "Optional total visit cost estimate in EUR.",
        },
        travelers: {
          type: "number",
          description: "Number of guests. Defaults to 1.",
        },
        notes: {
          type: "string",
          description:
            "Optional free-text notes the guest might want to remember (e.g. preferred add-ons, gift occasion).",
        },
      },
      required: ["title", "summary", "legs"],
    } as const,
    run: (args) => {
      const tripId = genTripIdeaId();
      const payload: SaveTripIdeaPayload = {
        id: tripId,
        title: (args.title as string) ?? "Visit idea",
        summary: ((args.summary as string) ?? "").slice(0, 220),
        legs: ((args.legs as SaveTripIdeaLeg[] | undefined) ?? []).map(
          (l) => ({
            origin: l.origin ?? "",
            destination: l.destination ?? "",
            iata: l.iata ?? l.destination ?? "",
            departDate: l.departDate,
            returnDate: l.returnDate,
            flightTimeHrs: l.flightTimeHrs,
            fareEUR: l.fareEUR,
          }),
        ),
        hotels:
          (args.hotels as SaveTripIdeaPayload["hotels"] | undefined) ?? [],
        cars: (args.cars as SaveTripIdeaPayload["cars"] | undefined) ?? [],
        packages:
          (args.packages as SaveTripIdeaPayload["packages"] | undefined) ?? [],
        totalEstimateEUR: args.total_estimate_eur as number | undefined,
        travelers: Math.max(1, (args.travelers as number | undefined) ?? 1),
        notes: args.notes as string | undefined,
        createdAt: new Date().toISOString(),
      };

      const encoded = base64urlEncode(JSON.stringify(payload));
      const sharePath = `/customer/trip/${encoded}`;

      const result: SaveTripIdeaResult = {
        trip_id: tripId,
        share_path: sharePath,
        payload,
        message: `Saved as "${payload.title}". Share link is ready when you are.`,
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

// ---- Back-compat name aliases ------------------------------------------
// Other slices (and the handler, until it's updated below) may import the
// old names. Map the new constructors onto the legacy names + types so the
// type aliases line up at the import site too.

export const makeSearchFlightsTool = makeSearchExperiencesTool;
export const makeHoldBookingTool = makeHoldReservationTool;
export type SearchFlightsResult = SearchExperiencesResult;
export type HoldBookingResult = HoldReservationResult;
