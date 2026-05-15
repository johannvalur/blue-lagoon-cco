import Link from "next/link";
import { decodeTripIdea } from "@/lib/state/tripIdeas";
import { TripIdeaCard } from "@/components/trip/TripIdeaCard";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function TripSharePage({ params }: SharePageProps) {
  const { id } = await params;
  const idea = decodeTripIdea(id);

  if (!idea) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bluelagoon-muted">
          Trip link
        </p>
        <h1 className="font-loft text-3xl font-extrabold tracking-tight text-bluelagoon-midnight">
          This trip link is no longer valid.
        </h1>
        <p className="max-w-md text-sm text-bluelagoon-ink/85">
          The link may have been truncated or copied incompletely. Open the
          concierge to plan a new trip.
        </p>
        <Link
          href="/customer"
          className="btn-primary mt-2 rounded-xl px-5 py-3 text-sm font-semibold"
        >
          Open the concierge
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
          <span className="text-bluelagoon-midnight">Trip idea</span>
          <span className="text-bluelagoon-line"> · </span>shared link
        </p>
        <h1 className="mt-1 font-loft text-3xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-4xl">
          {idea.title}
        </h1>
      </div>

      <TripIdeaCard idea={idea} readOnly />

      <p className="text-xs text-bluelagoon-muted">
        This is a concept site. Trip ideas are demo plans — no booking has
        been made.
      </p>
    </div>
  );
}
