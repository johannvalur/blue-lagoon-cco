import { IntentSearch } from "./IntentSearch";

export function Hero() {
  return (
    <section className="relative overflow-hidden border border-bluelagoon-line bg-bluelagoon-paper">
      {/* soft lagoon-water wash at the top — mirrors the spa brand's
          atmospheric photography palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bluelagoon-water-300 via-bluelagoon-water-200 to-transparent"
      />
      <div className="relative grid gap-12 px-8 py-16 md:grid-cols-5 md:px-16 md:py-24">
        <div className="md:col-span-3">
          <p className="font-accent mb-6 inline-flex items-center gap-2 border border-bluelagoon-blue-200 bg-bluelagoon-paper px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-bluelagoon-blue-500">
            <span className="h-1.5 w-1.5 rounded-full bg-bluelagoon-moss-600 pulse-soft" />
            AI-first concept · prototype
          </p>
          <h1 className="heading-display text-5xl text-bluelagoon-blue-500 md:text-7xl">
            Geothermal water, a hotel night, a quiet ritual
            <span className="text-bluelagoon-muted">,</span>
            <br />
            <span className="text-bluelagoon-blue-400">
              planned the way you actually think about a visit.
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-bluelagoon-ink md:text-lg">
            We&rsquo;ve already got the structural advantage — the lagoon
            itself, two on-site hotels, a small enough footprint to actually
            rebuild around AI. This is what that could look like, end to end.
          </p>
        </div>
        <div className="md:col-span-2 md:pl-2">
          <IntentSearch />
        </div>
      </div>

      {/* trust strip — sits on a faint water tint with the brand's signature
          generous spacing */}
      <div className="font-accent relative grid grid-cols-2 gap-6 border-t border-bluelagoon-line bg-bluelagoon-water-200 px-8 py-7 text-sm text-bluelagoon-ink md:grid-cols-4 md:px-16">
        <div>
          <span className="block font-medium uppercase tracking-[0.14em] text-bluelagoon-blue-500">
            Lagoon &amp; hotels
          </span>
          <span className="mt-1 block text-xs text-bluelagoon-muted">
            Silica · The Retreat
          </span>
        </div>
        <div>
          <span className="block font-medium uppercase tracking-[0.14em] text-bluelagoon-blue-500">
            Insider
          </span>
          <span className="mt-1 block text-xs text-bluelagoon-muted">
            Loyalty, redesigned
          </span>
        </div>
        <div>
          <span className="block font-medium uppercase tracking-[0.14em] text-bluelagoon-blue-500">
            Ops + AI
          </span>
          <span className="mt-1 block text-xs text-bluelagoon-muted">
            Humans approve. AI proposes.
          </span>
        </div>
        <div>
          <span className="block font-medium uppercase tracking-[0.14em] text-bluelagoon-blue-500">
            AI-native
          </span>
          <span className="mt-1 block text-xs text-bluelagoon-muted">
            Real-time generation
          </span>
        </div>
      </div>
    </section>
  );
}
