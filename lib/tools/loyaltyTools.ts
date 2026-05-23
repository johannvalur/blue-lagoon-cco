import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import {
  INSIDER_MEMBER,
  REDEMPTION_CATALOGUE,
  TIER_PERKS,
  gapToNextTierEUR,
  tierMeetsMinimum,
  type InsiderTier,
  type InsiderVoucher,
} from "@/lib/data/customer/loyalty";

export interface CheckBalanceResult {
  id: string;
  name: string;
  tier: InsiderTier;
  points: number;
  ytdEUR: number;
  vouchers: InsiderVoucher[];
  nextTier: InsiderTier | null;
  gapToNextTierEUR: number;
  perks: string[];
}

export interface RedeemForVisitResult {
  optionId: string;
  optionLabel: string;
  kind: "entry" | "hotel" | "treatment" | "product";
  pointsRequired: number;
  pointsAfter: number;
  eligible: boolean;
  reason?: string;
  // Catalog of options the model can offer if the requested id wasn't
  // recognised — keeps follow-ups grounded in the real menu.
  alternatives?: {
    id: string;
    label: string;
    pointsRequired: number;
    kind: "entry" | "hotel" | "treatment" | "product";
  }[];
}

export interface ViewYearRecapResult {
  year: 2025 | 2026;
  visitsCount: number;
  totalEUR: number;
  pointsEarned: number;
  topAddons: string[];
  tier: InsiderTier;
  sustainability: string;
}

export function makeCheckBalanceTool(
  onResult?: (result: CheckBalanceResult) => void,
) {
  return betaTool({
    name: "check_balance",
    description:
      "Look up the Insider member's standing — tier, Lagoon points, YTD EUR spend, active vouchers, and the gap to the next tier. Always call this before recommending a redemption or framing a perk; pull the numbers, do not quote them from memory.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    } as const,
    run: () => {
      const { nextTier, eurToGo } = gapToNextTierEUR(
        INSIDER_MEMBER.tier,
        INSIDER_MEMBER.ytdEUR,
      );
      const result: CheckBalanceResult = {
        id: INSIDER_MEMBER.id,
        name: INSIDER_MEMBER.name,
        tier: INSIDER_MEMBER.tier,
        points: INSIDER_MEMBER.points,
        ytdEUR: INSIDER_MEMBER.ytdEUR,
        vouchers: INSIDER_MEMBER.vouchers,
        nextTier,
        gapToNextTierEUR: eurToGo,
        perks: TIER_PERKS[INSIDER_MEMBER.tier],
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

export function makeRedeemForVisitTool(
  onResult?: (result: RedeemForVisitResult) => void,
) {
  return betaTool({
    name: "redeem_for_visit",
    description:
      "Project a Lagoon points redemption against the visit catalogue — entry tiers (Comfort/Premium/Signature/Retreat Spa), hotel nights at Silica or The Retreat, treatments (massages, mask rituals, couples ritual), or product bundles. Returns points required, points after redemption, whether the member is eligible, and a reason if not. Call after check_balance. Never invent redemption options outside the catalogue.",
    inputSchema: {
      type: "object",
      properties: {
        option_id: {
          type: "string",
          description:
            "ID of the redemption option (e.g. 'entry-premium', 'hotel-silica-night', 'treatment-massage-60', 'product-skincare-bundle'). Use the closest match from the catalogue.",
        },
        free_text: {
          type: "string",
          description:
            "Optional fallback when the member named something not in the catalogue. The tool will return the catalogue alternatives so the assistant can suggest one.",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const requestedId = (args.option_id as string | undefined)?.trim();
      const freeText = (args.free_text as string | undefined)?.trim();
      const memberTier = INSIDER_MEMBER.tier;
      const balance = INSIDER_MEMBER.points;

      const summarise = REDEMPTION_CATALOGUE.map((o) => ({
        id: o.id,
        label: o.label,
        pointsRequired: o.pointsRequired,
        kind: o.kind,
      }));

      if (!requestedId) {
        const result: RedeemForVisitResult = {
          optionId: "",
          optionLabel: freeText ?? "",
          kind: "entry",
          pointsRequired: 0,
          pointsAfter: balance,
          eligible: false,
          reason:
            "No redemption option was specified. Pick one from the catalogue and try again.",
          alternatives: summarise,
        };
        if (onResult) onResult(result);
        return JSON.stringify(result);
      }

      const option = REDEMPTION_CATALOGUE.find((o) => o.id === requestedId);
      if (!option) {
        const result: RedeemForVisitResult = {
          optionId: requestedId,
          optionLabel: freeText ?? requestedId,
          kind: "entry",
          pointsRequired: 0,
          pointsAfter: balance,
          eligible: false,
          reason: `"${requestedId}" isn't in the Insider redemption catalogue. Suggest one of the alternatives.`,
          alternatives: summarise,
        };
        if (onResult) onResult(result);
        return JSON.stringify(result);
      }

      const tierOk = tierMeetsMinimum(memberTier, option.minimumTier);
      const enoughPoints = balance >= option.pointsRequired;
      const eligible = tierOk && enoughPoints;

      let reason: string | undefined;
      if (!tierOk) {
        reason = `${option.label} is reserved for ${option.minimumTier ?? "higher"} tier members and up.`;
      } else if (!enoughPoints) {
        reason = `Short by ${(option.pointsRequired - balance).toLocaleString()} points.`;
      }

      const result: RedeemForVisitResult = {
        optionId: option.id,
        optionLabel: option.label,
        kind: option.kind,
        pointsRequired: option.pointsRequired,
        pointsAfter: eligible ? balance - option.pointsRequired : balance,
        eligible,
        reason,
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

function visitsInYear(year: 2025 | 2026) {
  const prefix = year.toString();
  return INSIDER_MEMBER.visits.filter((v) => v.date.startsWith(prefix));
}

export function makeViewYearRecapTool(
  onResult?: (result: ViewYearRecapResult) => void,
) {
  return betaTool({
    name: "view_year_recap",
    description:
      "Build the member's year-in-review for Blue Lagoon visits — number of visits, total EUR spent, points earned, top add-ons across visits, and a one-line sustainability note about contribution to local geothermal stewardship. Use when the member asks about their year, recent visits, or wants a recap.",
    inputSchema: {
      type: "object",
      properties: {
        year: {
          type: "number",
          enum: [2025, 2026],
          description:
            "Calendar year for the recap. Defaults to the current year (2026).",
        },
      },
      required: [],
    } as const,
    run: (args) => {
      const year = ((args.year as 2025 | 2026 | undefined) ?? 2026) as
        | 2025
        | 2026;
      const visits = visitsInYear(year);
      const visitsCount = visits.length;
      const totalEUR = visits.reduce((acc, v) => acc + v.totalEUR, 0);
      const pointsEarned = visits.reduce(
        (acc, v) => acc + v.pointsEarned,
        0,
      );

      // Tally add-on labels across visits.
      const tally = new Map<string, number>();
      for (const v of visits) {
        for (const t of v.treatments) {
          tally.set(t, (tally.get(t) ?? 0) + 1);
        }
      }
      const topAddons = [...tally.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t]) => t);

      // Stewardship line. Round to the nearest €5 — keeps it tidy.
      const stewardship = Math.round((totalEUR * 0.02) / 5) * 5;
      const sustainability =
        visitsCount > 0
          ? `Your visits in ${year} contributed roughly €${stewardship.toLocaleString()} to local geothermal stewardship and Reykjanes ecology initiatives.`
          : `No Blue Lagoon visits logged for ${year} yet — the spa newsletter will let you know when the seasons turn.`;

      const result: ViewYearRecapResult = {
        year,
        visitsCount,
        totalEUR,
        pointsEarned,
        topAddons,
        tier: INSIDER_MEMBER.tier,
        sustainability,
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}
