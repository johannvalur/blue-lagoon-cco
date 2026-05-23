import { Chat } from "@/components/Chat";

export default function CrewPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
          <span className="text-bluelagoon-midnight">Spa floor SOPs</span>
          <span className="text-bluelagoon-line"> · </span>live
        </p>
        <h1 className="mt-1 font-loft text-4xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-5xl">
          Spa floor copilot
        </h1>
        <p className="mt-2 max-w-3xl text-bluelagoon-ink/85">
          A grounded reference assistant for the spa floor team — lifeguards,
          therapists, mask bar, hotel front. Ask the Blue Lagoon SOPs in plain
          language. Answers are pulled from a synthetic SOP excerpt cached
          server-side. If the corpus doesn&rsquo;t cover it, the copilot says
          so.
        </p>
      </div>

      <Chat
        surface="crew"
        apiPath="/api/chat/internal"
        placeholder="What's the lagoon supervision rotation? How do I hand off a treatment room?"
        accent="fiery"
        starters={[
          "What's the standard lagoon supervision rotation?",
          "Walk me through a silica overflow at the mask bar.",
          "Guest feels faint in the outdoor lagoon — what do I do?",
          "Treatment room handoff between back-to-back massages — what's the SOP?",
          "What's the evacuation procedure if the steam room alarms?",
        ]}
      />
    </div>
  );
}
