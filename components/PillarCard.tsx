import Link from "next/link";

export interface PillarCardProps {
  title: string;
  pillar: string;
  href: string;
  blurb: string;
  bullets: string[];
  cta: string;
  accent: "crisp" | "boreal" | "golden" | "fiery" | "volcanic" | "lilac";
}

const accentBar = {
  crisp: "bg-bluelagoon-crisp",
  boreal: "bg-bluelagoon-boreal",
  golden: "bg-bluelagoon-golden",
  fiery: "bg-bluelagoon-fiery",
  volcanic: "bg-bluelagoon-volcanic",
  lilac: "bg-bluelagoon-lilac",
};

export function PillarCard({
  title,
  pillar,
  href,
  blurb,
  bullets,
  cta,
  accent,
}: PillarCardProps) {
  return (
    <Link
      href={href}
      className="surface-card surface-card-hover group relative flex flex-col overflow-hidden rounded-2xl p-7 transition"
    >
      <span
        className={`absolute inset-x-0 top-0 h-1 ${accentBar[accent]}`}
        aria-hidden
      />
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${accentBar[accent]}`} />
        {pillar}
      </div>
      <h3 className="mt-3 font-loft text-2xl font-bold tracking-tight text-bluelagoon-midnight">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-bluelagoon-ink/85">
        {blurb}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-bluelagoon-ink/85">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-2 h-1 w-1 flex-none rounded-full bg-bluelagoon-muted" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-bluelagoon-midnight transition group-hover:gap-2">
        {cta}
        <span aria-hidden>→</span>
      </div>
    </Link>
  );
}
