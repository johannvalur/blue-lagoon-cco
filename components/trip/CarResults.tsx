"use client";

// Concept: this file used to render car-rental tiers. It now renders
// transfer options (shuttle, private, KEF pickup, self-drive). The
// filename is preserved so TripChat's import still works.

import type { SearchTransfersResult } from "@/lib/tools/inventoryTools";

// Legacy name alias — TripChat imports this.
export type SearchCarsResult = SearchTransfersResult;

interface CarResultsProps {
  result: SearchTransfersResult;
  onAdd: (transfer: SearchTransfersResult["transfers"][number]) => void;
}

const PICKUP_LABEL: Record<string, string> = {
  "reykjavik-bsi": "Reykjavík · BSÍ",
  "reykjavik-door": "Reykjavík · door pickup",
  "kef-airport": "KEF airport",
  "self-drive": "Self-drive",
};

export function CarResults({ result, onAdd }: CarResultsProps) {
  if (!result.transfers || result.transfers.length === 0) {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
        No matching transfers. Try a different pickup point.
      </div>
    );
  }
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        {result.query_summary}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {result.transfers.map((tr) => (
          <div
            key={tr.id}
            className="surface-card flex flex-col rounded-2xl border-l-4 border-l-bluelagoon-golden p-5"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              {PICKUP_LABEL[tr.pickupLocation] ?? tr.pickupLocation}
            </span>
            <div className="mt-1 font-loft text-lg font-bold text-bluelagoon-midnight">
              {tr.name}
            </div>
            <div className="mt-1 text-xs text-bluelagoon-muted">
              {tr.durationMinutes} min · pickup at {tr.pickupLabel}
            </div>
            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-snug text-bluelagoon-ink">
              {tr.why}
            </p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-loft text-xl font-bold text-bluelagoon-midnight">
                  {tr.pricePerPersonEUR === 0
                    ? "Free"
                    : `€${tr.pricePerPersonEUR}`}
                </p>
                <p className="text-xs text-bluelagoon-muted">
                  {tr.pricePerPersonEUR === 0 ? "your own car" : "per person"}
                </p>
              </div>
              <button
                onClick={() => onAdd(tr)}
                className="rounded-xl border border-bluelagoon-midnight bg-bluelagoon-paper px-3 py-2 text-xs font-semibold text-bluelagoon-midnight transition hover:bg-bluelagoon-midnight hover:text-bluelagoon-snow"
              >
                Add to visit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
