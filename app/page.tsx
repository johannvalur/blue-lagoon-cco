import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* Full-bleed hero */}
      <section className="relative flex flex-1 items-center overflow-hidden">
        <Image
          src="/hero-banner-lagoon.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover -scale-x-100"
        />
        {/* darkening gradient — slate-navy wash over the photo, keeps copy legible on the left */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-bluelagoon-blue-800/95 via-bluelagoon-blue-700/75 to-bluelagoon-blue-500/25"
        />
        {/* subtle bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bluelagoon-blue-800/50 to-transparent"
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <p className="font-accent text-[11px] font-medium uppercase tracking-[0.22em] text-bluelagoon-water-400">
            An AI-first concept
          </p>
          <h1 className="heading-display mt-4 max-w-3xl text-5xl text-bluelagoon-water-100 md:text-7xl">
            Blue Lagoon, Reimagined with AI
          </h1>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-bluelagoon-water-100/85 md:text-lg">
            A geothermal spa and resort, rebuilt around conversation —
            booking, treatments and hotel nights in one thread; real-time
            care when the steam stops; copilots for every role on site.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/?demo=1"
              className="font-accent inline-flex items-center justify-center bg-bluelagoon-moss-600 px-6 py-3 text-sm font-medium tracking-[0.02em] text-white transition hover:bg-bluelagoon-moss-700"
            >
              Run the demo (90s) →
            </Link>
            <Link
              href="/?demo=fallback"
              className="font-accent inline-flex items-center justify-center border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium tracking-[0.02em] text-bluelagoon-water-100 transition hover:bg-white/15"
            >
              Run in offline mode
            </Link>
          </div>
          <p className="font-accent mt-4 text-[11px] uppercase tracking-[0.18em] text-bluelagoon-water-300/80">
            Live API · or canned responses, no key needed
          </p>
        </div>
      </section>
    </>
  );
}
