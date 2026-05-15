"use client";

import type { SearchCarsResult } from "@/lib/tools/inventoryTools";

interface CarResultsProps {
  result: SearchCarsResult;
  onAdd: (car: SearchCarsResult["cars"][number]) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  "compact-2wd": "Compact 2WD",
  "crossover-awd": "AWD crossover",
  "4x4-rugged": "4x4",
  "camper-van": "Camper",
};

export function CarResults({ result, onAdd }: CarResultsProps) {
  if (!result.cars || result.cars.length === 0) {
    return (
      <div className="rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper p-4 text-sm text-bluelagoon-muted">
        No matching cars. Try a different terrain or season.
      </div>
    );
  }
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        {result.query_summary}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {result.cars.map((car) => (
          <div
            key={car.id}
            className="surface-card flex flex-col rounded-2xl border-l-4 border-l-bluelagoon-golden p-5"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
              {CATEGORY_LABEL[car.category] ?? car.category}
            </span>
            <div className="mt-1 font-loft text-lg font-bold text-bluelagoon-midnight">
              {car.name}
            </div>
            <div className="mt-1 text-xs text-bluelagoon-muted">
              {car.seats} seats · {car.transmission}
            </div>
            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-snug text-bluelagoon-ink">
              {car.why}
            </p>
            <div className="mt-3 text-xs text-bluelagoon-muted">
              Pickup: {car.pickup}
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-loft text-xl font-bold text-bluelagoon-midnight">
                  €{car.pricePerDayEUR}
                </p>
                <p className="text-xs text-bluelagoon-muted">per day</p>
              </div>
              <button
                onClick={() => onAdd(car)}
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
