const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ClosingSection() {
  return (
    <section
      id="closing"
      className="relative isolate scroll-mt-24 overflow-hidden bg-bluelagoon-midnight text-bluelagoon-snow"
    >
      <video
        src={`${BASE}/strategy/closing.mp4`}
        poster={`${BASE}/strategy/closing-poster.png`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-bluelagoon-midnight/90 via-bluelagoon-midnight/60 to-bluelagoon-midnight/20"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-32 md:px-8 md:py-48">
        <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/65">
          Q&amp;A · Closing summary
        </p>
        <h2 className="mt-4 font-loft text-[2.75rem] font-bold leading-[1.05] tracking-tight md:text-[4rem] lg:text-[5rem]">
          From listening to leading,
          <br />in 24 months.
        </h2>

        <ol className="mt-14 flex flex-col gap-6 md:flex-row md:gap-12">
          <li className="border-l-2 border-bluelagoon-moss-400 pl-5">
            <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/55">
              Days 0–90
            </p>
            <p className="mt-2 font-loft text-lg font-semibold tracking-tight">
              Listen, diagnose, plan.
            </p>
          </li>
          <li className="border-l-2 border-bluelagoon-moss-400 pl-5">
            <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/55">
              Months 3–12
            </p>
            <p className="mt-2 font-loft text-lg font-semibold tracking-tight">
              Disciplined execution, measurable growth.
            </p>
          </li>
          <li className="border-l-2 border-bluelagoon-moss-400 pl-5">
            <p className="font-accent text-[12px] uppercase tracking-[0.22em] text-bluelagoon-snow/55">
              Months 12–24
            </p>
            <p className="mt-2 font-loft text-lg font-semibold tracking-tight">
              Data &amp; AI-driven commercial engine.
            </p>
          </li>
        </ol>

        <p className="mt-20 max-w-xl border-t border-bluelagoon-snow/15 pt-8 text-xs text-bluelagoon-snow/55">
          Strategic Commercial Plan · CCO Candidate · Jóhann Valur Sævarsson
          · May 2026
        </p>
      </div>
    </section>
  );
}
