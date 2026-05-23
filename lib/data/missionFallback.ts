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
  prompt:
    "Pump 2 of 4 on the silica filtration cycle is showing elevated vibration. Plan the maintenance before it stops unscheduled during peak.",
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
        agentRole: "CycleMon telemetry anomaly detection",
        departmentId: "geothermal-engineering",
        departmentName: "Geothermal & Facility Engineering",
        accent: "volcanic",
        thinking:
          "Pump 2 vibration is climbing past the early-warning band. The trend matches the bearing-wear signature we saw on Pump 4 last winter — likely 4 to 7 days from unscheduled stop.",
        proposedAction: "Raise to Defects Triage with the CycleMon trend.",
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
        fromAccent: "volcanic",
        toAgentId: "defects-triage",
        toAgentName: "Defects Triage",
        toAccent: "volcanic",
        reason: "Decide whether to schedule a swap now or keep watching.",
        payload:
          "Pump 2 of 4, silica cycle. Vibration trend +14% over 72h. Bearing-wear signature, 4–7 days to likely stop.",
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
        agentRole: "Open work-order ranking",
        departmentId: "geothermal-engineering",
        departmentName: "Geothermal & Facility Engineering",
        accent: "volcanic",
        thinking:
          "The trend is unambiguous and the consequence of an unscheduled stop during peak (15:00–18:00) is a 30% outdoor capacity hit. This is 'schedule now', not 'watch'.",
        proposedAction: "Hand to Service Planner to find a minimal-impact window.",
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
        fromAccent: "volcanic",
        toAgentId: "service-planner",
        toAgentName: "Service Planner",
        toAccent: "volcanic",
        reason: "Need a maintenance window that avoids the peak guest waves.",
        payload:
          "Pump 2 swap, bearing kit on hand. Need ~8h with the cycle drained around the pump.",
      },
    },
    { type: "tool_use_start", id: "fbk-5", name: "activate_agent" },
    {
      type: "tool_result",
      tool_use_id: "fbk-5",
      name: "activate_agent",
      result: {
        agentId: "service-planner",
        agentName: "Service Planner",
        agentKind: "ai",
        agentRole: "Maintenance window scheduling",
        departmentId: "geothermal-engineering",
        departmentName: "Geothermal & Facility Engineering",
        accent: "volcanic",
        thinking:
          "Tuesday 23:00 → Thursday 07:00 gives a 2-night overnight window — both lagoon-closed periods. The cycle can run on three pumps overnight with no daytime capacity impact.",
        proposedAction:
          "Propose Tue 23:00 → Thu 07:00 window; check capacity impact with Spa Operations.",
        confidence: "high",
      },
    },
    { type: "tool_use_start", id: "fbk-6", name: "handoff" },
    {
      type: "tool_result",
      tool_use_id: "fbk-6",
      name: "handoff",
      result: {
        fromAgentId: "service-planner",
        fromAgentName: "Service Planner",
        fromAccent: "volcanic",
        toAgentId: "spa-floor-lead",
        toAgentName: "Spa Floor Lead",
        toAccent: "crisp",
        reason: "Confirm zero daytime capacity impact on the proposed window.",
        payload:
          "Window: Tue 23:00 → Thu 07:00. Cycle runs on 3 of 4 pumps overnight. Daytime capacity unchanged.",
      },
    },
    { type: "tool_use_start", id: "fbk-7", name: "activate_agent" },
    {
      type: "tool_result",
      tool_use_id: "fbk-7",
      name: "activate_agent",
      result: {
        agentId: "spa-floor-lead",
        agentName: "Spa Floor Lead",
        agentKind: "human",
        agentRole: "Capacity & floor flow owner",
        departmentId: "spa-operations",
        departmentName: "Spa Operations",
        accent: "crisp",
        thinking:
          "Overnight window means no guest impact. Three pumps will hold the cycle through the closed period — water clarity will be fine for opening Thursday.",
        proposedAction: "Approve the window from a capacity standpoint; defer sign-off to Engineering.",
        confidence: "high",
      },
    },
    { type: "tool_use_start", id: "fbk-8", name: "handoff" },
    {
      type: "tool_result",
      tool_use_id: "fbk-8",
      name: "handoff",
      result: {
        fromAgentId: "spa-floor-lead",
        fromAgentName: "Spa Floor Lead",
        fromAccent: "crisp",
        toAgentId: "lead-engineer",
        toAgentName: "Lead Engineer",
        toAccent: "volcanic",
        reason: "Spa Operations cleared the window; need the engineering sign-off.",
        payload:
          "Work order: replace Pump 2 bearing assembly, Tue 23:00 → Thu 07:00. Crew briefed, kit on hand.",
      },
    },
    { type: "tool_use_start", id: "fbk-9", name: "request_human" },
    {
      type: "tool_result",
      tool_use_id: "fbk-9",
      name: "request_human",
      result: {
        awaitingHuman: true,
        ownerName: "Lead Engineer",
        ownerRole: "Sign-off authority for work orders",
        ownerAgentId: "lead-engineer",
        ownerDepartmentId: "geothermal-engineering",
        ownerAccent: "volcanic",
        question:
          "Approve Pump 2 bearing replacement on the silica filtration cycle, Tue 23:00 → Thu 07:00?",
        options: ["Approve", "Reject", "Redirect with comment"],
        toolUseId: "fbk-9",
      },
    },
    { type: "tool_use_start", id: "fbk-10", name: "complete_mission" },
    {
      type: "tool_result",
      tool_use_id: "fbk-10",
      name: "complete_mission",
      result: {
        summary:
          "Pump 2 of the silica filtration cycle scheduled for bearing replacement on the Tue 23:00 → Thu 07:00 overnight window. Cycle runs on three pumps through the closed period; daytime capacity preserved. Unscheduled stoppage during peak avoided.",
        agentsInvolved: [
          "predictive-maintenance",
          "defects-triage",
          "service-planner",
          "spa-floor-lead",
          "lead-engineer",
        ],
        outcome: "resolved",
      },
    },
  ],
};
