import type {
  ActivateAgentResult,
  HandoffResult,
  RequestHumanResult,
  CompleteMissionResult,
} from "@/lib/tools/missionTools";

export type FallbackEvent =
  | { type: "tool_use_start"; id: string; name: string }
  | {
      type: "tool_result";
      tool_use_id: string;
      name: "activate_agent";
      result: ActivateAgentResult;
    }
  | {
      type: "tool_result";
      tool_use_id: string;
      name: "handoff";
      result: HandoffResult;
    }
  | {
      type: "tool_result";
      tool_use_id: string;
      name: "request_human";
      result: RequestHumanResult;
    }
  | {
      type: "tool_result";
      tool_use_id: string;
      name: "complete_mission";
      result: CompleteMissionResult;
    };

export interface FallbackMission {
  prompt: string;
  events: FallbackEvent[];
}

export const FALLBACK_MISSION: FallbackMission = {
  prompt: "TF-FIA APU bearing wear is trending. Plan the swap before it grounds the aircraft.",
  events: [
    { type: "tool_use_start", id: "fbk-1", name: "activate_agent" },
    {
      type: "tool_result",
      tool_use_id: "fbk-1",
      name: "activate_agent",
      result: {
        agentId: "predictive-maintenance",
        agentName: "Predictive Maintenance",
        agentKind: "ai",
        agentRole: "Sensor-stream anomaly detection",
        departmentId: "maintenance",
        departmentName: "Maintenance & Engineering",
        accent: "fiery",
        thinking:
          "APU bearing wear on TF-FIA is crossing my threshold. ACMS trend matches the pre-failure pattern from TF-ICE last winter.",
        proposedAction: "Raise to Defects Triage with the trend data.",
        confidence: "high",
      },
    },
    { type: "tool_use_start", id: "fbk-2", name: "handoff" },
    {
      type: "tool_result",
      tool_use_id: "fbk-2",
      name: "handoff",
      result: {
        fromAgentId: "predictive-maintenance",
        fromAgentName: "Predictive Maintenance",
        fromAccent: "fiery",
        toAgentId: "defects-triage",
        toAgentName: "Defects Triage",
        toAccent: "fiery",
        reason: "Confirm MEL avoidance and propose scheduling slot.",
        payload: "TF-FIA APU bearing trend, 11 days ahead of MEL trigger.",
      },
    },
    { type: "tool_use_start", id: "fbk-3", name: "activate_agent" },
    {
      type: "tool_result",
      tool_use_id: "fbk-3",
      name: "activate_agent",
      result: {
        agentId: "defects-triage",
        agentName: "Defects Triage",
        agentKind: "ai",
        agentRole: "Open MEL ranking",
        departmentId: "maintenance",
        departmentName: "Maintenance & Engineering",
        accent: "fiery",
        thinking:
          "Bearing wear is 11 days ahead of MEL — we have room to plan. Tuesday's hangar slot is the cleanest path before the JFK rotation.",
        proposedAction: "Schedule TF-FIA into Tuesday A-check, swap TF-ICE forward.",
        confidence: "high",
      },
    },
    { type: "tool_use_start", id: "fbk-4", name: "handoff" },
    {
      type: "tool_result",
      tool_use_id: "fbk-4",
      name: "handoff",
      result: {
        fromAgentId: "defects-triage",
        fromAgentName: "Defects Triage",
        fromAccent: "fiery",
        toAgentId: "hangar-planner",
        toAgentName: "Hangar Planner",
        toAccent: "fiery",
        reason: "Need to confirm slot Tuesday and reshuffle TF-ICE.",
        payload: "Proposed: TF-FIA → A-check Tue, TF-ICE → Sunday slot.",
      },
    },
    { type: "tool_use_start", id: "fbk-5", name: "activate_agent" },
    {
      type: "tool_result",
      tool_use_id: "fbk-5",
      name: "activate_agent",
      result: {
        agentId: "hangar-planner",
        agentName: "Hangar Planner",
        agentKind: "ai",
        agentRole: "Tail rotation scheduling",
        departmentId: "maintenance",
        departmentName: "Maintenance & Engineering",
        accent: "fiery",
        thinking:
          "Tuesday slot 3 holds. TF-ICE re-pinned to Sunday, no other rotations affected. APU bearing replacement bundled in.",
        proposedAction: "Hold the swap pending Lead Engineer sign-off.",
        confidence: "high",
      },
    },
    { type: "tool_use_start", id: "fbk-6", name: "request_human" },
    {
      type: "tool_result",
      tool_use_id: "fbk-6",
      name: "request_human",
      result: {
        awaitingHuman: true,
        ownerName: "Lead Engineer",
        ownerRole: "Sign-off authority",
        ownerAgentId: "lead-engineer",
        ownerDepartmentId: "maintenance",
        ownerAccent: "fiery",
        question:
          "Approve TF-FIA → A-check Tuesday, swap TF-ICE into Sunday slot, bundle APU bearing replacement?",
        options: ["Approve", "Reject", "Redirect with comment"],
        toolUseId: "fbk-6",
      },
    },
    { type: "tool_use_start", id: "fbk-7", name: "complete_mission" },
    {
      type: "tool_result",
      tool_use_id: "fbk-7",
      name: "complete_mission",
      result: {
        summary:
          "TF-FIA scheduled for Tuesday A-check; APU bearing replacement bundled. TF-ICE absorbed into Sunday slot with no downstream impact.",
        agentsInvolved: [
          "predictive-maintenance",
          "defects-triage",
          "hangar-planner",
          "lead-engineer",
        ],
        outcome: "resolved",
      },
    },
  ],
};
