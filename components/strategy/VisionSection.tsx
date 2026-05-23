import Image from "next/image";

interface Pillar {
  num: string;
  title: string;
  detail: string;
}

const PILLARS: Pillar[] = [
  {
    num: "01",
    title: "Leader in Geothermal Wellness",
    detail:
      "The original geothermal spa, defended through pricing power, premium positioning, and rate integrity across channels.",
  },
  {
    num: "02",
    title: "National Network Established",
    detail:
      "A coherent portfolio across Blue Lagoon, Retreat, Kerlingarfjöll and future properties — one brand, many entrances.",
  },
  {
    num: "03",
    title: "Skin Science Products Globally Available",
    detail:
      "Science-backed retail line carried beyond Iceland through curated wholesale, direct e-commerce and partner programs.",
  },
];

export function VisionSection() {
  return (
    <section
      id="vision"
      className="scroll-mt-24 border-b border-bluelagoon-line bg-bluelagoon-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
              <span className="tabular-nums">01</span>
              <span className="ml-3 text-bluelagoon-muted/80">
                Commercial Vision
              </span>
            </p>
            <h2 className="mt-4 font-loft text-[2rem] font-bold leading-[1.1] tracking-tight text-bluelagoon-midnight md:text-[2.5rem]">
              The great advantage we already hold.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-bluelagoon-ink/75">
              Bláa Lónið has something no competitor can build, a world-famous
              brand, a national wellness network in development, and a
              science-backed global product line. The 24-month plan compounds
              that into commercial leverage.
            </p>
            <p className="mt-4 max-w-md text-xs text-bluelagoon-muted">
              Assumptions from last interview &amp; Blue Lagoon HF. website.
            </p>

            <ol className="mt-8 grid gap-4 md:mt-10">
              {PILLARS.map((p) => (
                <li
                  key={p.num}
                  className="surface-card surface-card-hover grid grid-cols-[3rem_1fr] gap-5 p-5 md:grid-cols-[3.5rem_1fr] md:gap-6 md:p-6"
                >
                  <p className="font-loft text-base font-semibold tabular-nums tracking-tight text-bluelagoon-moss-600">
                    {p.num}
                  </p>
                  <div>
                    <h3 className="font-loft text-base font-bold tracking-tight text-bluelagoon-midnight md:text-lg">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-bluelagoon-ink/80">
                      {p.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:col-span-7 flex items-center justify-center">
            <div className="relative aspect-[4/5] w-full max-w-2xl overflow-hidden rounded-lg">
              <Image
                src="/strategy/vision.png"
                alt="Guests in the Blue Lagoon"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
