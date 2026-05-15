"use client";

import type {
  SearchFlightsResult,
  HoldBookingResult,
} from "@/lib/tools/bookingTools";

type FareClass = "light" | "standard" | "flex" | "saga";

interface BookingResultsProps {
  result: SearchFlightsResult;
  onHold: (
    option: SearchFlightsResult["options"][number],
    fareClass: FareClass,
  ) => void;
}

export function BookingResults({ result, onHold }: BookingResultsProps) {
  if (!result.options || result.options.length === 0) {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
        No matching destinations found. Try loosening the brief.
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted mb-3">
        {result.query_summary}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {result.options.map((opt, idx) => (
          <div
            key={opt.iata}
            className="surface-card rounded-2xl p-5 border-l-4 border-l-bluelagoon-crisp flex flex-col"
            data-demo-card={idx === 0 ? "first" : undefined}
          >
            <div className="font-loft text-xl font-bold text-bluelagoon-midnight">
              {opt.destination}
            </div>
            <div className="text-xs text-bluelagoon-muted mt-0.5">
              {opt.iata} · {opt.country}
            </div>
            <div className="text-xs text-bluelagoon-muted mt-1">
              From KEF · {opt.flightTimeHrs}h direct
            </div>
            <div className="mt-3">
              <div className="font-loft text-2xl font-bold text-bluelagoon-midnight">
                from €{opt.fareEUR}
              </div>
              <div className="text-xs text-bluelagoon-muted">
                or €{opt.sagaFareEUR} Saga
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {opt.vibe.slice(0, 4).map((v) => (
                <span
                  key={v}
                  className="rounded-full bg-bluelagoon-mist/60 px-2 py-0.5 text-[11px] text-bluelagoon-ink"
                >
                  {v}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm leading-snug text-bluelagoon-ink line-clamp-3">
              {opt.why}
            </p>
            <div className="mt-4">
              <button
                onClick={() => onHold(opt, "standard")}
                data-demo-hold={idx === 0 ? "first" : undefined}
                className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Hold this
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BookingConfirmationProps {
  result: HoldBookingResult;
}

export function BookingConfirmation({ result }: BookingConfirmationProps) {
  return (
    <div className="surface-card rounded-2xl p-5 border-l-4 border-l-bluelagoon-volcanic">
      <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-volcanic">
        Held
      </p>
      <div className="mt-1 font-loft text-xl font-bold text-bluelagoon-midnight">
        {result.destination}{" "}
        <span className="text-bluelagoon-muted text-sm font-normal">
          {result.destination_iata}
        </span>
      </div>
      <div className="mt-2 font-mono text-sm tracking-widest text-bluelagoon-ink">
        {result.booking_ref}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-bluelagoon-ink">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Schedule
          </p>
          <p>
            {result.depart_date} → {result.return_date}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Travellers · fare
          </p>
          <p>
            {result.travelers} · {result.fare_class}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
          Total
        </p>
        <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
          €{result.total_eur}
        </p>
      </div>
      <p className="mt-3 text-sm text-bluelagoon-ink">{result.message}</p>
      <p className="mt-3 text-xs text-bluelagoon-muted">
        Demo hold — no payment was taken.
      </p>
    </div>
  );
}
