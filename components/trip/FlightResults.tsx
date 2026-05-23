"use client";

// Concept: this file used to render flight discovery + leg lists. It now
// renders entry-tier discovery and a (rarely-used) "plan steps" list for
// multi-part visit plans. The filename is kept stable so other agents'
// imports don't break.

import type { SearchExperiencesResult } from "@/lib/tools/bookingTools";
import {
  BookingResults,
  BookingConfirmation,
} from "@/components/BookingResults";

// Re-export the discovery grid so trip surfaces have a single import path.
export {
  BookingResults as FlightDiscoveryResults,
  BookingConfirmation,
};

interface FlightLegListProps {
  // Kept for back-compat with callers that pass SearchFlightsResult shaped
  // payloads. The new tool doesn't return legs, but we render the add-ons
  // suggested by search_experiences as a "what fits with this" strip.
  result: SearchExperiencesResult;
}

const CATEGORY_LABEL: Record<string, string> = {
  treatment: "Treatment",
  dining: "Dining",
  product: "Skincare",
  upgrade: "Upgrade",
};

export function FlightLegList({ result }: FlightLegListProps) {
  if (!result.addons || result.addons.length === 0) {
    return null;
  }
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        Suggested add-ons · {result.query_summary}
      </p>
      <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-bright p-5">
        <ol className="flex flex-col gap-3">
          {result.addons.map((a, idx) => (
            <li key={a.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-bluelagoon-midnight font-loft text-xs font-bold text-bluelagoon-snow">
                {idx + 1}
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-loft text-base font-bold text-bluelagoon-midnight">
                    {a.name}
                  </span>
                  <span className="text-xs text-bluelagoon-muted">
                    {CATEGORY_LABEL[a.category] ?? a.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-bluelagoon-muted">
                  <span>€{a.priceEUR}</span>
                  {a.durationMin ? (
                    <>
                      <span>·</span>
                      <span>{a.durationMin} min</span>
                    </>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-bluelagoon-ink">{a.whyShort}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
