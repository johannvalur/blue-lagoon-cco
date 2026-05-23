"use client";

import Link from "next/link";
import type { TripIdea } from "@/lib/state/tripIdeas";
import { encodeTripIdea } from "@/lib/state/tripIdeas";

interface TripIdeaPreviewCardProps {
  idea: TripIdea;
}

const TIER_LABEL: Record<string, string> = {
  comfort: "Comfort",
  premium: "Premium",
  signature: "Signature",
  "retreat-spa": "Retreat Spa",
};

export function TripIdeaPreviewCard({ idea }: TripIdeaPreviewCardProps) {
  const encoded = encodeTripIdea(idea);
  const sharePath = encoded ? `/customer/trip/${encoded}` : null;
  const total =
    idea.totalEstimateEUR ??
    idea.legs.reduce((s, l) => s + (l.fareEUR ?? 0), 0) +
      idea.hotels.reduce((s, h) => s + h.nights * h.pricePerNightEUR, 0) +
      idea.cars.reduce((s, c) => s + c.days * c.pricePerDayEUR, 0) +
      idea.packages.reduce((s, p) => s + p.priceFromEURPerPerson, 0);

  // Re-shape the legs into a friendly plan line:
  //   "Premium · 2 nights at Silica"
  const tierLine = idea.legs
    .map((l) => TIER_LABEL[l.iata.toLowerCase()] ?? l.iata)
    .filter(Boolean)
    .join(" · ");
  const hotelLine = idea.hotels
    .map((h) => `${h.nights}n at ${h.name}`)
    .join(" + ");
  const summaryLine = [tierLine, hotelLine].filter(Boolean).join(" · ");

  return (
    <Link
      href={sharePath ?? "#"}
      className="surface-card flex h-full min-w-[240px] flex-col rounded-2xl border-l-4 border-l-bluelagoon-bright p-4 transition hover:translate-y-[-1px] hover:shadow-md"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-bright">
        Saved visit
      </p>
      <p className="mt-1 line-clamp-2 font-loft text-base font-bold text-bluelagoon-midnight">
        {idea.title}
      </p>
      {summaryLine && (
        <p className="mt-2 text-xs text-bluelagoon-muted">{summaryLine}</p>
      )}
      <div className="mt-auto flex items-baseline justify-between pt-3">
        {total ? (
          <p className="font-loft text-lg font-bold text-bluelagoon-midnight">
            ≈ €{Math.round(total)}
          </p>
        ) : (
          <span />
        )}
        <span className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
          Open
        </span>
      </div>
    </Link>
  );
}
