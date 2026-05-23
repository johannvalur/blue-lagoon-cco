import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import {
  ALL_AGENT_IDS,
  ALL_DEPARTMENT_IDS,
  HUMAN_OWNER_NAMES,
  findAgent,
} from "@/lib/data/orgAgents";
import type { AccentColor, AgentKind } from "@/lib/data/orgChart";

export type Confidence = "low" | "medium" | "high";
export type MissionOutcome = "resolved" | "escalated" | "blocked";

export interface ActivateAgentResult {
  agentId: string;
  agentName: string;
  agentKind: AgentKind;
  agentRole: string;
  departmentId: string;
  departmentName: string;
  accent: AccentColor;
  thinking: string;
  proposedAction: string;
  confidence: Confidence;
}

export interface HandoffResult {
  fromAgentId: string;
  fromAgentName: string;
  fromAccent: AccentColor;
  toAgentId: string;
  toAgentName: string;
  toAccent: AccentColor;
  reason: string;
  payload: string;
}

export interface RequestHumanResult {
  awaitingHuman: true;
  ownerName: string;
  ownerRole: string;
  ownerAgentId: string;
  ownerDepartmentId: string;
  ownerAccent: AccentColor;
  question: string;
  options: string[];
  toolUseId: string;
}

export interface CompleteMissionResult {
  summary: string;
  agentsInvolved: string[];
  outcome: MissionOutcome;
}

export type MissionToolResult =
  | ActivateAgentResult
  | HandoffResult
  | RequestHumanResult
  | CompleteMissionResult;

export const MISSION_TOOL_NAMES = [
  "activate_agent",
  "handoff",
  "request_human",
  "complete_mission",
] as const;
export type MissionToolName = (typeof MISSION_TOOL_NAMES)[number];

// ---- activate_agent ----------------------------------------------------

export function makeActivateAgentTool(
  onResult?: (r: ActivateAgentResult) => void,
) {
  return betaTool({
    name: "activate_agent",
    description:
      "Light up one agent in the org chart and narrate its in-character thinking plus a one-line proposed action. Call this whenever an agent steps into the mission. agentId and departmentId must be drawn from the enums below.",
    inputSchema: {
      type: "object",
      properties: {
        agentId: { type: "string", enum: [...ALL_AGENT_IDS] },
        departmentId: { type: "string", enum: [...ALL_DEPARTMENT_IDS] },
        thinking: {
          type: "string",
          description:
            "One or two short sentences in the agent's voice. Distinct per agent — Predictive Maintenance is sensor-driven and numeric; Concierge is warm; Lead Engineer is cautious.",
        },
        proposedAction: {
          type: "string",
          description: "One short clause stating what the agent wants to do.",
        },
        confidence: { type: "string", enum: ["low", "medium", "high"] },
      },
      required: ["agentId", "departmentId", "thinking", "proposedAction", "confidence"],
    } as const,
    run: (args) => {
      const agentId = String(args.agentId);
      const ref = findAgent(agentId);
      if (!ref) {
        return JSON.stringify({
          ok: false,
          reason: `Unknown agentId "${agentId}". Pick from the enum.`,
        });
      }
      const result: ActivateAgentResult = {
        agentId,
        agentName: ref.agent.name,
        agentKind: ref.agent.kind,
        agentRole: ref.agent.role,
        departmentId: ref.department.id,
        departmentName: ref.department.name,
        accent: ref.department.accent,
        thinking: String(args.thinking),
        proposedAction: String(args.proposedAction),
        confidence: args.confidence as Confidence,
      };
      onResult?.(result);
      return JSON.stringify({ ok: true });
    },
  });
}

// ---- handoff -----------------------------------------------------------

export function makeHandoffTool(onResult?: (r: HandoffResult) => void) {
  return betaTool({
    name: "handoff",
    description:
      "Hand a piece of work from one agent to another. Use this between activations whenever responsibility shifts across the org. Both agentIds must be in the enum.",
    inputSchema: {
      type: "object",
      properties: {
        fromAgentId: { type: "string", enum: [...ALL_AGENT_IDS] },
        toAgentId: { type: "string", enum: [...ALL_AGENT_IDS] },
        reason: {
          type: "string",
          description: "Why the handoff is happening. One short clause.",
        },
        payload: {
          type: "string",
          description: "What is being passed across (a finding, a recommendation, a number).",
        },
      },
      required: ["fromAgentId", "toAgentId", "reason", "payload"],
    } as const,
    run: (args) => {
      const fromId = String(args.fromAgentId);
      const toId = String(args.toAgentId);
      const from = findAgent(fromId);
      const to = findAgent(toId);
      if (!from || !to) {
        return JSON.stringify({
          ok: false,
          reason: `Unknown agentId in handoff: from=${fromId}, to=${toId}.`,
        });
      }
      const result: HandoffResult = {
        fromAgentId: fromId,
        fromAgentName: from.agent.name,
        fromAccent: from.department.accent,
        toAgentId: toId,
        toAgentName: to.agent.name,
        toAccent: to.department.accent,
        reason: String(args.reason),
        payload: String(args.payload),
      };
      onResult?.(result);
      return JSON.stringify({ ok: true });
    },
  });
}

// ---- request_human -----------------------------------------------------

export function makeRequestHumanTool(
  onResult?: (r: Omit<RequestHumanResult, "toolUseId">) => void,
) {
  return betaTool({
    name: "request_human",
    description:
      "Pause the mission and ask a human-in-the-loop owner for a decision. After this call you MUST stop emitting further tool calls or text — the runtime will halt the mission until the human replies. ownerName must be in the enum (HITL or human owners only).",
    inputSchema: {
      type: "object",
      properties: {
        ownerName: { type: "string", enum: [...HUMAN_OWNER_NAMES] },
        question: {
          type: "string",
          description: "The decision the human is being asked to make.",
        },
        options: {
          type: "array",
          items: { type: "string" },
          description:
            "2–4 short options, e.g. ['Approve', 'Reject', 'Redirect with comment'].",
          minItems: 2,
          maxItems: 4,
        },
      },
      required: ["ownerName", "question", "options"],
    } as const,
    run: (args) => {
      const ownerName = String(args.ownerName);
      const ref = findAgent(ownerName);
      if (!ref) {
        return JSON.stringify({
          ok: false,
          reason: `Unknown ownerName "${ownerName}". Pick from the enum.`,
        });
      }
      const result: Omit<RequestHumanResult, "toolUseId"> = {
        awaitingHuman: true,
        ownerName,
        ownerRole: ref.agent.role,
        ownerAgentId: ref.agentId,
        ownerDepartmentId: ref.department.id,
        ownerAccent: ref.department.accent,
        question: String(args.question),
        options: (args.options as string[]) ?? [],
      };
      onResult?.(result);
      return JSON.stringify({ ok: true });
    },
  });
}

// ---- complete_mission --------------------------------------------------

export function makeCompleteMissionTool(
  onResult?: (r: CompleteMissionResult) => void,
) {
  return betaTool({
    name: "complete_mission",
    description:
      "End the mission. Call this once when the chain has reached a stable outcome. Provide a one-paragraph summary and the list of agents that touched the mission.",
    inputSchema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "One paragraph summarising what was done and the outcome.",
        },
        agentsInvolved: {
          type: "array",
          items: { type: "string", enum: [...ALL_AGENT_IDS] },
          description: "Every agentId that was activated during the mission.",
        },
        outcome: { type: "string", enum: ["resolved", "escalated", "blocked"] },
      },
      required: ["summary", "agentsInvolved", "outcome"],
    } as const,
    run: (args) => {
      const result: CompleteMissionResult = {
        summary: String(args.summary),
        agentsInvolved: (args.agentsInvolved as string[]) ?? [],
        outcome: args.outcome as MissionOutcome,
      };
      onResult?.(result);
      return JSON.stringify({ ok: true });
    },
  });
}
