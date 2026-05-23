import type { UpgradeOffer as UpgradeOfferData } from "@/lib/data/customer/upgrades";

interface UpgradeOfferProps {
  offer: UpgradeOfferData;
  variant?: "sidebar" | "inline";
  /**
   * When set, the price line is replaced with "Complimentary today" —
   * useful during a maintenance window where the upgrade is being offered
   * as part of care.
   */
  complimentary?: boolean;
}

export function UpgradeOffer({
  offer,
  variant = "sidebar",
  complimentary = false,
}: UpgradeOfferProps) {
  const compact = variant === "sidebar";
  return (
    <div
      className="surface-card rounded-2xl p-5 border-l-4 border-l-bluelagoon-golden"
      role="region"
      aria-label="Tier upgrade"
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-golden">
        Available for this visit
      </p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <div className="font-loft text-xl font-bold text-bluelagoon-midnight">
          Upgrade to Signature
        </div>
        <div className="text-right">
          <div className="font-loft text-2xl font-bold text-bluelagoon-midnight">
            {complimentary ? "Complimentary" : `€${offer.priceEUR}`}
          </div>
          <div className="text-[11px] text-bluelagoon-muted">
            {complimentary ? "today only" : `from ${offer.fromFareClass}`}
          </div>
        </div>
      </div>
      <ul
        className={`mt-3 space-y-1.5 ${compact ? "text-xs" : "text-sm"} text-bluelagoon-ink`}
      >
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
      {offer.context && (
        <p className="mt-3 text-xs text-bluelagoon-muted">{offer.context}</p>
      )}
      <p className="mt-3 text-[11px] text-bluelagoon-muted">
        Demo offer — settle the difference at the Silica front desk.
      </p>
    </div>
  );
}
