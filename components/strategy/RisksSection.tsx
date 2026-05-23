"use client";

import { useState } from "react";

type Impact = "High" | "Medium" | "Low–Med";

interface Risk {
  risk: string;
  impact: Impact;
  mitigation: string;
}

const COMMERCIAL_RISKS: Risk[] = [
  {
    risk: "OTA dependency",
    impact: "High",
    mitigation:
      "Accelerate direct channel investment; enforce rate parity; loyalty incentives for direct booking.",
  },
  {
    risk: "Seasonality & capacity ceiling",
    impact: "High",
    mitigation:
      "Dynamic pricing smooths demand; shoulder-season packages; B2B fills troughs.",
  },
  {
    risk: "Talent gaps in commercial team",
    impact: "Medium",
    mitigation:
      "Fast-track key hires (CRM, data); interim expertise while permanent roles are filled.",
  },
  {
    risk: "Brand dilution via discounting",
    impact: "Medium",
    mitigation:
      "Strict pricing floors on all channels; renegotiate or remove underperforming OTA agreements.",
  },
  {
    risk: "CRM & tech stack readiness",
    impact: "Medium",
    mitigation:
      "Audit in first 30 days; phased migration with clear go/no-go milestones.",
  },
  {
    risk: "Geopolitical / tourism downturn",
    impact: "Low–Med",
    mitigation:
      "Market diversification (NA, EU, Asia); flexible pricing architecture to adjust quickly.",
  },
];

interface Adoption {
  risk: string;
  mitigation: string;
}

const ADOPTION_RISKS: Adoption[] = [
  {
    risk: "Teams continue working in silos",
    mitigation: "Shared KPI scorecard and weekly governance.",
  },
  {
    risk: "Data quality is weak",
    mitigation: "First 90-day data audit and source-of-truth definition.",
  },
  {
    risk: "Revenue focus damages guest experience",
    mitigation: "Include NPS and guest satisfaction in scorecard.",
  },
  {
    risk: "Pricing changes create customer resistance",
    mitigation: "Test gradually and communicate value clearly.",
  },
  {
    risk: "Technology projects take too long",
    mitigation: "Start with MVP improvements before full system rebuild.",
  },
  {
    risk: "Too many initiatives at once",
    mitigation: "Prioritise by impact, urgency, feasibility, and KPI link.",
  },
  {
    risk: "Change resistance from teams",
    mitigation: "Clear communication, training, and visible leadership support.",
  },
];

function ImpactPill({ impact }: { impact: Impact }) {
  const className =
    impact === "High"
      ? "bg-bluelagoon-blue-600 text-bluelagoon-snow"
      : impact === "Medium"
        ? "bg-bluelagoon-water-500 text-bluelagoon-blue-700"
        : "bg-bluelagoon-moss-300 text-bluelagoon-blue-700";
  return (
    <span
      className={`font-accent inline-flex items-center px-2 py-0.5 text-[12px] font-semibold uppercase tracking-[0.16em] ${className}`}
    >
      {impact}
    </span>
  );
}

export function RisksSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = COMMERCIAL_RISKS[activeIdx];

  return (
    <section
      id="risks"
      className="scroll-mt-24 border-b border-bluelagoon-line bg-bluelagoon-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
              <span className="tabular-nums">07</span>
              <span className="ml-3 text-bluelagoon-muted/80">
                Risks &amp; Mitigation
              </span>
            </p>
            <h2 className="mt-4 max-w-2xl font-loft text-[2rem] font-bold leading-[1.1] tracking-tight text-bluelagoon-midnight md:text-[2.5rem]">
              What could derail the plan — and how we hold the line.
            </h2>
          </div>
        </div>

        {/* Commercial risks: clickable list + detail */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-10">
          <ol className="lg:col-span-7 flex flex-col">
            {COMMERCIAL_RISKS.map((r, i) => {
              const isActive = i === activeIdx;
              return (
                <li
                  key={r.risk}
                  className={`${
                    i === 0
                      ? "border-t border-bluelagoon-line"
                      : "border-t border-bluelagoon-line/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-pressed={isActive}
                    className={`grid w-full grid-cols-[1fr_auto] items-center gap-4 py-4 text-left transition ${
                      isActive
                        ? "text-bluelagoon-midnight"
                        : "text-bluelagoon-ink hover:text-bluelagoon-midnight"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`font-loft text-sm font-semibold tabular-nums tracking-tight transition ${
                          isActive
                            ? "text-bluelagoon-moss-600"
                            : "text-bluelagoon-muted"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-loft text-base font-bold tracking-tight md:text-lg ${
                          isActive ? "" : "font-semibold"
                        }`}
                      >
                        {r.risk}
                      </span>
                    </span>
                    <ImpactPill impact={r.impact} />
                  </button>
                </li>
              );
            })}
          </ol>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div
              key={active.risk}
              className="surface-fade border border-bluelagoon-midnight bg-bluelagoon-midnight p-8 text-bluelagoon-snow md:p-10"
            >
              <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/65">
                Mitigation
              </p>
              <h3 className="mt-3 font-loft text-2xl font-bold leading-tight tracking-tight text-bluelagoon-snow">
                {active.risk}
              </h3>
              <div className="mt-4 flex items-center gap-3">
                <ImpactPill impact={active.impact} />
                <p className="font-accent text-[12px] uppercase tracking-[0.18em] text-bluelagoon-snow/55">
                  Impact rating
                </p>
              </div>
              <p className="mt-6 text-[16px] leading-relaxed text-bluelagoon-snow/90">
                {active.mitigation}
              </p>
            </div>
          </aside>
        </div>

        {/* Adoption risks */}
        <div className="mt-20 border-t border-bluelagoon-line pt-20">
          <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
            Adoption &amp; execution risks
          </p>
          <h3 className="mt-3 max-w-xl font-loft text-2xl font-bold tracking-tight text-bluelagoon-midnight">
            The cultural and operational risks behind the strategy.
          </h3>
          <ol className="mt-8 grid gap-3 md:grid-cols-2">
            {ADOPTION_RISKS.map((r, i) => (
              <li
                key={r.risk}
                className="surface-card grid grid-cols-[2rem_1fr] gap-4 p-5"
              >
                <span className="font-loft text-sm font-bold tabular-nums tracking-tight text-bluelagoon-moss-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-loft text-[16px] font-semibold tracking-tight text-bluelagoon-midnight">
                    {r.risk}
                  </p>
                  <p className="mt-2 text-[16px] leading-relaxed text-bluelagoon-ink/75">
                    <span className="font-accent text-[12px] uppercase tracking-[0.18em] text-bluelagoon-muted">
                      Mitigation ·
                    </span>{" "}
                    {r.mitigation}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
