"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getTrips,
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
  if (status === "checked-in") return "Arrived";
  return "Cancelled";
}

function formatDateRange(depart: string, ret: string | null): string {
  if (!ret) return depart;
  return `${depart} → ${ret}`;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTrips(getTrips());
    setHydrated(true);
    const onChange = () => setTrips(getTrips());
    window.addEventListener(TRIPS_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(TRIPS_CHANGE_EVENT, onChange);
  }, []);

  return (
    <>
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            <span className="text-bluelagoon-midnight">My visits</span>
            <span className="text-bluelagoon-line"> · </span>local to this
            browser
          </p>
          <h1 className="mt-1 font-loft text-3xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-4xl">
            Your held reservations
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bluelagoon-ink/85">
            Visits you held with the concierge live here. Change a date, layer
            on a treatment, or pull up your arrival pass when the day comes.
          </p>
        </div>

        {hydrated && trips.length === 0 && (
          <div className="surface-card rounded-2xl p-8 text-center">
            <p className="font-loft text-lg font-semibold text-bluelagoon-midnight">
              No visits yet.
            </p>
            <p className="mt-2 text-sm text-bluelagoon-ink/85">
              Tell the concierge what kind of visit you're after and we'll
              hold it here.
            </p>
            <Link
              href="/customer"
              className="btn-primary mt-5 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Open the concierge →
            </Link>
          </div>
        )}

        {hydrated && trips.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {trips.map((t) => (
              <div
                key={t.ref}
                className="surface-card surface-card-hover rounded-2xl border-l-4 border-l-bluelagoon-crisp p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-loft text-xl font-bold text-bluelagoon-midnight">
                      {t.dest.city}
                    </div>
                    <div className="text-xs text-bluelagoon-muted">
                      {t.fareClass} entry · {t.pax} guest
                      {t.pax === 1 ? "" : "s"}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${statusPillStyles(t.status)}`}
                  >
                    {statusLabel(t.status)}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                      When
                    </p>
                    <p className="text-sm text-bluelagoon-ink">
                      {formatDateRange(t.depart, t.return)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                      Total
                    </p>
                    <p className="font-loft text-lg font-bold text-bluelagoon-midnight">
                      €{t.totalEUR}
                    </p>
                  </div>
                </div>

                <div className="mt-3 font-mono text-[11px] tracking-widest text-bluelagoon-muted">
                  {t.ref}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {t.status !== "cancelled" && (
                    <Link
                      href={`/customer/check-in/${t.ref}`}
                      className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-xs font-semibold text-bluelagoon-midnight transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist"
                    >
                      Arrival pass →
                    </Link>
                  )}
                  <Link
                    href={`/customer/manage/${t.ref}`}
                    className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-xs font-semibold text-bluelagoon-midnight transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
