"use client";

import type {
  SearchFlightsResult,
  FlightLeg,
} from "@/lib/tools/bookingTools";
import {
  BookingResults,
  BookingConfirmation,
} from "@/components/BookingResults";

// Re-export the discovery grid so trip surfaces have a single import path.
export { BookingResults as FlightDiscoveryResults, BookingConfirmation };

interface FlightLegListProps {
  result: SearchFlightsResult;
}

const SHAPE_LABEL: Record<string, string> = {
  "round-trip": "Round trip",
  "one-way": "One way",
  "multi-city": "Multi-city",
  "stopover-bridge": "Stopover bridge",
};

export function FlightLegList({ result }: FlightLegListProps) {
  if (!result.legs || result.legs.length === 0) {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
        No legs returned. Try restating the route.
      </div>
    );
  }
  const total = result.legs.reduce((sum, l) => sum + l.fareEUR, 0);
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        {SHAPE_LABEL[result.trip_shape] ?? "Routing"} ·{" "}
        {result.query_summary}
      </p>
      <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-bright p-5">
        <ol className="flex flex-col gap-3">
          {result.legs.map((leg, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-bluelagoon-midnight font-loft text-xs font-bold text-bluelagoon-snow">
                {idx + 1}
              </div>
              <LegLine leg={leg} />
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-end justify-between border-t border-bluelagoon-line pt-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            Indicative total per person
          </p>
          <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            €{total}
          </p>
        </div>
      </div>
    </div>
  );
}

function LegLine({ leg }: { leg: FlightLeg }) {
  return (
    <div className="flex flex-1 flex-col gap-0.5">
      <div className="flex items-baseline gap-2">
        <span className="font-loft text-base font-bold text-bluelagoon-midnight">
          {leg.origin}
        </span>
        <span className="text-bluelagoon-muted">→</span>
        <span className="font-loft text-base font-bold text-bluelagoon-midnight">
          {leg.iata}
        </span>
        <span className="text-sm text-bluelagoon-ink">{leg.destination}</span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-bluelagoon-muted">
        <span>{leg.flightTimeHrs}h direct</span>
        <span>·</span>
        <span>from €{leg.fareEUR}</span>
        {leg.note ? (
          <>
            <span>·</span>
            <span>{leg.note}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
