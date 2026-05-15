export type SectionAccent =
  | "aurora"
  | "bright"
  | "fiery"
  | "boreal"
  | "golden"
  | "volcanic"
  | "midnight";

export interface SectionHeaderProps {
  num: string;
  title: string;
  kicker?: string;
  accent: SectionAccent;
  id: string;
}

export function SectionHeader({
  num,
  title,
  kicker,
  id,
}: SectionHeaderProps) {
  const showKicker =
    kicker !== undefined &&
    kicker.length > 0 &&
    kicker.toLowerCase() !== title.toLowerCase();

  return (
    <header id={id} className="mb-10 mt-24 scroll-mt-24 first:mt-6">
      <div
        aria-hidden
        className="mb-8 h-px w-full bg-bluelagoon-line"
      />
      <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
        <span className="tabular-nums">{num}</span>
        {showKicker ? (
          <span className="ml-3 text-bluelagoon-muted/80">{kicker}</span>
        ) : null}
      </p>
      <h2 className="mt-4 max-w-3xl font-loft text-[2rem] font-bold leading-[1.1] tracking-tight text-bluelagoon-midnight md:text-[2.5rem]">
        {title}
      </h2>
    </header>
  );
}
