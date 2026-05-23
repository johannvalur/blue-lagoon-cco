"use client";

import type { SearchPackagesResult } from "@/lib/tools/inventoryTools";

interface PackageResultsProps {
  result: SearchPackagesResult;
  onAdd: (pkg: SearchPackagesResult["packages"][number]) => void;
}

const TIER_LABEL: Record<string, string> = {
  comfort: "Comfort tier",
  premium: "Premium tier",
  signature: "Signature tier",
  "retreat-spa": "Retreat Spa journey",
};

export function PackageResults({ result, onAdd }: PackageResultsProps) {
  if (!result.packages || result.packages.length === 0) {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
        No matching packages. Try a different season or budget.
      </div>
    );
  }
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        {result.query_summary}
      </p>
      <div className="flex flex-col gap-3">
        {result.packages.map((pkg) => (
          <div
            key={pkg.id}
            className="surface-card flex flex-col gap-3 rounded-2xl border-l-4 border-l-bluelagoon-volcanic p-5 sm:flex-row sm:items-stretch"
          >
            <div className="flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-volcanic">
                {pkg.nights} night{pkg.nights === 1 ? "" : "s"}
                {pkg.hotelName ? ` · ${pkg.hotelName}` : ""} ·{" "}
                {TIER_LABEL[pkg.entryTierId] ?? pkg.entryTierId}
              </span>
              <div className="mt-1 font-loft text-lg font-bold text-bluelagoon-midnight">
                {pkg.name}
              </div>
              <p className="mt-3 text-sm leading-snug text-bluelagoon-ink">
                {pkg.why}
              </p>

              {pkg.treatments.length > 0 ? (
                <div className="mt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                    Treatments included
                  </p>
                  <ul className="mt-1 space-y-0.5 text-sm text-bluelagoon-ink">
                    {pkg.treatments.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-bluelagoon-volcanic"
                          aria-hidden="true"
                        />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {pkg.dining.length > 0 ? (
                <div className="mt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
                    Dining
                  </p>
                  <ul className="mt-1 space-y-0.5 text-sm text-bluelagoon-ink">
                    {pkg.dining.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-bluelagoon-aurora"
                          aria-hidden="true"
                        />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-1">
                {pkg.vibe.slice(0, 4).map((v) => (
                  <span
                    key={v}
                    className="rounded-full bg-bluelagoon-mist/60 px-2 py-0.5 text-[11px] text-bluelagoon-ink"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-row items-end justify-between gap-3 border-t border-bluelagoon-line pt-3 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
              <div className="text-right">
                <p className="font-loft text-2xl font-bold text-bluelagoon-midnight">
                  €{pkg.priceEUR}
                </p>
                <p className="text-xs text-bluelagoon-muted">per guest</p>
              </div>
              <button
                onClick={() => onAdd(pkg)}
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
