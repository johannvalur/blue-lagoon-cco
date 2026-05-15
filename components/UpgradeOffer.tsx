import type { UpgradeOffer as UpgradeOfferData } from "@/lib/data/customer/upgrades";

interface UpgradeOfferProps {
  offer: UpgradeOfferData;
  variant?: "sidebar" | "inline";
}

export function UpgradeOffer({ offer, variant = "sidebar" }: UpgradeOfferProps) {
  const compact = variant === "sidebar";
  return (
    <div
      className="surface-card rounded-2xl p-5 border-l-4 border-l-bluelagoon-golden"
      role="region"
      aria-label="Available upgrade"
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-golden">
        Available for this trip
      </p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <div className="font-loft text-xl font-bold text-bluelagoon-midnight">
          Saga upgrade
        </div>
        <div className="text-right">
          <div className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            €{offer.priceEUR}
          </div>
          <div className="text-[11px] text-bluelagoon-muted">
            from {offer.fromFareClass}
          </div>
        </div>
      </div>
      <ul className={`mt-3 space-y-1.5 ${compact ? "text-xs" : "text-sm"} text-bluelagoon-ink`}>
        {offer.inclusions.map((line) => (
          <li key={line} className="flex items-start gap-2">
            <span
              className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-bluelagoon-golden"
              aria-hidden="true"
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-bluelagoon-muted">
        Demo offer — no payment is taken.
      </p>
    </div>
  );
}
