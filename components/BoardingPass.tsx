"use client";

import type { Trip } from "@/lib/state/trips";

interface BoardingPassProps {
  trip: Trip;
  passengerName: string;
}

// Deterministic arrival window from the trip ref — keeps it stable across
// renders. Maps the ref's hash onto an opening hour between 11:00 and 19:00
// in 30-minute slots. The canonical demo reservation BL2X4F8K is pinned at
// 15:00 (the disruption window).
function arrivalWindowFor(ref: string): string {
  if (ref === "BL2X4F8K") return "15:00";
  let h = 0;
  for (let i = 0; i < ref.length; i += 1) {
    h = (h * 31 + ref.charCodeAt(i)) >>> 0;
  }
  const slot = h % 17; // 17 half-hour slots between 11:00 and 19:00 inclusive
  const hour = 11 + Math.floor(slot / 2);
  const minutes = (slot % 2) * 30;
  const mm = minutes === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${mm}`;
}

// Map the trips-store FareClass (legacy airline-style labels) onto the
// spa entry tier shown on the pass.
function tierFor(fareClass: Trip["fareClass"]): string {
  switch (fareClass) {
    case "Light":
      return "Comfort";
    case "Standard":
      return "Premium";
    case "Flex":
      return "Signature";
    case "Saga":
      return "Retreat Spa";
    default:
      return "Premium";
  }
}

// Pre-computed QR-style block pattern — random-ish but stable, rendered as a
// grid of small squares instead of a real QR image. 12×12 = 144 cells.
const QR_CELLS: number[] = [
  1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1,
  0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0,
  1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1,
  0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0,
  1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0,
  1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
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

const LOCATION = {
  short: "Blue Lagoon",
  city: "Grindavík, Iceland",
};

export function BoardingPass({ trip, passengerName }: BoardingPassProps) {
  const arrivalWindow = arrivalWindowFor(trip.ref);
  const tier = tierFor(trip.fareClass);
  const date = formatLongDate(trip.depart);
  // Pinned canonical room for BL2X4F8K; otherwise leave blank — most tiers
  // don't include a hotel.
  const hotelRoom = trip.ref === "BL2X4F8K" ? "Silica 207" : "—";
  const kiosk = "Spa kiosk · main entrance";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="surface-card overflow-hidden rounded-3xl border-2 border-bluelagoon-line">
        {/* Header band — Blue Lagoon blue */}
        <div className="relative bg-bluelagoon-midnight px-6 py-5 text-bluelagoon-snow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-bluelagoon-snow/70">
                Blue Lagoon · arrival pass
              </p>
              <p className="mt-1 font-loft text-lg font-extrabold tracking-tight">
                {passengerName.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-bluelagoon-snow/70">
                Tier
              </p>
              <p className="font-loft text-2xl font-extrabold tracking-tight">
                {tier}
              </p>
            </div>
          </div>
          {/* Aurora accent line */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-bluelagoon-aurora via-bluelagoon-crisp to-bluelagoon-fiery" />
        </div>

        {/* Location + arrival window */}
        <div className="bg-bluelagoon-paper px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Destination
              </p>
              <p className="mt-1 font-loft text-3xl font-extrabold leading-none tracking-tight text-bluelagoon-midnight">
                {LOCATION.short}
              </p>
              <p className="mt-1 text-sm text-bluelagoon-ink">
                {LOCATION.city}
              </p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative w-full max-w-[200px]">
                <div className="h-px w-full bg-bluelagoon-line" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full bg-bluelagoon-paper px-2 text-bluelagoon-crisp">
                    <SpaIcon />
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Arrival window
              </p>
              <p className="mt-1 font-loft text-4xl font-extrabold leading-none tracking-tight text-bluelagoon-midnight">
                {arrivalWindow}
              </p>
              <p className="mt-1 text-sm text-bluelagoon-ink">local time</p>
            </div>
          </div>
        </div>

        {/* Detail strip */}
        <div className="grid grid-cols-2 gap-px border-y border-bluelagoon-line bg-bluelagoon-line sm:grid-cols-4">
          <DetailCell label="Date" value={date} />
          <DetailCell label="Tier" value={tier} />
          <DetailCell label="Hotel" value={hotelRoom} />
          <DetailCell label="Guests" value={trip.pax.toString()} mono />
        </div>
        <div className="grid grid-cols-2 gap-px border-b border-bluelagoon-line bg-bluelagoon-line sm:grid-cols-4">
          <DetailCell label="Check-in" value={kiosk} accent />
          <DetailCell
            label="Towel"
            value="Included"
            accent={tier !== "Comfort"}
          />
          <DetailCell label="Locker" value="Auto-assigned" />
          <DetailCell label="Robe" value={tier === "Comfort" ? "—" : "Yes"} />
        </div>

        {/* Stub: ref + QR */}
        <div className="relative bg-bluelagoon-cloud/70 px-6 py-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-bluelagoon-muted">
                Reservation
              </p>
              <p className="font-mono text-lg tracking-[0.3em] text-bluelagoon-midnight">
                {trip.ref}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-bluelagoon-muted">
                Loyalty
              </p>
              <p className="font-loft text-sm font-bold text-bluelagoon-midnight">
                Ambassador · 18,250 pts
              </p>
            </div>
          </div>

          <div
            className="mt-4 inline-grid grid-cols-12 gap-0 rounded-md bg-bluelagoon-snow p-2"
            aria-label="QR code"
            role="img"
          >
            {QR_CELLS.map((cell, i) => (
              <div
                key={i}
                className={`h-2.5 w-2.5 ${
                  cell === 1 ? "bg-bluelagoon-midnight" : "bg-bluelagoon-snow"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-widest text-bluelagoon-muted">
            Show this at the spa kiosk on arrival.
          </p>
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
            Demo arrival pass — please don't try to use it at the gate.
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

function SpaIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-bluelagoon-crisp"
    >
      {/* steaming pool — three curls of steam over a half-pool */}
      <path
        d="M3 17c2 1 4 1 6 0s4-1 6 0 4 1 6 0v3H3v-3z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M7 11c1-2 1-3 0-5M12 12c1-2 1-3 0-5M17 11c1-2 1-3 0-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
