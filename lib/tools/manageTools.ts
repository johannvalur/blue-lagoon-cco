import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { FARE_RULES } from "@/lib/data/customer/fares";

// Public types — consumed by the manage chat client + route.
export interface ChangeDatesResult {
  ref: string;
  new_depart: string;
  new_return: string | null;
  change_fee_eur: number;
  status: "changed";
}

export interface CancelBookingResult {
  ref: string;
  refund_eur: number;
  status: "cancelled";
}

// Allow the route to inject context about the trip we're managing so the
// model doesn't have to repeat fareClass / totals on every call.
export interface ManageContext {
  ref: string;
  fareClass: "light" | "standard" | "flex" | "saga";
  totalEUR: number;
}

export function makeChangeDatesTool(
  ctx: ManageContext,
  onResult?: (result: ChangeDatesResult) => void,
) {
  return betaTool({
    name: "change_dates",
    description:
      "Change the depart and/or return date on an existing held booking. The change fee comes from the trip's fare class (FARE_RULES). Use this once the traveller confirms the new dates. Returns the new schedule and the fee in EUR.",
    inputSchema: {
      type: "object",
      properties: {
        ref: {
          type: "string",
          description:
            "Booking reference, e.g. IC4K7M2N. Must match the trip on file.",
        },
        new_depart: {
          type: "string",
          description: "New outbound date, ISO yyyy-mm-dd.",
        },
        new_return: {
          type: "string",
          description:
            "New return date, ISO yyyy-mm-dd. Pass empty string for one-way.",
        },
      },
      required: ["ref", "new_depart"],
    } as const,
    run: (args) => {
      const ref = (args.ref as string) || ctx.ref;
      const newDepart = args.new_depart as string;
      const rawReturn = args.new_return as string | undefined;
      const newReturn = rawReturn && rawReturn.length > 0 ? rawReturn : null;

      const fareRule = FARE_RULES.find((f) => f.id === ctx.fareClass);
      const fee = fareRule ? fareRule.changeFee : 0;

      const result: ChangeDatesResult = {
        ref,
        new_depart: newDepart,
        new_return: newReturn,
        change_fee_eur: fee,
        status: "changed",
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}

export function makeCancelBookingTool(
  ctx: ManageContext,
  onResult?: (result: CancelBookingResult) => void,
) {
  return betaTool({
    name: "cancel_booking",
    description:
      "Cancel a held booking. If the trip's fare is non-refundable, refund_eur is 0. Always confirm with the traveller before calling this — cancellation can't be undone in this demo.",
    inputSchema: {
      type: "object",
      properties: {
        ref: {
          type: "string",
          description: "Booking reference, e.g. IC4K7M2N.",
        },
      },
      required: ["ref"],
    } as const,
    run: (args) => {
      const ref = (args.ref as string) || ctx.ref;
      const fareRule = FARE_RULES.find((f) => f.id === ctx.fareClass);
      const refundable = fareRule ? fareRule.refundable : false;
      const refund = refundable ? ctx.totalEUR : 0;

      const result: CancelBookingResult = {
        ref,
        refund_eur: refund,
        status: "cancelled",
      };
      if (onResult) onResult(result);
      return JSON.stringify(result);
    },
  });
}
