"use client";

import Image from "next/image";
import { useState } from "react";

interface Rhythm {
  num: string;
  cadence: string;
  qualifier: string;
  focus: string;
  output: string;
}

const RHYTHMS: Rhythm[] = [
  {
    num: "01",
    cadence: "Weekly",
    qualifier: "Speed",
    focus:
      "Revenue pace, funnel leakage, campaign ROAS, website conversion, CRM activation.",
    output: "3–5 actions with named owners and due dates.",
  },
  {
    num: "02",
    cadence: "Monthly",
    qualifier: "Accountability",
    focus:
      "Revenue quality, channel profitability, repeat-rate progress, NPS and commercial capacity.",
    output: "Variance narrative, resourcing decisions, course-correction.",
  },
  {
    num: "03",
    cadence: "Quarterly",
    qualifier: "Strategic direction",
    focus:
      "Strategic bets, market prioritisation, brand consideration, CLV and direct-channel trajectory.",
    output:
      "KPIs refreshed and investment shifted to the highest-return opportunities.",
  },
];

interface Ingredient {
  num: string;
  title: string;
  detail: string;
}

const INGREDIENTS: Ingredient[] = [
  {
    num: "01",
    title: "Standards & Values",
    detail:
      "Define excellent. Growth never erodes premium positioning, guest trust or brand equity.",
  },
  {
    num: "02",
    title: "Conversations & Feedback",
    detail:
      "Weekly rhythm, monthly accountability, win/loss reviews — change in weeks, not quarters.",
  },
  {
    num: "03",
    title: "Ownership & Leadership",
    detail:
      "Named owners with decision rights, data and resources. Leaders model follow-through.",
  },
  {
    num: "04",
    title: "Recognition & Improvement",
    detail:
      "Celebrate impact and growth; address misses early. Start, stop, simplify or scale every cycle.",
  },
];

const CYCLE = [
  { step: "Measure", detail: "KPI · NPS · margin · CLV" },
  { step: "Learn", detail: "Root cause + guest voice" },
  { step: "Decide", detail: "Trade-off + owner" },
  { step: "Improve", detail: "Test · simplify · scale" },
];

const ACCOUNTABILITY = [
  {
    num: "01",
    title: "Name the owner",
    detail:
      "Each KPI and initiative has one accountable lead. Shared work is fine; unclear ownership is not.",
  },
  {
    num: "02",
    title: "Give decision rights",
    detail:
      "Owners know what they can decide, when to escalate, and which guardrails are non-negotiable.",
  },
  {
    num: "03",
    title: "Close the loop",
    detail:
      "Performance conversations end with a decision, an action, a due date and visible follow-through.",
  },
];

export function CultureSection() {
  const [rhythmIdx, setRhythmIdx] = useState(0);
  const rhythm = RHYTHMS[rhythmIdx];

  return (
    <section
      id="culture"
      className="scroll-mt-24 border-b border-bluelagoon-line bg-bluelagoon-paper"
    >
      <div className="relative isolate overflow-hidden bg-bluelagoon-midnight text-bluelagoon-snow">
        <Image
          src="/strategy/culture.png"
          alt="Aerial of geothermal architecture"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-bluelagoon-midnight via-bluelagoon-midnight/90 to-bluelagoon-midnight/20"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-6">
              <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-snow/65">
                <span className="tabular-nums">05</span>
                <span className="ml-3 text-bluelagoon-snow/55">
                  Result-Driven Culture
                </span>
              </p>
              <h2 className="mt-4 font-loft text-[2rem] font-bold leading-[1.1] tracking-tight md:text-[2.5rem]">
                Culture is built into routines, not posters.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-bluelagoon-snow/85">
                A result-driven culture means every team understands the
                commercial goals, knows which KPIs they influence, reviews
                performance regularly, and uses data to improve decisions and
                execution.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">

        {/* Performance rhythm switcher */}
        <div className="mt-16">
          <div className="grid items-end gap-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
                Performance rhythm
              </p>
              <h3 className="mt-3 font-loft text-2xl font-bold tracking-tight text-bluelagoon-midnight">
                Diagnose, decide, act — on a predictable cadence.
              </h3>
            </div>
            <p className="md:col-span-5 md:text-right text-xs uppercase tracking-[0.22em] text-bluelagoon-muted">
              Pick a cadence
            </p>
          </div>

          <ol className="mt-8 grid gap-3 md:grid-cols-3">
            {RHYTHMS.map((r, i) => {
              const isActive = i === rhythmIdx;
              return (
                <li key={r.num}>
                  <button
                    type="button"
                    onClick={() => setRhythmIdx(i)}
                    aria-pressed={isActive}
                    className={`w-full border p-6 text-left transition md:p-7 ${
                      isActive
                        ? "border-bluelagoon-midnight bg-bluelagoon-midnight text-bluelagoon-snow"
                        : "border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-ink hover:border-bluelagoon-blue-300 hover:bg-bluelagoon-water-100"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span
                        className={`font-loft text-xl font-bold tabular-nums tracking-tight ${
                          isActive
                            ? "text-bluelagoon-moss-400"
                            : "text-bluelagoon-moss-600"
                        }`}
                      >
                        {r.num}
                      </span>
                      <span
                        className={`font-accent text-[12px] uppercase tracking-[0.18em] ${
                          isActive
                            ? "text-bluelagoon-snow/70"
                            : "text-bluelagoon-muted"
                        }`}
                      >
                        {r.qualifier}
                      </span>
                    </div>
                    <p
                      className={`mt-5 font-loft text-xl font-bold tracking-tight ${
                        isActive
                          ? "text-bluelagoon-snow"
                          : "text-bluelagoon-midnight"
                      }`}
                    >
                      {r.cadence}
                    </p>
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            key={rhythm.num}
            className="surface-fade mt-6 grid gap-8 border border-bluelagoon-line bg-bluelagoon-water-100 p-8 md:grid-cols-12 md:p-10"
          >
            <div className="md:col-span-6">
              <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
                Focus
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-bluelagoon-ink/85">
                {rhythm.focus}
              </p>
            </div>
            <div className="md:col-span-6 md:border-l md:border-bluelagoon-line md:pl-8">
              <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-muted">
                Output
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-bluelagoon-ink/85">
                {rhythm.output}
              </p>
            </div>
          </div>
        </div>

        {/* Key Ingredients */}
        <div className="mt-20 grid items-center gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7">
            <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
              Key ingredients
            </p>
            <h3 className="mt-3 font-loft text-2xl font-bold tracking-tight text-bluelagoon-midnight md:text-3xl">
              Standards, feedback, ownership, recognition.
            </h3>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {INGREDIENTS.map((g) => (
                <li
                  key={g.num}
                  className="surface-card surface-card-hover flex h-full flex-col p-6"
                >
                  <p className="font-loft text-base font-bold tabular-nums tracking-tight text-bluelagoon-moss-600">
                    {g.num}
                  </p>
                  <h4 className="mt-4 font-loft text-lg font-bold leading-tight tracking-tight text-bluelagoon-midnight">
                    {g.title}
                  </h4>
                  <p className="mt-3 text-[16px] leading-relaxed text-bluelagoon-ink/80">
                    {g.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_-15px_rgba(15,42,68,0.2)]">
              <Image
                src="/strategy/culture3.png"
                alt="Blue Lagoon Mineral Mask at the lagoon"
                fill
                sizes="(min-width: 768px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Empowered Accountability */}
        <div className="mt-20">
          {/* Header */}
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-moss-600">
                Empowered accountability
              </p>
              <h3 className="mt-3 font-loft text-2xl font-bold leading-tight tracking-tight text-bluelagoon-midnight md:text-3xl">
                Ownership, authority, data and support — aligned.
              </h3>
            </div>
            <p className="md:col-span-5 md:pt-8 text-[16px] leading-relaxed text-bluelagoon-ink/75">
              Balance results with values, protect premium guest experience
              and brand trust.
            </p>
          </div>

          {/* Three principles */}
          <ol className="mt-10 grid gap-px bg-bluelagoon-line md:grid-cols-3">
            {ACCOUNTABILITY.map((a) => (
              <li
                key={a.num}
                className="flex flex-col bg-bluelagoon-water-100 p-8 md:p-10"
              >
                <span className="font-loft text-4xl font-bold tabular-nums tracking-tight text-bluelagoon-moss-600/40">
                  {a.num}
                </span>
                <h4 className="mt-6 font-loft text-xl font-bold leading-tight tracking-tight text-bluelagoon-midnight">
                  {a.title}
                </h4>
                <p className="mt-3 text-[16px] leading-relaxed text-bluelagoon-ink/75">
                  {a.detail}
                </p>
              </li>
            ))}
          </ol>

          {/* The cycle — horizontal flow */}
          <div className="mt-px bg-bluelagoon-midnight px-8 py-8 md:px-10">
            <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/50">
              The cycle
            </p>
            <ol className="mt-5 grid grid-cols-2 gap-6 md:grid-cols-4">
              {CYCLE.map((c, i) => (
                <li key={c.step} className="flex items-start gap-3">
                  <span className="mt-0.5 font-loft text-xs font-semibold tabular-nums text-bluelagoon-moss-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="block font-loft text-sm font-bold tracking-tight text-bluelagoon-snow">
                      {c.step}
                    </span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-bluelagoon-snow/55">
                      {c.detail}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
