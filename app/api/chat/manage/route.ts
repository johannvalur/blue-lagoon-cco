import { NextRequest } from "next/server";
import { getAnthropic, MODEL_OPUS } from "@/lib/anthropic";
import { MANAGE_SYSTEM_PROMPT } from "@/lib/prompts/customer/manage";
import {
  makeChangeDatesTool,
  makeCancelBookingTool,
  type ChangeDatesResult,
  type CancelBookingResult,
  type ManageContext,
} from "@/lib/tools/manageTools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface ManageChatRequest {
  messages: IncomingMessage[];
  context: ManageContext;
}

const MAX_TOKENS = 2048;
const EFFORT: "low" | "medium" | "high" = "low";

export async function POST(req: NextRequest) {
  let body: ManageChatRequest;
  try {
    body = (await req.json()) as ManageChatRequest;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError("messages must be a non-empty array.", 400);
  }
  if (!body.context || !body.context.ref || !body.context.fareClass) {
    return jsonError("context with ref and fareClass is required.", 400);
  }

  let client;
  try {
    client = getAnthropic();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "ANTHROPIC_API_KEY is not set.";
    return jsonError(message, 500);
  }

  const messages = body.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      };

      try {
        await runManageToolLoop({
          client,
          messages,
          ctx: body.context,
          send,
        });
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

interface RunArgs {
  client: ReturnType<typeof getAnthropic>;
  messages: { role: "user" | "assistant"; content: string }[];
  ctx: ManageContext;
  send: (obj: unknown) => void;
}

async function runManageToolLoop({ client, messages, ctx, send }: RunArgs) {
  const changeQueue: ChangeDatesResult[] = [];
  const cancelQueue: CancelBookingResult[] = [];

  const changeDates = makeChangeDatesTool(ctx, (r) => changeQueue.push(r));
  const cancelBooking = makeCancelBookingTool(ctx, (r) => cancelQueue.push(r));

  const runner = client.beta.messages.toolRunner({
    model: MODEL_OPUS,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: "text",
        text: MANAGE_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
    tools: [changeDates, cancelBooking],
    ...{ output_config: { effort: EFFORT } },
    stream: true,
  });

  let pendingToolUses: { id: string; name: string }[] = [];
  let lastUsage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number | null;
    cache_creation_input_tokens?: number | null;
  } | null = null;

  for await (const messageStream of runner) {
    pendingToolUses = [];

    for await (const event of messageStream) {
      if (event.type === "content_block_start") {
        if (event.content_block.type === "tool_use") {
          const id = event.content_block.id;
          const name = event.content_block.name;
          pendingToolUses.push({ id, name });
          send({ type: "tool_use_start", id, name });
        }
      } else if (event.type === "content_block_delta") {
        if (event.delta.type === "text_delta") {
          send({ type: "text", text: event.delta.text });
        }
      } else if (event.type === "message_delta") {
        if (event.usage) {
          const prevInput: number = lastUsage?.input_tokens ?? 0;
          const usage = event.usage;
          lastUsage = {
            input_tokens: usage.input_tokens ?? prevInput,
            output_tokens: usage.output_tokens ?? 0,
            cache_read_input_tokens: usage.cache_read_input_tokens ?? null,
            cache_creation_input_tokens:
              usage.cache_creation_input_tokens ?? null,
          };
        }
      } else if (event.type === "message_start") {
        if (event.message.usage) {
          lastUsage = {
            input_tokens: event.message.usage.input_tokens,
            output_tokens: event.message.usage.output_tokens,
            cache_read_input_tokens:
              event.message.usage.cache_read_input_tokens ?? null,
            cache_creation_input_tokens:
              event.message.usage.cache_creation_input_tokens ?? null,
          };
        }
      }
    }

    if (pendingToolUses.length > 0) {
      try {
        await runner.generateToolResponse();
      } catch {
        // surfaced again on next iteration
      }

      for (const tu of pendingToolUses) {
        let result: ChangeDatesResult | CancelBookingResult | undefined;
        if (tu.name === "change_dates") {
          result = changeQueue.shift();
        } else if (tu.name === "cancel_booking") {
          result = cancelQueue.shift();
        }
        if (result) {
          send({
            type: "tool_result",
            tool_use_id: tu.id,
            name: tu.name,
            result,
          });
        }
      }
    }
  }

  send({
    type: "done",
    usage: lastUsage
      ? {
          input: lastUsage.input_tokens,
          output: lastUsage.output_tokens,
          cacheRead: lastUsage.cache_read_input_tokens ?? 0,
          cacheWrite: lastUsage.cache_creation_input_tokens ?? 0,
        }
      : { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  });
}
