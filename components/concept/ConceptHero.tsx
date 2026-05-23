import Image from "next/image";

export function ConceptHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-53px)] items-center overflow-hidden bg-bluelagoon-midnight text-bluelagoon-snow sm:min-h-[calc(100dvh-65px)]">
      <Image
        src="https://images.ctfassets.net/w65k7w0nsb8q/1VEzIcXy42Gp5eFe4uqJor/8c292500a2a1b4092c47e1bc2889eca9/DSC08079.jpg?w=3840&q=75&fm=webp"
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
          The first geothermal spa rebuilt around AI
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-bluelagoon-snow/80 md:text-lg">
          What an AI-native Blue Lagoon — one conversational concierge, one
          calm floor copilot, every role grounded in our own corpus — could
          look like, end to end. Written for an internal leadership audience.
        </p>

        <p className="mt-10 max-w-2xl text-xs text-bluelagoon-snow/55 md:text-[13px]">
          12–15 minute read · ~3,500 words · Internal, not for distribution
        </p>
      </div>
    </section>
  );
}
