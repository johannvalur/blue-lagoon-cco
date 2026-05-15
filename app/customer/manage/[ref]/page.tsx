"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ManageChat } from "@/components/ManageChat";
import {
  getTrip,
  TRIPS_CHANGE_EVENT,
  type Trip,
  type TripStatus,
} from "@/lib/state/trips";

function statusPillStyles(status: TripStatus): string {
  if (status === "held")
    return "bg-bluelagoon-mist text-bluelagoon-midnight";
  if (status === "checked-in")
    return "bg-bluelagoon-volcanic/20 text-bluelagoon-deep";
  return "bg-bluelagoon-fiery/15 text-bluelagoon-fiery";
}

function statusLabel(status: TripStatus): string {
  if (status === "held") return "Held";
  if (status === "checked-in") return "Checked in";
  return "Cancelled";
}

interface ManagePageProps {
  params: Promise<{ ref: string }>;
}

export default function ManagePage({ params }: ManagePageProps) {
  // Next 15 passes a Promise; React.use unwraps it.
  const { ref } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTrip(getTrip(ref));
    setHydrated(true);
    const onChange = () => setTrip(getTrip(ref));
    window.addEventListener(TRIPS_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(TRIPS_CHANGE_EVENT, onChange);
  }, [ref]);

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            <span className="text-bluelagoon-midnight">Manage trip</span>
            <span className="text-bluelagoon-line"> · </span>change or cancel
          </p>
          <h1 className="mt-1 font-loft text-3xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-4xl">
            {trip ? trip.dest.city : "Your trip"}
          </h1>
        </div>

        {hydrated && !trip && (
          <div className="surface-card rounded-2xl p-8 text-center">
            <p className="font-loft text-lg font-semibold text-bluelagoon-midnight">
              We can't find {ref} in this browser.
            </p>
            <p className="mt-2 text-sm text-bluelagoon-ink/85">
              Trips are stored locally for the demo. Try the trips list, or
              hold a fresh booking.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <Link
                href="/customer/trips"
                className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-2 text-sm font-semibold text-bluelagoon-midnight transition hover:border-bluelagoon-midnight"
              >
                ← Trips
              </Link>
              <Link
                href="/customer"
                className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
              >
                Open the concierge
              </Link>
            </div>
          </div>
        )}

        {trip && (
          <>
            <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-crisp p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-bluelagoon-muted">
                    {trip.dest.iata} · {trip.fareClass} · {trip.pax} traveller
                    {trip.pax === 1 ? "" : "s"}
                  </div>
                  <div className="mt-1 font-mono text-xs tracking-widest text-bluelagoon-muted">
                    {trip.ref}
                  </div>
                  <div className="mt-3 text-sm text-bluelagoon-ink">
                    {trip.depart}
                    {trip.return ? ` → ${trip.return}` : " (one-way)"}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${statusPillStyles(trip.status)}`}
                  >
                    {statusLabel(trip.status)}
                  </span>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                      Total
                    </p>
                    <p className="font-loft text-lg font-bold text-bluelagoon-midnight">
                      €{trip.totalEUR}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ManageChat tripRef={trip.ref} />
          </>
        )}
      </div>
    </>
  );
}
