import type {
  BookedVisit,
  MaintenanceDisruption,
} from "@/lib/data/customer/tripScenario";

interface TripStatusCardProps {
  trip: BookedVisit;
  disruption?: MaintenanceDisruption;
}

export function TripStatusCard({ trip, disruption }: TripStatusCardProps) {
  const atRisk = !!disruption;
  const tierTint =
    trip.tier === "Retreat Spa"
      ? "bluelagoon-volcanic"
      : trip.tier === "Signature"
        ? "bluelagoon-golden"
        : trip.tier === "Premium"
          ? "bluelagoon-crisp"
          : "bluelagoon-muted";

  return (
    <div
      className={`surface-card rounded-2xl p-5 border-l-4 ${
        atRisk ? "border-l-bluelagoon-fiery" : "border-l-bluelagoon-boreal"
      }`}
      role="region"
      aria-label={`Visit status for ${trip.ref}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
            Reservation {trip.ref}
          </p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-loft text-2xl font-bold text-bluelagoon-midnight">
              {trip.arrivalWindow}
            </span>
            <span className="text-bluelagoon-ink">{trip.visitDate}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full bg-${tierTint}/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-${tierTint}`}
            >
              {trip.tier}
            </span>
            {trip.hotelName && (
              <span className="text-xs text-bluelagoon-muted">
                {trip.hotelName}
                {trip.hotelRoom ? ` · room ${trip.hotelRoom}` : ""}
              </span>
            )}
          </div>
        </div>
        {atRisk ? (
          <div className="shrink-0 rounded-full bg-bluelagoon-fiery/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-fiery">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-bluelagoon-fiery pulse-soft align-middle" />
            Affected by maintenance
          </div>
        ) : (
          <div className="shrink-0 rounded-full bg-bluelagoon-volcanic/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-volcanic">
            On time
          </div>
        )}
      </div>

      {atRisk && disruption && (
        <div className="mt-4 border-t border-bluelagoon-line pt-4">
          <p className="text-sm text-bluelagoon-ink">
            {disruption.cause}. {disruption.capacityImpact} from{" "}
            {disruption.windowStart} to {disruption.windowEnd}.{" "}
            {disruption.affectedAreasUnaffected.length > 0
              ? `${disruption.affectedAreasUnaffected[0]} unaffected.`
              : ""}
          </p>
          <p className="mt-1 text-xs text-bluelagoon-muted">
            {disruption.causeDetail}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {disruption.recoveryOptions.map((opt) => (
              <li
                key={opt.id}
                className="flex items-start gap-3 rounded-xl bg-bluelagoon-cloud/60 p-3"
              >
                <span
                  className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                    opt.recommended
                      ? "bg-bluelagoon-volcanic"
                      : "bg-bluelagoon-line"
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-bluelagoon-midnight">
                    {opt.label}
                    {opt.recommended && (
                      <span className="ml-2 rounded-full bg-bluelagoon-volcanic/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-volcanic">
                        Recommended
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-bluelagoon-ink">
                    {opt.description}
                  </p>
                  <p className="mt-0.5 text-xs text-bluelagoon-muted">
                    {opt.valueLine}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
