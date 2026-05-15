import { NextRequest } from "next/server";
import { getAnthropic, MODEL_OPUS } from "@/lib/anthropic";
import { MISSION_SYSTEM_PROMPT } from "@/lib/prompts/internal/mission";
import {
  makeActivateAgentTool,
  makeHandoffTool,
  makeRequestHumanTool,
  makeCompleteMissionTool,
  type ActivateAgentResult,
  type HandoffResult,
  type CompleteMissionResult,
  type RequestHumanResult,
} from "@/lib/tools/missionTools";
import { findAgent } from "@/lib/data/orgAgents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  | { type: "tool_result"; tool_use_id: string; content: string };

interface MissionMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

interface MissionDecision {
  tool_use_id: string;
  verdict: "approve" | "reject" | "redirect";
  comment?: string;
}

type MissionRequest =
  | { kind: "start"; missionId: string; mission: string }
  | {
      kind: "resume";
      missionId: string;
      transcript: MissionMessage[];
      decision: MissionDecision;
    };

interface UsageSnapshot {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
}

export async function POST(req: NextRequest) {
  let body: MissionRequest;
  try {
    body = (await req.json()) as MissionRequest;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (body.kind === "start") {
    if (!body.mission || typeof body.mission !== "string") {
      return jsonError("mission is required for kind=start", 400);
    }
  } else if (body.kind === "resume") {
    if (!Array.isArray(body.transcript) || body.transcript.length === 0) {
      return jsonError("transcript is required for kind=resume", 400);
    }
    if (!body.decision || typeof body.decision.tool_use_id !== "string") {
      return jsonError("decision.tool_use_id is required for kind=resume", 400);
    }
  } else {
    return jsonError("kind must be 'start' or 'resume'", 400);
  }

  let client: ReturnType<typeof getAnthropic>;
  try {
    client = getAnthropic();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "ANTHROPIC_API_KEY is not set.";
    return jsonError(message, 500);
  }

  const encoder = new TextEncoder();
  const missionId = body.missionId;
  const initialMessages: MissionMessage[] =
    body.kind === "start"
      ? [{ role: "user", content: body.mission }]
      : buildResumeMessages(body.transcript, body.decision);

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      };
      try {
        await runMissionLoop({ client, send, messages: initialMessages, missionId });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error.";
        send({ type: "error", error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function jsonError(message: string, status: number) {
  return new Response(
    JSON.stringify({ type: "error", error: message }) + "\n",
    {
      status,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

function buildResumeMessages(
  transcript: MissionMessage[],
  decision: MissionDecision,
): MissionMessage[] {
  const verdict = decision.verdict.toUpperCase();
  const commentPart = decision.comment ? `  Comment: ${decision.comment}` : "";
  const decisionText = `The human's decision: ${verdict}.${commentPart}`;
  const toolResultMessage: MissionMessage = {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: decision.tool_use_id,
        content: decisionText,
      },
    ],
  };
  return [...transcript, toolResultMessage];
}

interface RunArgs {
  client: ReturnType<typeof getAnthropic>;
  send: (obj: unknown) => void;
  messages: MissionMessage[];
  missionId: string;
}

async function runMissionLoop({ client, send, messages, missionId }: RunArgs) {
  const activateQ: ActivateAgentResult[] = [];
  const handoffQ: HandoffResult[] = [];
  const completeQ: CompleteMissionResult[] = [];

  const tools = [
    makeActivateAgentTool((r) => activateQ.push(r)),
    makeHandoffTool((r) => handoffQ.push(r)),
    makeRequestHumanTool(), // never consumed via runner — we intercept before generateToolResponse
    makeCompleteMissionTool((r) => completeQ.push(r)),
  ];

  const drainByName = (name: string) => {
    if (name === "activate_agent") return activateQ.shift();
    if (name === "handoff") return handoffQ.shift();
    if (name === "complete_mission") return completeQ.shift();
    return undefined;
  };

  const runner = client.beta.messages.toolRunner({
    model: MODEL_OPUS,
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: MISSION_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: messages as unknown as Parameters<
      typeof client.beta.messages.toolRunner
    >[0]["messages"],
    tools,
    ...{ output_config: { effort: "medium" } },
    stream: true,
  });

  let lastUsage: UsageSnapshot = {};
  // Track every assistant message's content blocks so we can rebuild the transcript on pause.
  const assistantHistory: MissionMessage[] = [];
  let pausedTranscript: MissionMessage[] | null = null;

  outer: for await (const messageStream of runner) {
    interface PendingTool {
      id: string;
      name: string;
      partialJson: string;
      args?: Record<string, unknown>;
    }
    const pending: PendingTool[] = [];
    const blocks: ContentBlock[] = [];
    let currentText = "";
    let inToolUse = false;
    let currentToolIndex = -1;

    for await (const rawEvent of messageStream as AsyncIterable<unknown>) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const event = rawEvent as any;
      if (event.type === "content_block_start") {
        const cb = event.content_block;
        if (cb?.type === "tool_use") {
          if (currentText) {
            blocks.push({ type: "text", text: currentText });
            currentText = "";
          }
          pending.push({
            id: cb.id ?? "",
            name: cb.name ?? "",
            partialJson: "",
          });
          currentToolIndex = pending.length - 1;
          inToolUse = true;
          send({ type: "tool_use_start", id: cb.id ?? "", name: cb.name ?? "" });
        } else if (cb?.type === "text") {
          inToolUse = false;
          currentToolIndex = -1;
        }
      } else if (event.type === "content_block_delta") {
        const delta = event.delta;
        if (delta?.type === "text_delta" && typeof delta.text === "string") {
          currentText += delta.text;
          send({ type: "text", text: delta.text });
        } else if (
          delta?.type === "input_json_delta" &&
          typeof delta.partial_json === "string" &&
          inToolUse &&
          currentToolIndex >= 0
        ) {
          pending[currentToolIndex].partialJson += delta.partial_json;
        }
      } else if (event.type === "content_block_stop") {
        inToolUse = false;
      } else if (event.type === "message_delta") {
        const usage = event.usage;
        if (usage) {
          if (typeof usage.input_tokens === "number") lastUsage.input = usage.input_tokens;
          if (typeof usage.output_tokens === "number") lastUsage.output = usage.output_tokens;
          if (typeof usage.cache_read_input_tokens === "number")
            lastUsage.cacheRead = usage.cache_read_input_tokens;
          if (typeof usage.cache_creation_input_tokens === "number")
            lastUsage.cacheWrite = usage.cache_creation_input_tokens;
        }
      } else if (event.type === "message_start") {
        const usage = event.message?.usage;
        if (usage) {
          if (typeof usage.input_tokens === "number") lastUsage.input = usage.input_tokens;
          if (typeof usage.output_tokens === "number") lastUsage.output = usage.output_tokens;
          if (typeof usage.cache_read_input_tokens === "number")
            lastUsage.cacheRead = usage.cache_read_input_tokens;
          if (typeof usage.cache_creation_input_tokens === "number")
            lastUsage.cacheWrite = usage.cache_creation_input_tokens;
        }
      }
    }

    if (currentText) {
      blocks.push({ type: "text", text: currentText });
      currentText = "";
    }

    // Parse tool args and append tool_use blocks to the assistant message
    for (const tu of pending) {
      try {
        tu.args = tu.partialJson ? JSON.parse(tu.partialJson) : {};
      } catch {
        tu.args = {};
      }
      blocks.push({
        type: "tool_use",
        id: tu.id,
        name: tu.name,
        input: tu.args ?? {},
      });
    }

    // Record the assistant message in our local history
    if (blocks.length > 0) {
      assistantHistory.push({ role: "assistant", content: blocks });
    }

    // No tool uses → model finished
    if (pending.length === 0) {
      break;
    }

    // Pause path: request_human in this batch
    const humanReq = pending.find((tu) => tu.name === "request_human");
    if (humanReq) {
      const args = humanReq.args ?? {};
      const ownerName = String(args.ownerName ?? "");
      const question = String(args.question ?? "");
      const options = Array.isArray(args.options) ? (args.options as string[]) : [];
      const ownerRef = findAgent(slugifyOwnerName(ownerName));
      const result: RequestHumanResult = {
        awaitingHuman: true,
        ownerName,
        ownerRole: ownerRef?.agent.role ?? "",
        ownerAgentId: ownerRef?.agentId ?? "",
        ownerDepartmentId: ownerRef?.department.id ?? "",
        ownerAccent: ownerRef?.department.accent ?? "boreal",
        question,
        options,
        toolUseId: humanReq.id,
      };
      send({
        type: "tool_result",
        tool_use_id: humanReq.id,
        name: "request_human",
        result,
      });

      pausedTranscript = [...messages, ...assistantHistory];
      break outer;
    }

    // Normal path: run tools, emit results
    try {
      await runner.generateToolResponse();
    } catch {
      // Errors will surface again on the next iteration; ignore here.
    }

    let sawComplete = false;
    for (const tu of pending) {
      const result = drainByName(tu.name);
      if (result) {
        send({
          type: "tool_result",
          tool_use_id: tu.id,
          name: tu.name,
          result,
        });
      }
      if (tu.name === "complete_mission") sawComplete = true;
    }

    if (sawComplete) {
      break outer;
    }
  }

  send({
    type: "done",
    missionId,
    paused: pausedTranscript !== null,
    transcript: pausedTranscript,
    usage: {
      input: lastUsage.input ?? 0,
      output: lastUsage.output ?? 0,
      cacheRead: lastUsage.cacheRead ?? 0,
      cacheWrite: lastUsage.cacheWrite ?? 0,
    },
  });
}

function slugifyOwnerName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
