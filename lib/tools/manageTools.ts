import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import type { EntryTier } from "@/lib/data/customer/tripScenario";

// Public types — consumed by the manage chat client + route.
export interface ChangeDatesResult {
  ref: string;
  new_date: string;
  new_arrival_window: string | null;
  change_fee_eur: number;
  status: "changed";
  note: string;
}

export interface CancelReservationResult {
  ref: string;
  refund_eur: number;
  voucher_eur: number;
  status: "cancelled";
  note: string;
}

// Per-tier change and refund rules. The brief defines these canonically:
//   Comfort + Premium: non-refundable, free changes ≥48h ahead, otherwise €25 change fee
//   Signature:         50% refundable ≥72h ahead, otherwise non-refundable; free changes anytime
//   Retreat Spa:       fully refundable ≥7 days, 50% refundable ≥48h; free changes anytime
//
// The demo doesn't know how far ahead we are — we assume "within the day"
// (i.e. inside any short window) for the visit-today scenario, but expose
// both the inside-window and well-ahead fees/refunds for the model to pick
// from.
interface TierRule {
  changeFeeInside: number; // inside short window (<48h or <72h)
  changeFeeAhead: number; // well ahead
  refundPctAhead: number; // 0–100, refund % if well ahead
  refundPctInside: number; // refund % inside short window
  voucherPctIfNonRefundable: number; // care-led goodwill when 0% refund
}

const TIER_RULES: Record<EntryTier, TierRule> = {
  Comfort: {
    changeFeeInside: 25,
    changeFeeAhead: 0,
    refundPctAhead: 0,
    refundPctInside: 0,
    voucherPctIfNonRefundable: 50,
  },
  Premium: {
    changeFeeInside: 25,
    changeFeeAhead: 0,
    refundPctAhead: 0,
    refundPctInside: 0,
    voucherPctIfNonRefundable: 50,
  },
  Signature: {
    changeFeeInside: 0,
    changeFeeAhead: 0,
    refundPctAhead: 50,
    refundPctInside: 0,
    voucherPctIfNonRefundable: 60,
  },
  "Retreat Spa": {
    changeFeeInside: 0,
    changeFeeAhead: 0,
    refundPctAhead: 100,
    refundPctInside: 50,
    voucherPctIfNonRefundable: 75,
  },
};

// Allow the route to inject context about the reservation we're managing so
// the model doesn't have to repeat tier / totals on every call.
export interface ManageContext {
  ref: string;
  tier: EntryTier;
  totalEUR: number;
  // Loose hint for the model — "today" / "this-week" / "next-month". The
  // tool functions interpret this to pick the inside-window or well-ahead
  // schedule.
  proximity?: "today" | "soon" | "ahead";
}

function isInsideShortWindow(proximity: ManageContext["proximity"]): boolean {
  // Treat "today" and "soon" as inside any short refund/change window.
  return proximity !== "ahead";
}

export function makeChangeDatesTool(
  ctx: ManageContext,
  onResult?: (result: ChangeDatesResult) => void,
) {
  return betaTool({
    name: "change_dates",
    description:
      "Move the date — and optionally the arrival window — of an existing held Blue Lagoon reservation. The change fee depends on the reservation's tier and how close we are to the visit (Comfort/Premium: €25 inside 48h, free otherwise; Signature/Retreat: free changes anytime). Use this once the guest confirms the new date and (optionally) arrival window.",
    inputSchema: {
      type: "object",
      properties: {
        ref: {
          type: "string",
          description:
            "Reservation reference, e.g. BL2X4F8K. Must match the reservation on file.",
        },
        new_date: {
          type: "string",
          description:
            "New visit date, ISO yyyy-mm-dd. Or the literal 'tomorrow' for the demo's reschedule case.",
        },
        new_arrival_window: {
          type: "string",
          description:
            "Optional. New arrival window in local 24h, e.g. '13:00' or '19:00'. Pass empty string to keep the existing window.",
        },
      },
      required: ["ref", "new_date"],
    } as const,
    run: (args) => {
      const ref = (args.ref as string) || ctx.ref;
      const newDate = args.new_date as string;
      const rawWindow = args.new_arrival_window as string | undefined;
      const newWindow = rawWindow && rawWindow.length > 0 ? rawWindow : null;

      const rule = TIER_RULES[ctx.tier];
      const inside = isInsideShortWindow(ctx.proximity);
      const fee = inside ? rule.changeFeeInside : rule.changeFeeAhead;

      const note =
        fee === 0
          ? `No change fee — ${ctx.tier} reservations include free changes${ctx.tier === "Comfort" || ctx.tier === "Premium" ? " when made 48h ahead" : " anytime"}.`
          : `€${fee} change fee applies — ${ctx.tier} changes inside 48 hours of the visit carry a €${fee} fee.`;

      const result: ChangeDatesResult = {
        ref,
        new_date: newDate,
        new_arrival_window: newWindow,
        change_fee_eur: fee,
        status: "changed",
        note,
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

export function makeCancelReservationTool(
  ctx: ManageContext,
  onResult?: (result: CancelReservationResult) => void,
) {
  return betaTool({
    name: "cancel_reservation",
    description:
      "Cancel a held Blue Lagoon reservation. Refund depends on tier and timing: Comfort & Premium are non-refundable (we offer a 50% goodwill voucher for future use), Signature is 50% refundable if cancelled ≥72h ahead, Retreat Spa is fully refundable ≥7 days or 50% refundable ≥48h. Always confirm with the guest before calling — cancellation can't be undone in this demo.",
    inputSchema: {
      type: "object",
      properties: {
        ref: {
          type: "string",
          description: "Reservation reference, e.g. BL2X4F8K.",
        },
        reason: {
          type: "string",
          description:
            "Optional. Why the guest is cancelling — used for the cancellation note only.",
        },
      },
      required: ["ref"],
    } as const,
    run: (args) => {
      const ref = (args.ref as string) || ctx.ref;
      const reason = (args.reason as string | undefined) ?? "";

      const rule = TIER_RULES[ctx.tier];
      const inside = isInsideShortWindow(ctx.proximity);
      const refundPct = inside ? rule.refundPctInside : rule.refundPctAhead;
      const refund = Math.round((ctx.totalEUR * refundPct) / 100);
      const voucher =
        refund === 0
          ? Math.round((ctx.totalEUR * rule.voucherPctIfNonRefundable) / 100)
          : 0;

      let note: string;
      if (refund === ctx.totalEUR) {
        note = `Full refund of €${ctx.totalEUR} to original payment method (2–3 business days).`;
      } else if (refund > 0) {
        note = `${refundPct}% refund of €${refund} to original payment method (2–3 business days).`;
      } else {
        note = `${ctx.tier} is non-refundable inside this window. As a goodwill gesture we'll issue a €${voucher} voucher, valid for 12 months at Blue Lagoon.${reason ? ` Reason logged: ${reason}.` : ""}`;
      }

      const result: CancelReservationResult = {
        ref,
        refund_eur: refund,
        voucher_eur: voucher,
        status: "cancelled",
        note,
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}
