"use client";

import type {
  SearchExperiencesResult,
  HoldReservationResult,
} from "@/lib/tools/bookingTools";

// Older legacy names — kept so existing imports resolve.
type SearchFlightsResult = SearchExperiencesResult;
type HoldBookingResult = HoldReservationResult;

interface BookingResultsProps {
  result: SearchFlightsResult;
  onHold: (option: { tierId: string; name: string }, tier: string) => void;
}

const TIER_LABEL: Record<string, string> = {
  comfort: "Comfort",
  premium: "Premium",
  signature: "Signature",
  "retreat-spa": "Retreat Spa",
};

export function BookingResults({ result, onHold }: BookingResultsProps) {
  if (!result.tiers || result.tiers.length === 0) {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
        No matching entry tiers. Try loosening the brief.
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        {result.query_summary}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {result.tiers.map((opt, idx) => (
          <div
            key={opt.tierId}
            className="surface-card flex flex-col rounded-2xl border-l-4 border-l-bluelagoon-crisp p-5"
            data-demo-card={idx === 0 ? "first" : undefined}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Entry tier
            </p>
            <div className="font-loft text-xl font-bold text-bluelagoon-midnight">
              {opt.name}
            </div>
            <div className="mt-3">
              <div className="font-loft text-2xl font-bold text-bluelagoon-midnight">
                €{opt.priceEUR}
              </div>
              <div className="text-xs text-bluelagoon-muted">
                per guest · {TIER_LABEL[opt.tierId] ?? opt.tierId}
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-bluelagoon-ink">
              {opt.inclusions.slice(0, 5).map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-bluelagoon-crisp"
                    aria-hidden="true"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 line-clamp-3 text-sm leading-snug text-bluelagoon-ink">
              {opt.why}
            </p>
            <div className="mt-4">
              <button
                onClick={() => onHold({ tierId: opt.tierId, name: opt.name }, opt.tierId)}
                data-demo-hold={idx === 0 ? "first" : undefined}
                className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Hold this
              </button>
            </div>
          </div>
        ))}
      </div>
      {result.note ? (
        <p className="mt-3 text-xs italic text-bluelagoon-muted">{result.note}</p>
      ) : null}
    </div>
  );
}

interface BookingConfirmationProps {
  result: HoldBookingResult;
}

export function BookingConfirmation({ result }: BookingConfirmationProps) {
  const addonsTotal = result.addons.reduce(
    (s, a) => s + a.priceEUR * result.guests,
    0,
  );
  return (
    <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-volcanic p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-volcanic">
        Reservation held
      </p>
      <div className="mt-1 font-loft text-xl font-bold text-bluelagoon-midnight">
        {result.tier_name}{" "}
        <span className="text-sm font-normal text-bluelagoon-muted">
          entry
        </span>
      </div>
      <div className="mt-2 font-mono text-sm tracking-widest text-bluelagoon-ink">
        {result.reservation_ref}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-bluelagoon-ink">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Arrival
          </p>
          <p>
            {result.date} · {result.arrival_time}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Guests
          </p>
          <p>{result.guests}</p>
        </div>
        {result.hotel_name ? (
          <div className="col-span-2">
            <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
              Stay
            </p>
            <p>
              {result.hotel_name} · {result.nights} night
              {result.nights === 1 ? "" : "s"}
            </p>
          </div>
        ) : null}
      </div>
      {result.addons.length > 0 ? (
        <div className="mt-3">
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Add-ons
          </p>
          <ul className="mt-1 space-y-0.5 text-sm text-bluelagoon-ink">
            {result.addons.map((a) => (
              <li key={a.id} className="flex justify-between">
                <span>{a.name}</span>
                <span className="text-bluelagoon-muted">€{a.priceEUR}</span>
              </li>
            ))}
          </ul>
          {addonsTotal > 0 ? (
            <p className="mt-1 text-xs text-bluelagoon-muted">
              Add-ons subtotal: €{addonsTotal} (×{result.guests} guest
              {result.guests === 1 ? "" : "s"})
            </p>
          ) : null}
        </div>
      ) : null}
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
