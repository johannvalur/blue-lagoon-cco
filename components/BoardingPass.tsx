"use client";

import type { Trip } from "@/lib/state/trips";

interface BoardingPassProps {
  trip: Trip;
  passengerName: string;
}

// Deterministic flight number from the destination IATA — keeps it stable
// across renders and gives every IATA a unique-looking FI number.
function flightNumberFor(iata: string): string {
  // Hard-coded for the marquee long-haul gateways for nicer optics.
  const tweaked: Record<string, string> = {
    JFK: "FI615",
    BOS: "FI631",
    SEA: "FI681",
    DEN: "FI671",
    YYZ: "FI603",
    LIS: "FI540",
    MAD: "FI530",
    BCN: "FI542",
    TFS: "FI572",
    CDG: "FI542",
    LHR: "FI452",
    BER: "FI520",
    AMS: "FI500",
    CPH: "FI206",
    AEY: "FI121",
    KEF: "FI001",
  };
  if (tweaked[iata]) return tweaked[iata];
  let h = 0;
  for (let i = 0; i < iata.length; i += 1) {
    h = (h * 31 + iata.charCodeAt(i)) >>> 0;
  }
  return `FI${(100 + (h % 800)).toString()}`;
}

// Boarding time = 35 minutes before scheduled departure. Departure time is
// pinned per-route for visual consistency in the demo.
function scheduleFor(iata: string): { boarding: string; departure: string } {
  const tweaked: Record<string, { boarding: string; departure: string }> = {
    JFK: { boarding: "16:25", departure: "17:00" },
    BOS: { boarding: "16:55", departure: "17:30" },
    SEA: { boarding: "16:05", departure: "16:40" },
    DEN: { boarding: "16:35", departure: "17:10" },
    YYZ: { boarding: "16:45", departure: "17:20" },
    LIS: { boarding: "07:55", departure: "08:30" },
    MAD: { boarding: "07:25", departure: "08:00" },
    BCN: { boarding: "07:15", departure: "07:50" },
    TFS: { boarding: "06:55", departure: "07:30" },
    CDG: { boarding: "07:35", departure: "08:10" },
    LHR: { boarding: "07:45", departure: "08:20" },
    BER: { boarding: "07:55", departure: "08:30" },
    AMS: { boarding: "07:25", departure: "08:00" },
    CPH: { boarding: "07:15", departure: "07:50" },
    AEY: { boarding: "08:25", departure: "09:00" },
  };
  return tweaked[iata] ?? { boarding: "08:25", departure: "09:00" };
}

// Origin city is always Reykjavík for a KEF-based demo.
const ORIGIN = { iata: "KEF", city: "Reykjavík" };

// Pre-computed barcode bar widths — random-ish but stable, rendered as a
// row of <div>s instead of a real barcode image.
const BARCODE_BARS: number[] = [
  3, 1, 2, 4, 1, 3, 2, 1, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 5, 1, 3,
  2, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 5, 2, 1, 3, 2, 1, 4, 3, 1, 2,
  3, 1, 4, 2, 1, 3, 2, 5, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2,
];

function formatLongDate(iso: string): string {
  // "2026-05-12" -> "Tue, 12 May 2026"
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  const weekday = d.toLocaleDateString("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  });
  const day = d.getUTCDate();
  const month = d.toLocaleDateString("en-GB", {
    month: "short",
    timeZone: "UTC",
  });
  const year = d.getUTCFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

export function BoardingPass({ trip, passengerName }: BoardingPassProps) {
  const flightNo = flightNumberFor(trip.dest.iata);
  const { boarding, departure } = scheduleFor(trip.dest.iata);
  const date = formatLongDate(trip.depart);
  const seat = "14A";
  const gate = "D7";
  const zone = "B";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="surface-card overflow-hidden rounded-3xl border-2 border-bluelagoon-line">
        {/* Header band — Blue Lagoon blue */}
        <div className="relative bg-bluelagoon-midnight px-6 py-5 text-bluelagoon-snow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-bluelagoon-snow/70">
                Blue Lagoon · boarding pass
              </p>
              <p className="mt-1 font-loft text-lg font-extrabold tracking-tight">
                {passengerName.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-bluelagoon-snow/70">
                Flight
              </p>
              <p className="font-loft text-2xl font-extrabold tracking-tight">
                {flightNo}
              </p>
            </div>
          </div>
          {/* Aurora accent line */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-bluelagoon-aurora via-bluelagoon-crisp to-bluelagoon-fiery" />
        </div>

        {/* Route — big city codes */}
        <div className="bg-bluelagoon-paper px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                From
              </p>
              <p className="mt-1 font-loft text-4xl font-extrabold leading-none tracking-tight text-bluelagoon-midnight">
                {ORIGIN.iata}
              </p>
              <p className="mt-1 text-sm text-bluelagoon-ink">{ORIGIN.city}</p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative w-full max-w-[200px]">
                <div className="h-px w-full bg-bluelagoon-line" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full bg-bluelagoon-paper px-2 text-bluelagoon-crisp">
                    <PlaneIcon />
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                To
              </p>
              <p className="mt-1 font-loft text-4xl font-extrabold leading-none tracking-tight text-bluelagoon-midnight">
                {trip.dest.iata}
              </p>
              <p className="mt-1 text-sm text-bluelagoon-ink">
                {trip.dest.city}
              </p>
            </div>
          </div>
        </div>

        {/* Detail strip */}
        <div className="grid grid-cols-2 gap-px border-y border-bluelagoon-line bg-bluelagoon-line sm:grid-cols-4">
          <DetailCell label="Date" value={date} />
          <DetailCell label="Departure" value={departure} mono />
          <DetailCell label="Boarding" value={boarding} mono />
          <DetailCell label="Class" value={trip.fareClass} />
        </div>
        <div className="grid grid-cols-2 gap-px border-b border-bluelagoon-line bg-bluelagoon-line sm:grid-cols-4">
          <DetailCell label="Gate" value={gate} mono accent />
          <DetailCell label="Seat" value={seat} mono accent />
          <DetailCell label="Zone" value={zone} mono />
          <DetailCell label="Bag drop" value="Closes 09:30" />
        </div>

        {/* Stub: ref + barcode */}
        <div className="relative bg-bluelagoon-cloud/70 px-6 py-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-bluelagoon-muted">
                Booking ref
              </p>
              <p className="font-mono text-lg tracking-[0.3em] text-bluelagoon-midnight">
                {trip.ref}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-bluelagoon-muted">
                Saga Club
              </p>
              <p className="font-loft text-sm font-bold text-bluelagoon-midnight">
                Silver · 12,480 pts
              </p>
            </div>
          </div>

          <div
            className="mt-4 flex h-14 items-center gap-px rounded-md bg-bluelagoon-snow px-2"
            aria-label="Barcode"
            role="img"
          >
            {BARCODE_BARS.map((w, i) => (
              <div
                key={i}
                style={{ width: `${w}px` }}
                className="h-full bg-bluelagoon-midnight"
              />
            ))}
          </div>
        </div>

        {/* Tear-line footer */}
        <div className="relative h-3 bg-bluelagoon-paper">
          <div className="absolute inset-0 flex">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-dashed border-bluelagoon-line/70"
              />
            ))}
          </div>
        </div>

        <div className="bg-bluelagoon-paper px-6 pb-6 pt-3 text-center">
          <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Demo boarding pass — please don't try to use it at the airport.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailCell({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="bg-bluelagoon-paper px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bluelagoon-muted">
        {label}
      </p>
      <p
        className={`mt-1 ${mono ? "font-mono" : "font-loft"} ${accent ? "font-extrabold text-bluelagoon-fiery" : "font-bold text-bluelagoon-midnight"} text-base`}
      >
        {value}
      </p>
    </div>
  );
}

function PlaneIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-bluelagoon-crisp"
    >
      <path
        d="M2 13l9-3 6-7 2 1-3 8 5 1 2 2-7 2-2 5-2 1-1-5-7-2-2-3z"
        fill="currentColor"
      />
    </svg>
  );
}
