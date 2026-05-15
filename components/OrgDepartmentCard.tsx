"use client";

import { useId } from "react";
import {
  ACCENT_BORDER_LEFT,
  ACCENT_DOT_BG,
  type Agent,
  type Department,
} from "@/lib/data/orgChart";
import { OrgAgentRow } from "./OrgAgentRow";

interface OrgDepartmentCardProps {
  department: Department;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onSelectAgent: (agent: Agent) => void;
  demoFirstAgent?: boolean;
}

export function OrgDepartmentCard({
  department,
  collapsed,
  onToggleCollapsed,
  onSelectAgent,
  demoFirstAgent,
}: OrgDepartmentCardProps) {
  const { name, tagline, accent, agents } = department;
  const regionId = useId();
  const decisionsToday = agents.reduce(
    (sum, a) => sum + a.metrics.decisionsToday,
    0,
  );

  return (
    <article
      data-department-id={department.id}
      className={`surface-card flex flex-col rounded-2xl border-l-4 ${ACCENT_BORDER_LEFT[accent]} p-6`}
    >
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls={regionId}
        className="-m-2 flex items-start gap-3 rounded-xl p-2 text-left transition hover:bg-bluelagoon-mist/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full ${ACCENT_DOT_BG[accent]}`}
            />
            Department
          </div>
          <h3 className="mt-2 font-loft text-xl font-bold tracking-tight text-bluelagoon-midnight">
            {name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-bluelagoon-ink/85">
            {tagline}
          </p>
        </div>
        <span
          aria-hidden
          className={`mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-bluelagoon-line bg-bluelagoon-paper text-bluelagoon-muted transition-transform duration-200 motion-reduce:transition-none ${
            collapsed ? "" : "rotate-90"
          }`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3,1.5 7,5 3,8.5" />
          </svg>
        </span>
      </button>

      <div
        id={regionId}
        className="mt-5 border-t border-bluelagoon-line pt-5"
      >
        {collapsed ? (
          <p className="text-xs text-bluelagoon-muted">
            <span className="font-semibold text-bluelagoon-midnight">
              {agents.length} agents
            </span>{" "}
            · {decisionsToday.toLocaleString()} decisions today
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {agents.map((agent, index) => (
              <OrgAgentRow
                key={agent.name}
                agent={agent}
                accent={accent}
                onSelect={onSelectAgent}
                demoTag={demoFirstAgent && index === 0 ? "first" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
