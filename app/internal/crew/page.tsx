import { Chat } from "@/components/Chat";

export default function CrewPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
          <span className="text-bluelagoon-midnight">Internal tooling</span>
          <span className="text-bluelagoon-line"> · </span>live
        </p>
        <h1 className="mt-1 font-loft text-4xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-5xl">
          Crew copilot
        </h1>
        <p className="mt-2 max-w-3xl text-bluelagoon-ink/85">
          A grounded reference assistant for cabin and flight crew. Ask the
          Blue Lagoon SOPs in plain language. Answers are pulled from a synthetic
          OM-A excerpt cached server-side. If the corpus doesn&rsquo;t cover it,
          the copilot says so.
        </p>
      </div>

      <Chat
        surface="crew"
        apiPath="/api/chat/internal"
        placeholder="What's the boarding sequence? How do I handle a decompression?"
        accent="fiery"
        starters={[
          "What's the standard boarding sequence?",
          "Walk me through a decompression at FL350.",
          "Passenger having chest pain over the North Atlantic — what do I do?",
          "When is an Aurora Moment triggered?",
          "What's the procedure for a missing special meal?",
        ]}
      />
    </div>
  );
}
