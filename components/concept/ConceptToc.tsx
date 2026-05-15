"use client";

import { useEffect, useState } from "react";
import type { SectionAccent } from "./SectionHeader";

export interface TocEntry {
  id: string;
  num: string;
  title: string;
  accent: SectionAccent;
}

function useActiveSection(entries: TocEntry[]): string {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? "");

  useEffect(() => {
    const targets = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    let frame = 0;
    function update() {
      frame = 0;
      const threshold = window.innerHeight * 0.35;
      let next = entries[0]?.id ?? "";
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
  }, [entries]);

  return activeId;
}

export function ConceptTocBar({ entries }: { entries: TocEntry[] }) {
  const activeId = useActiveSection(entries);

  return (
    <nav
      aria-label="Concept sections"
      className="sticky top-[60px] z-30 -mx-6 border-b border-bluelagoon-line/80 bg-bluelagoon-snow/95 backdrop-blur-md lg:hidden"
    >
      <ol className="flex gap-4 overflow-x-auto px-6 py-3 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {entries.map((e) => {
          const active = e.id === activeId;
          return (
            <li key={e.id} className="flex-none">
              <a
                href={`#${e.id}`}
                className={`inline-flex items-baseline gap-1.5 transition ${
                  active
                    ? "text-bluelagoon-midnight"
                    : "text-bluelagoon-muted hover:text-bluelagoon-midnight"
                }`}
              >
                <span className="font-semibold tabular-nums">{e.num}</span>
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

export function ConceptTocRail({ entries }: { entries: TocEntry[] }) {
  const activeId = useActiveSection(entries);

  return (
    <aside className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <nav aria-label="Concept sections">
        <p className="mb-5 font-loft text-xs font-semibold tracking-tight text-bluelagoon-muted">
          On this page
        </p>
        <ol className="space-y-1.5 border-l border-bluelagoon-line">
          {entries.map((e) => {
            const active = e.id === activeId;
            return (
              <li key={e.id}>
                <a
                  href={`#${e.id}`}
                  className={`group -ml-px flex items-baseline gap-2.5 border-l-2 py-1.5 pl-4 text-xs transition ${
                    active
                      ? "border-l-bluelagoon-midnight text-bluelagoon-midnight"
                      : "border-l-transparent text-bluelagoon-muted hover:border-l-bluelagoon-line/80 hover:text-bluelagoon-midnight"
                  }`}
                >
                  <span
                    className={`flex-none font-semibold tabular-nums ${
                      active ? "text-bluelagoon-midnight" : ""
                    }`}
                  >
                    {e.num}
                  </span>
                  <span
                    className={`font-medium leading-snug ${
                      active ? "font-semibold" : ""
                    }`}
                  >
                    {e.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
