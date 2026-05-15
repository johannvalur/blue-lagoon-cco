import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import {
  SAGA_MEMBER,
  REDEMPTION_RATES_PTS,
  milesForLeg,
  nextTierGap,
  type SagaVoucher,
  type SagaTier,
} from "@/lib/data/customer/loyalty";

export interface CheckBalanceResult {
  id: string;
  name: string;
  tier: SagaTier;
  points: number;
  ytdSpendEUR: number;
  vouchers: SagaVoucher[];
  ptsToNextTier: number;
}

export interface RedeemForFlightResult {
  destination_iata: string;
  points_required: number;
  points_after: number;
  has_enough: boolean;
  suggested_date: string;
  voucher_eligible: boolean;
  reason?: string;
}

export interface ViewYearRecapResult {
  year: 2025 | 2026;
  trips: number;
  miles_flown: number;
  top_destinations: string[];
  sustainability: string;
}

// Roughly the EUR spend a Gold-tier traveller needs to redeem points
// equivalents — used to project tier-credit progress on the side.
const POINTS_PER_EUR = 16; // 16 pts ≈ €1 of YTD spend, very loose

function ptsToNextTierFor(member: typeof SAGA_MEMBER): number {
  const { eurToGo } = nextTierGap(member.tier as SagaTier, member.ytdSpendEUR);
  return Math.round(eurToGo * POINTS_PER_EUR);
}

export function makeCheckBalanceTool(
  onResult?: (result: CheckBalanceResult) => void,
) {
  return betaTool({
    name: "check_balance",
    description:
      "Look up the Saga Club member's current standing — tier, points balance, YTD spend in EUR, active vouchers, and how many points away they are from the next tier. Always call this before recommending a redemption or framing a perk.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    } as const,
    run: () => {
      const result: CheckBalanceResult = {
        id: SAGA_MEMBER.id,
        name: SAGA_MEMBER.name,
        tier: SAGA_MEMBER.tier as SagaTier,
        points: SAGA_MEMBER.points,
        ytdSpendEUR: SAGA_MEMBER.ytdSpendEUR,
        vouchers: SAGA_MEMBER.vouchers,
        ptsToNextTier: ptsToNextTierFor(SAGA_MEMBER),
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

function pickSuggestedDate(window?: { start?: string; end?: string }): string {
  // Prefer the window start if it parses; otherwise pick a date roughly
  // 6 weeks out so the answer feels concrete.
  const start = window?.start;
  if (start && /^\d{4}-\d{2}-\d{2}$/.test(start)) return start;
  const d = new Date();
  d.setDate(d.getDate() + 42);
  return d.toISOString().slice(0, 10);
}

export function makeRedeemForFlightTool(
  onResult?: (result: RedeemForFlightResult) => void,
) {
  return betaTool({
    name: "redeem_for_flight",
    description:
      "Project a points redemption for a one-way Blue Lagoon flight from KEF to a chosen IATA destination. Returns the points required, the balance after redemption, whether the member has enough, and whether a partner voucher might stack. Call this after check_balance.",
    inputSchema: {
      type: "object",
      properties: {
        destination_iata: {
          type: "string",
          description:
            "Destination IATA code (e.g. BOS, LIS). Required to compute the redemption rate.",
        },
        depart_window: {
          type: "object",
          description: "Preferred departure window for the redemption.",
          properties: {
            start: {
              type: "string",
              description: "Earliest acceptable departure (ISO yyyy-mm-dd).",
            },
            end: {
              type: "string",
              description: "Latest acceptable departure (ISO yyyy-mm-dd).",
            },
          },
          required: [],
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const rawIata = args.destination_iata as string | undefined;
      const window = args.depart_window as
        | { start?: string; end?: string }
        | undefined;

      if (!rawIata) {
        const result: RedeemForFlightResult = {
          destination_iata: "",
          points_required: 0,
          points_after: SAGA_MEMBER.points,
          has_enough: false,
          suggested_date: pickSuggestedDate(window),
          voucher_eligible: false,
          reason:
            "No destination IATA was supplied — ask the member where they'd like to fly.",
        };
        if (onResult) onResult(result);
        return JSON.stringify(result);
      }

      const iata = rawIata.toUpperCase();
      const required = REDEMPTION_RATES_PTS[iata];

      if (required === undefined) {
        const result: RedeemForFlightResult = {
          destination_iata: iata,
          points_required: 0,
          points_after: SAGA_MEMBER.points,
          has_enough: false,
          suggested_date: pickSuggestedDate(window),
          voucher_eligible: false,
          reason: `${iata} isn't on the Blue Lagoon network with a published redemption rate.`,
        };
        if (onResult) onResult(result);
        return JSON.stringify(result);
      }

      const hasEnough = SAGA_MEMBER.points >= required;
      const result: RedeemForFlightResult = {
        destination_iata: iata,
        points_required: required,
        points_after: hasEnough ? SAGA_MEMBER.points - required : SAGA_MEMBER.points,
        has_enough: hasEnough,
        suggested_date: pickSuggestedDate(window),
        // Blue Lagoon voucher is KEF-side, but pretend it stacks on Iceland-bound
        // legs for the demo. For most outbound redemptions, no.
        voucher_eligible: iata === "KEF",
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

function inferYear(history: typeof SAGA_MEMBER.history, year: 2025 | 2026) {
  const yr = year.toString();
  return history.filter((h) => h.date.startsWith(yr));
}

export function makeViewYearRecapTool(
  onResult?: (result: ViewYearRecapResult) => void,
) {
  return betaTool({
    name: "view_year_recap",
    description:
      "Generate the member's year-in-review: total trips, miles flown, top destinations, and a one-line sustainability note. Use when the member asks about their travel year, recap, or how much they flew.",
    inputSchema: {
      type: "object",
      properties: {
        year: {
          type: "number",
          enum: [2025, 2026],
          description: "Calendar year for the recap. Defaults to the current year (2026).",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const year = ((args.year as 2025 | 2026 | undefined) ?? 2026) as 2025 | 2026;
      const trips = inferYear(SAGA_MEMBER.history, year);
      // Round-trips count once for a more honest "trips" number; we treat
      // each KEF→X leg as half a trip and floor it.
      const tripCount = Math.max(1, Math.ceil(trips.length / 2));
      const miles = trips.reduce(
        (acc, t) => acc + milesForLeg(t.from, t.to),
        0,
      );
      const dests = new Map<string, number>();
      for (const t of trips) {
        const dest = t.to === "KEF" ? t.from : t.to;
        dests.set(dest, (dests.get(dest) ?? 0) + 1);
      }
      const top = [...dests.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([d]) => d);

      const sustainability =
        miles > 0
          ? `${tripCount} ${tripCount === 1 ? "round-trip" : "round-trips"} on direct routes — roughly ${(miles * 0.18).toFixed(0)} kg CO₂e per passenger across the year, lower than connecting itineraries to the same cities.`
          : `No flights logged for ${year} yet.`;

      const result: ViewYearRecapResult = {
        year,
        trips: tripCount,
        miles_flown: miles,
        top_destinations: top,
        sustainability,
      };

      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}
