"use client";

import { useEffect, useState } from "react";
import {
  getTripIdeas,
  TRIP_IDEAS_CHANGE_EVENT,
  type TripIdea,
} from "@/lib/state/tripIdeas";
import { TripIdeaPreviewCard } from "@/components/trip/TripIdeaPreviewCard";

export function SavedTripsStrip() {
  const [ideas, setIdeas] = useState<TripIdea[]>([]);

  useEffect(() => {
    setIdeas(getTripIdeas());
    function refresh() {
      setIdeas(getTripIdeas());
    }
    window.addEventListener(TRIP_IDEAS_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(TRIP_IDEAS_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (ideas.length === 0) return null;

  return (
    <section className="flex flex-none flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bluelagoon-muted">
        Saved visits
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {ideas.map((idea) => (
          <TripIdeaPreviewCard key={idea.id} idea={idea} />
        ))}
      </div>
    </section>
  );
}
