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
          src="/hero-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* darkening gradient — keeps the photo visible on the right, copy legible on the left */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-bluelagoon-midnight/95 via-bluelagoon-midnight/75 to-bluelagoon-midnight/20"
        />
        {/* subtle bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bluelagoon-deep/40 to-transparent"
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-aurora">
            An AI-first concept
          </p>
          <h1 className="mt-3 max-w-3xl font-loft text-5xl font-extrabold leading-[1.05] tracking-tight text-bluelagoon-snow md:text-7xl">
            Blue Lagoon, Reimagined with AI
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-bluelagoon-snow/80 md:text-lg">
            The same thesis pointed at two audiences. Pick a side — both are
            live, both interactive. The strategy doc sits on top of both.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/?demo=1"
              className="inline-flex items-center justify-center rounded-full bg-bluelagoon-snow px-5 py-2.5 text-sm font-semibold text-bluelagoon-midnight shadow-sm transition hover:bg-bluelagoon-aurora hover:shadow-md"
            >
              Run the demo (90s) →
            </Link>
            <Link
              href="/?demo=fallback"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-bluelagoon-snow backdrop-blur-sm transition hover:bg-white/15"
            >
              Run in offline mode
            </Link>
            <p className="text-xs text-bluelagoon-snow/60">
              90-second guided tour. Offline mode uses canned responses — no
              API key needed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
