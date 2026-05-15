import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { NETWORK, type Route } from "@/lib/data/customer/routes";
import { FARE_RULES } from "@/lib/data/customer/fares";

export interface SearchFlightsOption {
  destination: string;
  iata: string;
  country: string;
  flightTimeHrs: number;
  fareEUR: number;
  sagaFareEUR: number;
  vibe: string[];
  why: string;
  bestMonths: string[];
}

export interface FlightLeg {
  origin: string;
  destination: string;
  iata: string;
  flightTimeHrs: number;
  fareEUR: number;
  note?: string;
}

export type TripShape =
  | "round-trip"
  | "one-way"
  | "multi-city"
  | "stopover-bridge";

export interface SearchFlightsResult {
  query_summary: string;
  options: SearchFlightsOption[];
  legs: FlightLeg[];
  trip_shape: TripShape;
}

export interface HoldBookingResult {
  booking_ref: string;
  destination: string;
  destination_iata: string;
  depart_date: string;
  return_date: string;
  fare_class: "light" | "standard" | "flex" | "saga";
  travelers: number;
  total_eur: number;
  message: string;
}

export interface SaveTripIdeaLeg {
  origin: string;
  destination: string;
  iata: string;
  departDate?: string;
  returnDate?: string;
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

const MONTH_TOKENS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const MONTH_LONG: Record<string, string> = {
  january: "jan",
  february: "feb",
  march: "mar",
  april: "apr",
  may: "may",
  june: "jun",
  july: "jul",
  august: "aug",
  september: "sep",
  october: "oct",
  november: "nov",
  december: "dec",
};

function detectMonths(input?: string): string[] {
  if (!input) return [];
  const lower = input.toLowerCase();
  const found = new Set<string>();
  for (const tok of MONTH_TOKENS) {
    if (lower.includes(tok)) found.add(tok);
  }
  for (const [long, short] of Object.entries(MONTH_LONG)) {
    if (lower.includes(long)) found.add(short);
  }
  return [...found];
}

function vibeOverlap(routeVibes: string[], wanted: string[]): number {
  if (wanted.length === 0) return 0;
  const setRoute = new Set(routeVibes.map((v) => v.toLowerCase()));
  let n = 0;
  for (const w of wanted) {
    if (setRoute.has(w.toLowerCase())) n += 1;
  }
  return n;
}

function buildWhy(
  route: Route,
  wanted: string[],
  months: string[],
): string {
  const matchedVibes = route.vibe.filter((v) =>
    wanted.map((w) => w.toLowerCase()).includes(v.toLowerCase()),
  );
  const monthMatches = route.bestMonths.filter((m) => months.includes(m));

  const parts: string[] = [];
  if (matchedVibes.length > 0) {
    parts.push(`hits the ${matchedVibes.slice(0, 3).join(", ")} brief`);
  } else if (route.vibe.length > 0) {
    parts.push(`leans into ${route.vibe.slice(0, 2).join(" and ")}`);
  }
  if (monthMatches.length > 0) {
    parts.push(`a sweet spot in ${monthMatches[0]}`);
  }
  parts.push(`${route.flightTimeHrs}h direct from KEF`);
  const sentence = parts.join(", ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function rankRoutes(
  origin: string,
  vibe: string[],
  months: string[],
  budget: number | undefined,
): Route[] {
  const candidates = NETWORK.filter(
    (r) => r.iata !== origin && r.iata !== "KEF",
  );
  const scored = candidates.map((r) => {
    const vScore = vibeOverlap(r.vibe, vibe);
    const mScore = months.length
      ? r.bestMonths.filter((m) => months.includes(m)).length
      : 0;
    const budgetBonus =
      budget !== undefined && r.fromKEFFareEUR.economy <= budget ? 2 : 0;
    const farePenalty = r.fromKEFFareEUR.economy / 1000; // small tiebreaker
    const score = vScore * 3 + mScore * 2 + budgetBonus - farePenalty;
    return { route: r, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.route);
}

function genBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "IC";
  for (let i = 0; i < 6; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function genTripIdeaId(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "tr_";
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

const FARE_MULTIPLIER: Record<HoldBookingResult["fare_class"], number> = {
  light: 1.0,
  standard: 1.0,
  flex: 1.6,
  saga: 2.5,
};

interface LegInput {
  origin?: string;
  destination?: string;
  depart_window?: string;
}

function findRouteByIata(iata: string): Route | undefined {
  const upper = iata.toUpperCase();
  return NETWORK.find((r) => r.iata === upper);
}

function buildLegs(legInputs: LegInput[]): FlightLeg[] {
  const out: FlightLeg[] = [];
  for (const leg of legInputs) {
    const originIata = (leg.origin ?? "KEF").toUpperCase();
    const destIata = (leg.destination ?? "").toUpperCase();
    if (!destIata) continue;
    const destRoute = findRouteByIata(destIata);
    const originRoute = findRouteByIata(originIata);
    if (!destRoute) continue;
    // Approximate the leg fare from the KEF-anchored network. For non-KEF
    // origins we use the destination's KEF fare as the fallback price — it's
    // a concept-site mock, not a fare engine.
    const fareEUR = destRoute.fromKEFFareEUR.economy || 0;
    out.push({
      origin: originIata,
      destination: destRoute.destination,
      iata: destRoute.iata,
      flightTimeHrs: destRoute.flightTimeHrs,
      fareEUR,
      note:
        originRoute && originRoute.region === "iceland" && destRoute.region === "iceland"
          ? "Domestic hop"
          : undefined,
    });
  }
  return out;
}

export function makeSearchFlightsTool(
  onResult?: (result: SearchFlightsResult) => void,
) {
  return betaTool({
    name: "search_flights",
    description:
      "Search Blue Lagoon flights. Two modes. (1) Discovery: pass vibe/depart_window/budget without legs and the tool returns ranked destinations from KEF. (2) Multi-leg: pass legs[] for one-way, multi-city, or stopover-bridge itineraries (e.g. KEF → JFK → KEF via 2-night Reykjavík stopover). Always call this before recommending flights.",
    inputSchema: {
      type: "object",
      properties: {
        origin: {
          type: "string",
          description:
            "Origin IATA for the discovery query. Defaults to KEF (Keflavík).",
        },
        vibe: {
          type: "array",
          items: { type: "string" },
          description:
            "Vibe tags drawn from the traveller's words: warm, beach, city, food, design, ski, nature, etc.",
        },
        depart_window: {
          type: "string",
          description:
            "Free-text departure window, e.g. 'late February' or 'first week of October'.",
        },
        duration_days: {
          type: "number",
          description: "Trip length in days.",
        },
        travelers: {
          type: "number",
          description: "Number of travellers. Defaults to 1.",
        },
        budget_eur: {
          type: "number",
          description: "Soft cap on the per-person economy fare in EUR.",
        },
        max_options: {
          type: "number",
          description: "Maximum number of discovery options to return (cap 3).",
        },
        legs: {
          type: "array",
          description:
            "Explicit multi-leg itinerary. Each leg has origin and destination IATAs. Use for one-way, multi-city, or stopover-bridge trips. When present, the tool returns legs[] instead of discovery options.",
          items: {
            type: "object",
            properties: {
              origin: {
                type: "string",
                description: "Origin IATA. Defaults to the previous leg's destination, or KEF for the first leg.",
              },
              destination: {
                type: "string",
                description: "Destination IATA.",
              },
              depart_window: {
                type: "string",
                description: "Free-text depart window for this leg.",
              },
            },
            required: ["destination"],
          },
        },
        trip_shape: {
          type: "string",
          enum: ["round-trip", "one-way", "multi-city", "stopover-bridge"],
          description:
            "Shape hint for the UI. Defaults to 'round-trip' on discovery, 'multi-city' when legs[] has 3+ entries, 'stopover-bridge' when there's a 2-night Iceland leg between two same-country legs.",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const origin = (args.origin as string | undefined) ?? "KEF";
      const vibe = (args.vibe as string[] | undefined) ?? [];
      const departWindow = args.depart_window as string | undefined;
      const budget = args.budget_eur as number | undefined;
      const maxOptions = Math.min(
        Math.max(1, (args.max_options as number | undefined) ?? 3),
        3,
      );
      const legInputs = (args.legs as LegInput[] | undefined) ?? [];

      // Multi-leg branch
      if (legInputs.length > 0) {
        // Auto-fill leg origins from the previous leg's destination so the
        // model can pass partial inputs like [{destination:"JFK"},{destination:"BOS"},{destination:"KEF"}]
        const filled: LegInput[] = [];
        let prevDest: string | undefined;
        for (let i = 0; i < legInputs.length; i += 1) {
          const leg = legInputs[i];
          const o =
            leg.origin ?? (i === 0 ? "KEF" : prevDest);
          filled.push({
            origin: o,
            destination: leg.destination,
            depart_window: leg.depart_window,
          });
          if (leg.destination) prevDest = leg.destination;
        }
        const legs = buildLegs(filled);
        const tripShapeArg = args.trip_shape as TripShape | undefined;
        const shape: TripShape =
          tripShapeArg ??
          (legs.length >= 3 ? "multi-city" : "one-way");

        const cities = legs
          .map((l) => l.iata)
          .join(" → ");
        const total = legs.reduce((sum, l) => sum + l.fareEUR, 0);
        const result: SearchFlightsResult = {
          query_summary: `${shape.replace("-", " ")} routing — ${cities}, ~€${total} per person.`,
          options: [],
          legs,
          trip_shape: shape,
        };
        if (onResult) onResult(result);
        return JSON.stringify(result);
      }

      // Discovery branch
      const months = detectMonths(departWindow);
      const ranked = rankRoutes(origin, vibe, months, budget);
      const top = ranked.slice(0, maxOptions);

      const summaryBits: string[] = [];
      if (vibe.length) summaryBits.push(vibe.slice(0, 3).join(" + "));
      if (departWindow) summaryBits.push(departWindow);
      if (budget !== undefined) summaryBits.push(`under €${budget}`);
      const querySummary =
        summaryBits.length > 0
          ? `Matches for ${summaryBits.join(", ")}`
          : "Suggested destinations from KEF";

      const result: SearchFlightsResult = {
        query_summary: querySummary,
        options: top.map((r) => ({
          destination: r.destination,
          iata: r.iata,
          country: r.country,
          flightTimeHrs: r.flightTimeHrs,
          fareEUR: r.fromKEFFareEUR.economy,
          sagaFareEUR: r.fromKEFFareEUR.saga,
          vibe: r.vibe,
          why: buildWhy(r, vibe, months),
          bestMonths: r.bestMonths,
        })),
        legs: [],
        trip_shape: "round-trip",
      };

      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

export function makeHoldBookingTool(
  onResult?: (result: HoldBookingResult) => void,
) {
  return betaTool({
    name: "hold_booking",
    description:
      "Hold a specific Blue Lagoon itinerary for the traveller. Use this only after the traveller has picked a destination from search_flights. Returns a booking reference, schedule, and total in EUR. This is a demo hold — no payment is taken.",
    inputSchema: {
      type: "object",
      properties: {
        destination_iata: {
          type: "string",
          description: "The IATA code of the destination, e.g. LIS, TFS.",
        },
        depart_date: {
          type: "string",
          description: "Outbound date, ISO yyyy-mm-dd.",
        },
        return_date: {
          type: "string",
          description: "Return date, ISO yyyy-mm-dd.",
        },
        fare_class: {
          type: "string",
          enum: ["light", "standard", "flex", "saga"],
          description: "Fare class.",
        },
        travelers: {
          type: "number",
          description: "Number of travellers (≥ 1).",
        },
      },
      required: [
        "destination_iata",
        "depart_date",
        "return_date",
        "fare_class",
        "travelers",
      ],
    } as const,
    run: (args) => {
      const iata = (args.destination_iata as string).toUpperCase();
      const departDate = args.depart_date as string;
      const returnDate = args.return_date as string;
      const fareClass = args.fare_class as HoldBookingResult["fare_class"];
      const travelers = Math.max(1, (args.travelers as number) ?? 1);

      const route = NETWORK.find((r) => r.iata === iata);
      if (!route) {
        return JSON.stringify({
          error: `No Blue Lagoon route found for ${iata}.`,
        });
      }
      const fareRule = FARE_RULES.find((f) => f.id === fareClass);
      if (!fareRule) {
        return JSON.stringify({
          error: `Unknown fare class ${fareClass}.`,
        });
      }

      const base = route.fromKEFFareEUR.economy;
      const multiplier = FARE_MULTIPLIER[fareClass];
      const total = Math.round(base * multiplier * travelers);

      const result: HoldBookingResult = {
        booking_ref: genBookingRef(),
        destination: route.destination,
        destination_iata: route.iata,
        depart_date: departDate,
        return_date: returnDate,
        fare_class: fareClass,
        travelers,
        total_eur: total,
        message: `${route.destination} is held — we'll see you there.`,
      };

      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

function base64urlEncode(s: string): string {
  // Server runs on Node; Buffer is available. Fallback to btoa if not.
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
      "Save the traveller's trip idea so they can come back to it or share it. Call this proactively once the conversation has settled on a coherent plan (after search_flights and at least one of search_hotels / search_cars / search_packages). Returns a shareable URL path. The client persists the idea to localStorage.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description:
            "Short title for the trip idea, e.g. 'Reykjavík and south coast in mid-February'.",
        },
        summary: {
          type: "string",
          description:
            "One-line summary, ≤ 200 chars, plain language.",
        },
        legs: {
          type: "array",
          description:
            "The flight legs in sequence. Use IATA codes. Dates optional.",
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
          description: "Hotels added to the idea.",
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
          description: "Car rentals added to the idea.",
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
          description: "Blue Lagoon Holidays packages added to the idea.",
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
          description: "Optional total trip cost estimate in EUR.",
        },
        travelers: {
          type: "number",
          description: "Number of travellers. Defaults to 1.",
        },
        notes: {
          type: "string",
          description: "Optional free-text notes the traveller might want to remember.",
        },
      },
      required: ["title", "summary", "legs"],
    } as const,
    run: (args) => {
      const tripId = genTripIdeaId();
      const payload: SaveTripIdeaPayload = {
        id: tripId,
        title: (args.title as string) ?? "Trip idea",
        summary: ((args.summary as string) ?? "").slice(0, 220),
        legs: ((args.legs as SaveTripIdeaLeg[] | undefined) ?? []).map(
          (l) => ({
            origin: (l.origin ?? "").toUpperCase(),
            destination: l.destination ?? "",
            iata: (l.iata ?? l.destination ?? "").toUpperCase(),
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
