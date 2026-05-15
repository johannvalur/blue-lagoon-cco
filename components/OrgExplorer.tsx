"use client";

import { useMemo, useState } from "react";
import type { AccentColor, Agent, Department } from "@/lib/data/orgChart";
import { OrgDepartmentCard } from "./OrgDepartmentCard";
import { AgentDetailDrawer } from "./AgentDetailDrawer";

interface OrgMetrics {
  agentsOnline: number;
  decisionsPerHour: number;
  humansInLoop: string;
}

interface OrgExplorerProps {
  chart: Department[];
  metrics: OrgMetrics;
}

interface SelectedAgent {
  agent: Agent;
  accent: AccentColor;
  departmentName: string;
}

export function OrgExplorer({ chart, metrics }: OrgExplorerProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<SelectedAgent | null>(null);

  const allCollapsed = useMemo(
    () => chart.every((d) => collapsed[d.id]),
    [chart, collapsed],
  );

  function toggleAll() {
    if (allCollapsed) {
      setCollapsed({});
    } else {
      const next: Record<string, boolean> = {};
      for (const d of chart) next[d.id] = true;
      setCollapsed(next);
    }
  }

  function toggleOne(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <section className="pt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
          Organization · live
        </p>
        <h1 className="mt-2 font-loft text-4xl font-extrabold tracking-tight text-bluelagoon-midnight md:text-5xl">
          The airline, agent by agent.
        </h1>
        <p className="mt-3 max-w-2xl text-bluelagoon-ink/85">
          Nine departments, dozens of agents, working in parallel. Some are AI,
          some are humans-in-the-loop, some are humans owning the call. AI
          proposes; humans dispose.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <dl className="inline-flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-bluelagoon-line bg-bluelagoon-cloud px-5 py-3 text-sm">
            <div className="flex items-baseline gap-2">
              <dt className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Agents online
              </dt>
              <dd className="font-loft text-xl font-bold text-bluelagoon-midnight">
                {metrics.agentsOnline}
              </dd>
            </div>
            <span aria-hidden className="h-4 w-px bg-bluelagoon-line" />
            <div className="flex items-baseline gap-2">
              <dt className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Decisions / hour
              </dt>
              <dd className="font-loft text-xl font-bold text-bluelagoon-midnight">
                {metrics.decisionsPerHour}
              </dd>
            </div>
            <span aria-hidden className="h-4 w-px bg-bluelagoon-line" />
            <div className="flex items-baseline gap-2">
              <dt className="text-xs font-semibold uppercase tracking-widest text-bluelagoon-muted">
                Humans in loop
              </dt>
              <dd className="font-loft text-xl font-bold text-bluelagoon-midnight">
                {metrics.humansInLoop}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={toggleAll}
            className="rounded-full border border-bluelagoon-line bg-bluelagoon-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider text-bluelagoon-midnight transition hover:bg-bluelagoon-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight"
          >
            {allCollapsed ? "Expand all" : "Collapse all"}
          </button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {chart.map((department, index) => (
          <OrgDepartmentCard
            key={department.id}
            department={department}
            collapsed={!!collapsed[department.id]}
            onToggleCollapsed={() => toggleOne(department.id)}
            onSelectAgent={(agent) =>
              setSelected({
                agent,
                accent: department.accent,
                departmentName: department.name,
              })
            }
            demoFirstAgent={index === 0}
          />
        ))}
      </section>

      <AgentDetailDrawer
        agent={selected?.agent ?? null}
        accent={selected?.accent ?? "boreal"}
        departmentName={selected?.departmentName ?? ""}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
