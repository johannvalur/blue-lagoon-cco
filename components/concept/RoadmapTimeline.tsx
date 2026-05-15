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
    title: "Foundations and proof",
    theme: "Platform stood up. Two pilots in market. Ops copilot in sandbox.",
    quarters: [
      {
        quarter: "Q1",
        text: "Stand up the AI platform team. Select model providers (Anthropic primary, credible secondary). Build the model gateway and evaluation suite. Establish the squad model in two pilot product areas.",
      },
      {
        quarter: "Q2",
        text: "Ship the conversational booking prototype to a 5% A/B test on the consumer site. Ship the crew copilot to one base (KEF). Begin building the ops control copilot in a non-production sandbox.",
      },
      {
        quarter: "Q3",
        text: "Expand booking to 50% A/B. Move the crew copilot to all bases. Begin shadow-mode evaluation of the ops control copilot against historical IROPS events.",
      },
      {
        quarter: "Q4",
        text: "Launch the trip companion in beta to Saga Club Gold members. Move the ops control copilot to production in second-screen mode (visible alongside controllers, not in the decision path).",
      },
    ],
  },
  {
    label: "Year 2",
    title: "Scale and integration",
    theme: "Booking flips to default. Companion goes wide. Maintenance and ancillaries land.",
    quarters: [
      {
        quarter: "Q5–Q6",
        text: "Conversational booking becomes the default consumer surface. Trip companion expands to all Saga Club members.",
      },
      {
        quarter: "Q7",
        text: "Predictive maintenance triage launches on the 737 MAX fleet — newest, most data-rich.",
      },
      {
        quarter: "Q8",
        text: "Dynamic ancillary engine launches. Saga loyalty redesign begins.",
      },
    ],
  },
  {
    label: "Year 3",
    title: "Operating model lock-in",
    theme: "Ops in the decision path. Loyalty relaunched. Internal copilot organisation-wide.",
    quarters: [
      {
        quarter: "Q9–Q10",
        text: "Ops control copilot moves into the decision path with explicit authority boundaries — proposes, controller approves, AI executes downstream rebookings, crew comms, and EU261 notifications.",
      },
      {
        quarter: "Q11",
        text: "Saga loyalty redesign launches.",
      },
      {
        quarter: "Q12",
        text: "Internal copilot expands to finance, procurement, and dispatch. Cross-organisation rollout complete.",
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
