import Link from "next/link";

export default function InternalHome() {
  return (
    <>
      <div className="space-y-12">
        <section className="pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
            Internal tooling · live
          </p>
          <h1 className="mt-2 font-loft text-4xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-5xl">
            For the airline.
          </h1>
          <p className="mt-3 max-w-2xl text-bluelagoon-ink/85">
            Two prototypes for the people who keep Blue Lagoon flying — ops
            controllers and dispatch on one side, cabin and flight crew on the
            other. Humans approve, AI proposes.
          </p>
        </section>

        <Link
          href="/org"
          className="surface-card surface-card-hover group flex items-center gap-4 rounded-2xl border-l-4 border-l-bluelagoon-volcanic p-5 transition"
        >
          <span
            aria-hidden
            className="pulse-soft h-2.5 w-2.5 flex-none rounded-full bg-bluelagoon-volcanic"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
              Organization · live
            </p>
            <p className="mt-0.5 text-sm font-medium text-bluelagoon-ink/90 sm:text-base">
              The airline, agent by agent — nine departments working in
              parallel.
            </p>
          </div>
          <span className="flex-none text-sm font-semibold text-bluelagoon-midnight transition group-hover:translate-x-0.5">
            See the full org →
          </span>
        </Link>

        <section className="grid gap-5 md:grid-cols-3">
          <Link
            href="/internal/ops"
            className="surface-card surface-card-hover rounded-2xl border-l-4 border-l-bluelagoon-golden p-6 transition"
          >
            <h2 className="font-loft text-xl font-bold text-bluelagoon-midnight">
              Operations Control Center
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-bluelagoon-ink/85">
              Reasoning on top of network ops control. Ranked recovery options
              with explicit tradeoffs — crew duty hours, slots, EU261 — all in
              scope.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-bluelagoon-midnight">
              Open →
            </span>
          </Link>

          <Link
            href="/internal/crew"
            className="surface-card surface-card-hover rounded-2xl border-l-4 border-l-bluelagoon-fiery p-6 transition"
          >
            <h2 className="font-loft text-xl font-bold text-bluelagoon-midnight">
              Crew copilot
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-bluelagoon-ink/85">
              Procedural Q&amp;A grounded in a synthetic Blue Lagoon OM-A
              excerpt. Cites the section it's pulling from. Says &ldquo;I don't
              know&rdquo; when it doesn't.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-bluelagoon-midnight">
              Open →
            </span>
          </Link>

          <Link
            href="/internal/telemetry"
            className="surface-card surface-card-hover rounded-2xl border-l-4 border-l-bluelagoon-lilac p-6 transition"
          >
            <h2 className="font-loft text-xl font-bold text-bluelagoon-midnight">
              Telemetry
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-bluelagoon-ink/85">
              Token and cache aggregation across every chat surface. The cost
              and latency story, in numbers, this browser only.
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-bluelagoon-midnight">
              Open →
            </span>
          </Link>
        </section>
      </div>
    </>
  );
}
