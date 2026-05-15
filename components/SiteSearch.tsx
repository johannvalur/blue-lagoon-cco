"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchEntry = {
  href: string;
  title: string;
  section: "Customer" | "Internal" | "Strategy" | "Org" | "Site";
  description: string;
  keywords?: string[];
};

const INDEX: SearchEntry[] = [
  {
    href: "/",
    title: "Home",
    section: "Site",
    description: "An AI-first Blue Lagoon concept — pick a side and explore.",
    keywords: ["landing", "start", "overview", "demo"],
  },
  {
    href: "/concept",
    title: "Concept",
    section: "Strategy",
    description:
      "The written strategy: AI-first thesis, four-pillar bet, operating model, 36-month roadmap, risks.",
    keywords: ["strategy", "thesis", "pillars", "roadmap", "risks", "EASA"],
  },
  {
    href: "/customer",
    title: "Trip concierge",
    section: "Customer",
    description:
      "Plan flights, hotels, cars, packages — and stay with the trip after it's booked. One conversation.",
    keywords: [
      "customer",
      "passenger",
      "traveller",
      "book",
      "flight",
      "hotel",
      "car",
      "package",
      "stopover",
      "layover",
      "iceland",
      "search",
      "itinerary",
      "companion",
      "during",
      "in-flight",
      "ground",
      "disruption",
    ],
  },
  {
    href: "/customer/loyalty",
    title: "Saga Club",
    section: "Customer",
    description: "Loyalty redesigned — Saga tiers, points, perks.",
    keywords: ["loyalty", "saga", "club", "tier", "points", "miles"],
  },
  {
    href: "/customer/status",
    title: "Flight status",
    section: "Customer",
    description: "Check the status of any flight (e.g. FI631).",
    keywords: ["status", "flight", "delay", "gate", "FI"],
  },
  {
    href: "/customer/trips",
    title: "My trips",
    section: "Customer",
    description: "Your held bookings and upcoming travel.",
    keywords: ["bookings", "reservations", "upcoming", "held"],
  },
  {
    href: "/internal",
    title: "For the airline",
    section: "Internal",
    description:
      "Internal tooling: Operations Control Center, crew copilot, telemetry.",
    keywords: ["internal", "back office", "airline", "tooling"],
  },
  {
    href: "/internal/ops",
    title: "Operations Control Center",
    section: "Internal",
    description:
      "IROPS reasoning with ranked recovery options — crew duty, slots, EU261.",
    keywords: ["ops", "irops", "recovery", "disruption", "eu261", "slots"],
  },
  {
    href: "/internal/crew",
    title: "Crew copilot",
    section: "Internal",
    description: "SOP Q&A grounded in a synthetic OM-A excerpt.",
    keywords: ["crew", "sop", "om-a", "procedures", "manual"],
  },
  {
    href: "/internal/telemetry",
    title: "Token & cache telemetry",
    section: "Internal",
    description: "Cost and latency across every chat surface.",
    keywords: ["telemetry", "tokens", "cost", "latency", "cache"],
  },
  {
    href: "/org",
    title: "Organization",
    section: "Org",
    description: "The airline, agent by agent — nine departments in parallel.",
    keywords: ["org", "departments", "agents", "structure"],
  },
];

const SECTION_ACCENT: Record<SearchEntry["section"], string> = {
  Customer: "text-bluelagoon-crisp",
  Internal: "text-bluelagoon-golden",
  Strategy: "text-bluelagoon-aurora",
  Org: "text-bluelagoon-volcanic",
  Site: "text-bluelagoon-muted",
};

function score(entry: SearchEntry, q: string): number {
  const needle = q.toLowerCase();
  const title = entry.title.toLowerCase();
  if (title === needle) return 100;
  if (title.startsWith(needle)) return 80;
  if (title.includes(needle)) return 60;
  if ((entry.keywords ?? []).join(" ").toLowerCase().includes(needle)) return 45;
  if (entry.href.toLowerCase().includes(needle)) return 35;
  if (entry.description.toLowerCase().includes(needle)) return 20;
  return 0;
}

export function SiteSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return INDEX.map((e) => ({ entry: e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((x) => x.entry);
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [results]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[active];
      if (target) go(target.href);
    }
  }

  const showResults = open && results.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bluelagoon-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label="Search the site"
          placeholder="Search…"
          className="h-9 w-full rounded-full border border-bluelagoon-line bg-bluelagoon-paper pl-9 pr-3 text-sm text-bluelagoon-ink outline-none transition placeholder:text-bluelagoon-muted focus:border-bluelagoon-midnight focus:ring-2 focus:ring-bluelagoon-midnight/15"
        />
      </div>

      {showResults && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-bluelagoon-line bg-bluelagoon-paper py-1 shadow-xl"
        >
          {results.map((r, i) => (
            <li key={r.href}>
              <button
                type="button"
                onClick={() => go(r.href)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition ${
                  i === active
                    ? "bg-bluelagoon-mist"
                    : "hover:bg-bluelagoon-mist/60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-semibold text-bluelagoon-midnight">
                      {r.title}
                    </span>
                    <span
                      className={`flex-none text-[10px] font-semibold uppercase tracking-[0.18em] ${SECTION_ACCENT[r.section]}`}
                    >
                      {r.section}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-bluelagoon-ink/70">
                    {r.description}
                  </p>
                </div>
                <span aria-hidden className="flex-none pt-0.5 text-bluelagoon-muted">
                  →
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
