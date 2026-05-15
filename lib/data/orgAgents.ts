import { ORG_CHART, type Agent, type Department } from "./orgChart";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface AgentRef {
  agent: Agent;
  department: Department;
  agentId: string;
}

const AGENT_INDEX: Map<string, AgentRef> = (() => {
  const map = new Map<string, AgentRef>();
  for (const department of ORG_CHART) {
    for (const agent of department.agents) {
      map.set(slugify(agent.name), { agent, department, agentId: slugify(agent.name) });
    }
  }
  return map;
})();

export function findAgent(agentId: string): AgentRef | undefined {
  return AGENT_INDEX.get(agentId);
}

export function findAgentByName(name: string): AgentRef | undefined {
  return AGENT_INDEX.get(slugify(name));
}

export const ALL_AGENT_IDS: readonly string[] = Array.from(AGENT_INDEX.keys());

export const ALL_DEPARTMENT_IDS: readonly string[] = ORG_CHART.map((d) => d.id);

export const HUMAN_OWNER_NAMES: readonly string[] = ORG_CHART.flatMap((d) =>
  d.agents.filter((a) => a.kind === "human" || a.kind === "hitl").map((a) => a.name),
);
