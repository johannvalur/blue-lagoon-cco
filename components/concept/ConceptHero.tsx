import Image from "next/image";

const LIVERY_IMAGE =
  "https://images.contentstack.io/v3/assets/blt279b94f6e22ca52e/blt3940b8d634d00f9a/643d55f9ea4ed2292f8d354e/livery-3.jpg";

export function ConceptHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-53px)] items-center overflow-hidden bg-bluelagoon-midnight text-bluelagoon-snow sm:min-h-[calc(100dvh-65px)]">
      <Image
        src={LIVERY_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-bluelagoon-midnight/95 via-bluelagoon-midnight/70 to-bluelagoon-midnight/20"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-bluelagoon-snow/65">
          An AI-first concept · v0.1
        </p>
        <h1 className="mt-6 max-w-3xl font-loft text-[2.75rem] font-bold leading-[1.02] tracking-tight md:text-7xl">
          The First Airline on AutoPilot with AI
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-bluelagoon-snow/80 md:text-lg">
          What an AI-native carrier built on Blue Lagoon&rsquo;s structural
          advantages — North Atlantic hub, brand, scale — could look like, end
          to end. Written for an internal leadership audience.
        </p>

        <p className="mt-10 max-w-2xl text-xs text-bluelagoon-snow/55 md:text-[13px]">
          12–15 minute read · ~3,500 words · Internal, not for distribution
        </p>
      </div>
    </section>
  );
}
