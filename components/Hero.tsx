import { IntentSearch } from "./IntentSearch";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-bluelagoon-line bg-bluelagoon-paper">
      {/* subtle aurora-tinted top band — keeps it light and airline-magazine */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bluelagoon-crisp/15 via-bluelagoon-boreal/5 to-transparent"
      />
      <div className="relative grid gap-10 px-8 py-14 md:grid-cols-5 md:px-14 md:py-20">
        <div className="md:col-span-3">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-bluelagoon-line bg-bluelagoon-cloud px-3 py-1 text-xs font-semibold uppercase tracking-widest text-bluelagoon-midnight">
            <span className="h-1.5 w-1.5 rounded-full bg-bluelagoon-crisp pulse-soft" />
            AI-first concept · prototype
          </p>
          <h1 className="font-loft text-5xl font-extrabold leading-[1.05] tracking-tight text-bluelagoon-midnight md:text-6xl">
            Flights to Europe, Iceland and North&nbsp;America
            <span className="text-bluelagoon-muted">,</span>
            <br />
            <span className="text-bluelagoon-ink/80">
              booked the way you actually plan a trip.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-bluelagoon-ink/85 md:text-lg">
            We&rsquo;ve already got the structural advantage — the North
            Atlantic hub, the brand, a small enough footprint to actually
            rebuild around AI. This is what that could look like, end to end.
          </p>
        </div>
        <div className="md:col-span-2 md:pl-2">
          <IntentSearch />
        </div>
      </div>

      {/* trust strip, mimics the airline-website pattern under the search */}
      <div className="relative grid grid-cols-2 gap-4 border-t border-bluelagoon-line bg-bluelagoon-cloud px-8 py-5 text-sm text-bluelagoon-ink/80 md:grid-cols-4 md:px-14">
        <div>
          <span className="font-semibold text-bluelagoon-midnight">
            North Atlantic stopover
          </span>
          <span className="block text-xs text-bluelagoon-muted">
            Hub-as-superpower
          </span>
        </div>
        <div>
          <span className="font-semibold text-bluelagoon-midnight">Saga Club</span>
          <span className="block text-xs text-bluelagoon-muted">
            Loyalty, redesigned
          </span>
        </div>
        <div>
          <span className="font-semibold text-bluelagoon-midnight">
            Ops + AI
          </span>
          <span className="block text-xs text-bluelagoon-muted">
            Humans approve. AI proposes.
          </span>
        </div>
        <div>
          <span className="font-semibold text-bluelagoon-midnight">
            AI-native
          </span>
          <span className="block text-xs text-bluelagoon-muted">
            Real-time generation
          </span>
        </div>
      </div>
    </section>
  );
}
