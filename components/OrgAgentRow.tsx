"use client";

import {
  ACCENT_DOT_BG,
  KIND_LABEL,
  type AccentColor,
  type Agent,
} from "@/lib/data/orgChart";
import { slugify } from "@/lib/data/orgAgents";

interface OrgAgentRowProps {
  agent: Agent;
  accent: AccentColor;
  onSelect: (agent: Agent) => void;
  demoTag?: string;
}

export function OrgAgentRow({
  agent,
  accent,
  onSelect,
  demoTag,
}: OrgAgentRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(agent)}
      aria-haspopup="dialog"
      aria-label={`${agent.name} — open details`}
      data-demo-org-agent={demoTag}
      data-agent-id={slugify(agent.name)}
      className="-mx-2 flex w-[calc(100%+1rem)] gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-bluelagoon-mist/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight"
    >
      <span
        className={`pulse-soft mt-1.5 h-2 w-2 flex-none rounded-full ${ACCENT_DOT_BG[accent]}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-loft text-sm font-semibold text-bluelagoon-midnight">
            {agent.name}
          </span>
          <span className="rounded-full border border-bluelagoon-line bg-bluelagoon-mist px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-bluelagoon-muted">
            {KIND_LABEL[agent.kind]}
          </span>
          <span className="text-xs text-bluelagoon-muted">{agent.role}</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-bluelagoon-ink/85">
          <span className="font-semibold text-bluelagoon-midnight">Now:</span>{" "}
          {agent.now}
        </p>
        <p className="text-xs leading-relaxed text-bluelagoon-muted">
          <span className="font-semibold">Done:</span> {agent.done}
        </p>
      </div>
      <span
        aria-hidden
        className="mt-2 flex-none text-bluelagoon-muted/70 transition group-hover:text-bluelagoon-midnight"
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
  );
}
