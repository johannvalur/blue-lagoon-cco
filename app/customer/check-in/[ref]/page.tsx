"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { BoardingPass } from "@/components/BoardingPass";
import {
  getTrip,
  TRIPS_CHANGE_EVENT,
  updateTrip,
  type Trip,
} from "@/lib/state/trips";

interface CheckInPageProps {
  params: Promise<{ ref: string }>;
}

export default function CheckInPage({ params }: CheckInPageProps) {
  const { ref } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("Anna J.");
  const [passport, setPassport] = useState("");

  useEffect(() => {
    setTrip(getTrip(ref));
    setHydrated(true);
    const onChange = () => setTrip(getTrip(ref));
    window.addEventListener(TRIPS_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(TRIPS_CHANGE_EVENT, onChange);
  }, [ref]);

  // Once we land on step 2 with a real trip, mark it checked-in.
  useEffect(() => {
    if (step === 2 && trip && trip.status !== "checked-in") {
      updateTrip(ref, { status: "checked-in" });
    }
  }, [step, trip, ref]);

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            <span className="text-bluelagoon-midnight">Check in</span>
            <span className="text-bluelagoon-line"> · </span>
            {step === 1 ? "step 1 of 2" : "boarding pass"}
          </p>
          <h1 className="mt-1 font-loft text-3xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-4xl">
            {step === 1 ? "Confirm passenger details" : "You're checked in."}
          </h1>
        </div>

        {hydrated && !trip && (
          <div className="surface-card rounded-2xl p-8 text-center">
            <p className="font-loft text-lg font-semibold text-bluelagoon-midnight">
              We can't find {ref} in this browser.
            </p>
            <p className="mt-2 text-sm text-bluelagoon-ink/85">
              Trips are stored locally for the demo.
            </p>
            <Link
              href="/customer/trips"
              className="btn-primary mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold"
            >
              ← Back to trips
            </Link>
          </div>
        )}

        {trip && trip.status === "cancelled" && (
          <div className="surface-card rounded-2xl border-l-4 border-l-bluelagoon-fiery p-6">
            <p className="font-loft text-lg font-semibold text-bluelagoon-midnight">
              This booking was cancelled.
            </p>
            <p className="mt-2 text-sm text-bluelagoon-ink/85">
              You can't check in on a cancelled trip. Hold a fresh booking
              instead.
            </p>
            <Link
              href="/customer"
              className="btn-primary mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold"
            >
              Open the concierge →
            </Link>
          </div>
        )}

        {trip && trip.status !== "cancelled" && step === 1 && (
          <div className="surface-card rounded-2xl p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                  Trip
                </p>
                <p className="mt-1 font-loft text-lg font-semibold text-bluelagoon-midnight">
                  {trip.dest.city} · {trip.dest.iata}
                </p>
                <p className="mt-1 text-sm text-bluelagoon-ink">
                  {trip.depart}
                  {trip.return ? ` → ${trip.return}` : " (one-way)"}
                </p>
                <p className="mt-2 font-mono text-xs tracking-widest text-bluelagoon-muted">
                  {trip.ref}
                </p>
              </div>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                    Passenger name
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-sm text-bluelagoon-ink outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
                    placeholder="Anna J."
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest text-bluelagoon-muted">
                    Passport number
                  </span>
                  <input
                    type="text"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-3 py-2 text-sm tracking-wider text-bluelagoon-ink outline-none transition focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
                    placeholder="A1234567"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-bluelagoon-muted">
                We'll generate a demo boarding pass — no real check-in happens.
              </p>
              <button
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {trip && trip.status !== "cancelled" && step === 2 && (
          <>
            <BoardingPass trip={trip} passengerName={name} />
            <div className="flex justify-center gap-3">
              <Link
                href="/customer/trips"
                className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-2 text-sm font-semibold text-bluelagoon-midnight transition hover:border-bluelagoon-midnight"
              >
                ← My trips
              </Link>
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border border-bluelagoon-line bg-bluelagoon-paper px-4 py-2 text-sm font-semibold text-bluelagoon-midnight transition hover:border-bluelagoon-midnight"
              >
                Edit details
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
