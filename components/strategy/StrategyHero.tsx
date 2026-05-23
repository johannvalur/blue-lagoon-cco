const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function StrategyHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-53px)] items-center overflow-hidden bg-bluelagoon-midnight text-bluelagoon-snow sm:min-h-[calc(100dvh-65px)]">
      <video
        src={`${BASE}/strategy/hero.mp4`}
        poster={`${BASE}/strategy/hero-poster.png`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-bluelagoon-midnight/95 via-bluelagoon-midnight/70 to-bluelagoon-midnight/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bluelagoon-midnight to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-bluelagoon-snow/65">
          Bláa Lónið · 24 month roadmap
        </p>
        <h1 className="mt-6 max-w-3xl font-loft text-[2.75rem] font-bold leading-[1.02] tracking-tight md:text-7xl">
          A strategic commercial plan for Bláa Lónið.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-bluelagoon-snow/85 md:text-lg">
          Profitable growth, better guest experience, smarter use of data &amp;
          AI, stronger control of channels, and rising customer lifetime value.
        </p>

        <dl className="mt-12 grid max-w-2xl grid-cols-1 gap-4 border-t border-bluelagoon-snow/20 pt-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <dt className="text-[12px] font-semibold uppercase tracking-[0.22em] text-bluelagoon-snow/55">
                Candidate
              </dt>
              <dd className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-snow">
                Jóhann Valur Sævarsson
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-semibold uppercase tracking-[0.22em] text-bluelagoon-snow/55">
                Role
              </dt>
              <dd className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-snow">
                CCO
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-semibold uppercase tracking-[0.22em] text-bluelagoon-snow/55">
                Dated
              </dt>
              <dd className="mt-2 font-loft text-base font-semibold tracking-tight text-bluelagoon-snow">
                May 2026
              </dd>
            </div>
        </dl>
      </div>
    </section>
  );
}
