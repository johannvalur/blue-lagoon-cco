interface QuarterEntry {
  quarter: string;
  text: string;
}

interface YearEntry {
  label: string;
  title: string;
  theme: string;
  quarters: QuarterEntry[];
}

const ROADMAP: YearEntry[] = [
  {
    label: "Year 1",
    title: "Pilot, expand, foundation",
    theme: "90-day pilot. 180-day expansion. Operations and ancillary by end of year.",
    quarters: [
      {
        quarter: "Q1",
        text: "90-day pilot. Stand up the AI platform team. Select model providers (Anthropic primary, credible secondary). Build the gateway and evaluation suite. Ship the conversational concierge to members and repeat guests only, behind a flag, as a 10% holdout against the legacy funnel.",
      },
      {
        quarter: "Q2",
        text: "180-day expansion. Expand the concierge to all guests. Launch the pre-arrival and on-property companion to members. Begin the facility operations copilot in a shadow-mode sandbox. Ship the first internal copilots — therapist protocol, hotel front desk — to opted-in staff.",
      },
      {
        quarter: "Q3",
        text: "Operations. Move the facility operations copilot to the duty floor in second-screen mode. Expand internal copilots to mask-bar, F&B, and member services. Begin the ancillary engine on intent-aware upgrade prompts in the concierge.",
      },
      {
        quarter: "Q4",
        text: "Ancillary and integration. Ancillary engine on in-spa F&B and post-visit skincare follow-up. Member services and Ambassador concierge in production. Facility ops copilot moves into the decision path with explicit authority boundaries — proposes, manager approves.",
      },
    ],
  },
  {
    label: "Year 2",
    title: "Scale and depth",
    theme: "Concierge as default. Companion wide. Hotel-specific and geothermal copilots land.",
    quarters: [
      {
        quarter: "Q5–Q6",
        text: "Concierge becomes the default booking surface across channels. Companion expands to all guests, post-visit follow-up running by default.",
      },
      {
        quarter: "Q7",
        text: "Hotel front desk, housekeeping, and Retreat-specific copilots reach full coverage. Moss-specific F&B copilot — with the tasting-menu pacing logic — launches.",
      },
      {
        quarter: "Q8",
        text: "Geothermal and facility engineering reference copilot launches, read-only, with strict human-in-the-loop policy. Skincare retail integration deepens.",
      },
    ],
  },
  {
    label: "Year 3",
    title: "Operating model lock-in",
    theme: "Ops in the decision path. Member program redesigned. Internal copilot organisation-wide.",
    quarters: [
      {
        quarter: "Q9–Q10",
        text: "Facility operations copilot is the daily working surface of the duty manager. Decision log is the source of truth for shift-handover and incident review.",
      },
      {
        quarter: "Q11",
        text: "Member program (Ambassador, Patron) redesigned around AI-personalised journeys, with the concierge as the primary touchpoint.",
      },
      {
        quarter: "Q12",
        text: "Cross-organisation rollout complete. Every role with a corpus has a copilot grounded in it.",
      },
    ],
  },
];

export function RoadmapTimeline() {
  return (
    <div className="my-10 flex flex-col gap-14">
      {ROADMAP.map((year) => (
        <div key={year.label} className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
              {year.label}
            </p>
            <h4 className="mt-2 font-loft text-xl font-bold leading-tight tracking-tight text-bluelagoon-midnight">
              {year.title}
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-bluelagoon-ink/70">
              {year.theme}
            </p>
          </div>
          <ol className="md:col-span-9 flex flex-col">
            {year.quarters.map((q, i) => (
              <li
                key={q.quarter}
                className={`grid grid-cols-[3.5rem_1fr] gap-5 py-4 md:grid-cols-[5rem_1fr] md:gap-6 ${
                  i === 0
                    ? "border-t border-bluelagoon-line"
                    : "border-t border-bluelagoon-line/60"
                }`}
              >
                <p className="font-loft text-sm font-semibold tabular-nums tracking-tight text-bluelagoon-midnight">
                  {q.quarter}
                </p>
                <p className="text-[15px] leading-relaxed text-bluelagoon-ink/85">
                  {q.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
