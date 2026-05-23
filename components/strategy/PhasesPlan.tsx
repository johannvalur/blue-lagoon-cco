"use client";

import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface Phase {
  num: string;
  short: string;
  window: string;
  title: string;
  tagline: string;
  description: string;
  priorities: string[];
  image: string;
  imageAlt: string;
}

const PHASES: Phase[] = [
  {
    num: "01",
    short: "Listen",
    window: "0 – 90 Days",
    title: "Listen, Diagnose & Plan",
    tagline: "Create focus, visibility, and momentum across the commercial division.",
    description:
      "Create focus, visibility, and momentum across the commercial organisation with a meet-and-greet approach along with capability mapping. 1:1s, identify gaps and what do we need to succeed.",
    priorities: [
      "Establish commercial operating model & governance",
      "Review the current revenue, pricing & business model",
      "Understand customer segments and journeys",
      "Launch 3–5 quick wins for sales & marketing",
      "Commercial Plan approved by ExCo & BOD",
    ],
    image: "/strategy/phase-1.png",
    imageAlt: "Retreat architecture",
  },
  {
    num: "02",
    short: "Build",
    window: "3 – 12 Months",
    title: "Build, Integrate & Scale",
    tagline:
      "Drive performance through integrated execution and commercial discipline.",
    description:
      "Drive performance through integrated execution and commercial discipline across every customer-facing function.",
    priorities: [
      "Build a result-driven culture (OKR / KPIs)",
      "Strengthen revenue management and pricing",
      "Establish CRM and AI-driven personalisation",
      "Grow direct sales with partner program (B2B & B2C)",
      "Evolve digital products and package architecture",
    ],
    image: "/strategy/phase-2.jpeg",
    imageAlt: "Geothermal landscape at Kerlingarfjöll",
  },
  {
    num: "03",
    short: "Lead",
    window: "12 – 24 Months",
    title: "Optimise, Automate & Lead",
    tagline:
      "Turn the CCO function into a strategic growth engine powered by data & AI.",
    description:
      "Turn the CCO function into a strategic growth engine powered by data and AI — pricing decisions automated, CLV modelled, loyalty live.",
    priorities: [
      "Commercial operating model maturity assessment",
      "Advanced revenue management (dynamic pricing)",
      "CLV tracking & predictive modelling",
      "Market strategy & loyalty program",
      "Digital experience development with AI adoption",
    ],
    image: "/strategy/phase-3.png",
    imageAlt: "Geothermal architecture",
  },
];

export function PhasesPlan() {
  const [active, setActive] = useState(0);
  const phase = PHASES[active];

  return (
    <section
      id="plan"
      className="scroll-mt-24 border-b border-bluelagoon-line bg-bluelagoon-water-100"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <div className="grid items-end gap-6 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
              <span className="tabular-nums">02</span>
              <span className="ml-3 text-bluelagoon-muted/80">
                The 24-Month Plan
              </span>
            </p>
            <h2 className="mt-3 max-w-2xl font-loft text-[2rem] font-bold leading-[1.1] tracking-tight text-bluelagoon-midnight md:text-[2.5rem]">
              Profitable growth, better guest experience, stronger channel
              control.
            </h2>
          </div>
          <p className="text-right text-xs uppercase tracking-[0.22em] text-bluelagoon-muted md:col-span-5">
            Select a phase
          </p>
        </div>

        {/* Phase switcher */}
        <ol className="mt-10 grid gap-3 md:grid-cols-3">
          {PHASES.map((p, i) => {
            const isActive = i === active;
            return (
              <li key={p.num}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`w-full border p-6 text-left transition md:p-7 ${
                    isActive
                      ? "border-bluelagoon-midnight bg-bluelagoon-midnight text-bluelagoon-snow"
                      : "border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-ink hover:border-bluelagoon-blue-300 hover:bg-bluelagoon-water-200"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`font-loft text-2xl font-bold tabular-nums tracking-tight ${
                        isActive
                          ? "text-bluelagoon-snow"
                          : "text-bluelagoon-moss-600"
                      }`}
                    >
                      {p.num}
                    </span>
                    <span
                      className={`font-accent text-[12px] uppercase tracking-[0.2em] ${
                        isActive
                          ? "text-bluelagoon-snow/70"
                          : "text-bluelagoon-muted"
                      }`}
                    >
                      {p.window}
                    </span>
                  </div>
                  <p
                    className={`mt-5 font-loft text-lg font-bold tracking-tight ${
                      isActive
                        ? "text-bluelagoon-snow"
                        : "text-bluelagoon-midnight"
                    }`}
                  >
                    {p.short}
                  </p>
                  <p
                    className={`mt-1 text-[16px] leading-relaxed ${
                      isActive
                        ? "text-bluelagoon-snow/75"
                        : "text-bluelagoon-ink/70"
                    }`}
                  >
                    {p.tagline}
                  </p>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Active phase detail */}
        <div key={phase.num} className="surface-fade mt-10 grid gap-0 overflow-hidden border border-bluelagoon-line bg-bluelagoon-paper md:grid-cols-12">
          <div className="relative min-h-64 md:col-span-4 md:min-h-0">
            <img
              src={`${BASE}${phase.image}`}
              alt={phase.imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="md:col-span-8 grid gap-8 p-8 md:gap-10 md:p-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
                Phase {phase.num} · {phase.window}
              </p>
              <h3 className="mt-3 font-loft text-2xl font-bold leading-tight tracking-tight text-bluelagoon-midnight md:text-3xl">
                {phase.title}
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-bluelagoon-ink/75">
                {phase.description}
              </p>
            </div>
            <ol className="lg:col-span-7 flex flex-col">
              {phase.priorities.map((priority, i) => (
                <li
                  key={priority}
                  className={`grid grid-cols-[2.25rem_1fr] items-start gap-5 py-4 md:gap-7 ${
                    i === 0
                      ? "border-t border-bluelagoon-line"
                      : "border-t border-bluelagoon-line/60"
                  }`}
                >
                  <span className="font-loft text-sm font-semibold tabular-nums tracking-tight text-bluelagoon-moss-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[16px] leading-relaxed text-bluelagoon-ink/85">
                    {priority}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
