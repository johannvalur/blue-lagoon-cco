"use client";

import type { SearchHotelsResult } from "@/lib/tools/inventoryTools";

interface HotelResultsProps {
  result: SearchHotelsResult;
  onAdd: (hotel: SearchHotelsResult["hotels"][number]) => void;
}

const TIER_LABEL: Record<string, string> = {
  boutique: "Boutique",
  design: "Design",
  comfort: "Comfort",
  "ryokan-style": "Ryokan-style",
  lodge: "Lodge",
};

const WALKABILITY_LABEL: Record<string, string> = {
  walkable: "Walkable",
  "car-helpful": "Car helpful",
  "car-needed": "Car needed",
};

export function HotelResults({ result, onAdd }: HotelResultsProps) {
  if (!result.hotels || result.hotels.length === 0) {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
        No matching hotels. Try widening the brief.
      </div>
    );
  }
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        {result.query_summary}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {result.hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="surface-card flex flex-col rounded-2xl border-l-4 border-l-bluelagoon-aurora p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-loft text-lg font-bold text-bluelagoon-midnight">
                  {hotel.name}
                </div>
                <div className="mt-0.5 text-xs text-bluelagoon-muted">
                  {hotel.area} · {hotel.cityIata}
                </div>
              </div>
              <span className="rounded-full bg-bluelagoon-mist/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-ink">
                {TIER_LABEL[hotel.tier] ?? hotel.tier}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {hotel.vibe.slice(0, 4).map((v) => (
                <span
                  key={v}
                  className="rounded-full bg-bluelagoon-mist/60 px-2 py-0.5 text-[11px] text-bluelagoon-ink"
                >
                  {v}
                </span>
              ))}
              <span className="rounded-full bg-bluelagoon-cloud px-2 py-0.5 text-[11px] text-bluelagoon-muted">
                {WALKABILITY_LABEL[hotel.walkability] ?? hotel.walkability}
              </span>
              {hotel.geothermalOnsite ? (
                <span className="rounded-full bg-bluelagoon-boreal/30 px-2 py-0.5 text-[11px] text-bluelagoon-ink">
                  Geothermal onsite
                </span>
              ) : null}
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-snug text-bluelagoon-ink">
              {hotel.why}
            </p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-loft text-xl font-bold text-bluelagoon-midnight">
                  from €{hotel.priceEURPerNight}
                </p>
                <p className="text-xs text-bluelagoon-muted">per night</p>
              </div>
              <button
                onClick={() => onAdd(hotel)}
                className="rounded-xl border border-bluelagoon-midnight bg-bluelagoon-paper px-3 py-2 text-xs font-semibold text-bluelagoon-midnight transition hover:bg-bluelagoon-midnight hover:text-bluelagoon-snow"
              >
                Add to trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
