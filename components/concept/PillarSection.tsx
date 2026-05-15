import type { ReactNode } from "react";

export type PillarAccent = "crisp" | "golden" | "volcanic" | "boreal";

export interface PillarSectionProps {
  num: string;
  title: string;
  children: ReactNode;
}

export function PillarSection({ num, title, children }: PillarSectionProps) {
  const id = `pillar-${num.replace(".", "-")}`;
  return (
    <section id={id} className="mt-14 scroll-mt-24 first:mt-10">
      <p className="font-loft text-sm font-semibold tracking-tight text-bluelagoon-muted">
        <span className="tabular-nums">{num}</span>
      </p>
      <h3 className="mt-2 font-loft text-2xl font-bold leading-tight tracking-tight text-bluelagoon-midnight md:text-[1.75rem]">
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}
