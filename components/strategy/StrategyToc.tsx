"use client";

import { useEffect, useState } from "react";

export interface StrategyTocEntry {
  id: string;
  num: string;
  title: string;
}

const ENTRIES: StrategyTocEntry[] = [
  { id: "vision", num: "01", title: "Commercial Vision" },
  { id: "plan", num: "02", title: "24-Month Plan" },
  { id: "structure", num: "03", title: "Commercial Structure" },
  { id: "kpis", num: "04", title: "KPIs & Control Towers" },
  { id: "culture", num: "05", title: "Result-Driven Culture" },
  { id: "sales-pricing", num: "06", title: "Sales & Pricing" },
  { id: "risks", num: "07", title: "Risks & Mitigation" },
  { id: "closing", num: "08", title: "Closing Summary" },
];

function useActiveSection(): string {
  const [activeId, setActiveId] = useState<string>(ENTRIES[0].id);

  useEffect(() => {
    const targets = ENTRIES.map((e) => document.getElementById(e.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    let frame = 0;
    function update() {
      frame = 0;
      const threshold = window.innerHeight * 0.35;
      let next = ENTRIES[0].id;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= threshold) {
          next = el.id;
        }
      }
      setActiveId(next);
    }
    function schedule() {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return activeId;
}

export function StrategyTocBar() {
  const activeId = useActiveSection();

  return (
    <nav
      aria-label="Strategy sections"
      className="sticky top-[53px] z-30 border-b border-bluelagoon-line bg-bluelagoon-paper/95 backdrop-blur-md"
    >
      <ol className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-6 pt-8 pb-4 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ENTRIES.map((e) => {
          const active = e.id === activeId;
          return (
            <li key={e.id} className="flex-none">
              <a
                href={`#${e.id}`}
                className={`inline-flex items-baseline gap-1.5 border-b-2 pb-1 transition ${
                  active
                    ? "border-bluelagoon-moss-600 text-bluelagoon-midnight"
                    : "border-transparent text-bluelagoon-muted hover:text-bluelagoon-midnight"
                }`}
              >
                <span
                  className={`font-semibold tabular-nums ${
                    active ? "text-bluelagoon-moss-600" : ""
                  }`}
                >
                  {e.num}
                </span>
                <span className={active ? "font-semibold" : "font-medium"}>
                  {e.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
