import { NextRequest } from "next/server";
import {
  getAnthropic,
  MODEL_OPUS,
  MODEL_HAIKU,
  type Surface,
} from "@/lib/anthropic";
import { TRIP_SYSTEM_PROMPT } from "@/lib/prompts/customer/trip";
import { OPS_SYSTEM_PROMPT } from "@/lib/prompts/internal/ops";
import { CREW_SYSTEM_PROMPT } from "@/lib/prompts/internal/crew";
import {
  makeSearchFlightsTool,
  makeHoldBookingTool,
  makeSaveTripIdeaTool,
  type SearchFlightsResult,
  type HoldBookingResult,
  type SaveTripIdeaResult,
} from "@/lib/tools/bookingTools";
import {
  makeSearchHotelsTool,
  makeSearchCarsTool,
  makeSearchPackagesTool,
  type SearchHotelsResult,
  type SearchCarsResult,
  type SearchPackagesResult,
} from "@/lib/tools/inventoryTools";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  surface: Surface;
  messages: IncomingMessage[];
}

const SURFACE_CONFIG: Record<
  Surface,
  {
    model: typeof MODEL_OPUS | typeof MODEL_HAIKU;
    systemPrompt: string;
    effort: "low" | "medium" | "high";
    maxTokens: number;
  }
> = {
  trip: {
    model: MODEL_OPUS,
    systemPrompt: TRIP_SYSTEM_PROMPT,
    effort: "low",
    maxTokens: 3072,
  },
  ops: {
    model: MODEL_OPUS,
    systemPrompt: OPS_SYSTEM_PROMPT,
    effort: "medium",
    maxTokens: 3072,
  },
  crew: {
    model: MODEL_HAIKU,
    systemPrompt: CREW_SYSTEM_PROMPT,
    effort: "low",
    maxTokens: 1536,
  },
};

export async function handleChat(
  req: NextRequest,
  allowedSurfaces: readonly Surface[],
) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (!allowedSurfaces.includes(body.surface)) {
    return jsonError(
      `Surface "${body.surface}" is not served by this endpoint. Expected one of: ${allowedSurfaces.join(", ")}.`,
      400,
    );
  }
  const config = SURFACE_CONFIG[body.surface];
  if (!config) {
    return jsonError(`Unknown surface: ${body.surface}`, 400);
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError("messages must be a non-empty array.", 400);
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
        if (body.surface === "trip") {
          await runTripToolLoop({ client, config, messages, send });
        } else {
          await runPlainStream({ client, config, messages, send });
        }
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
  config: (typeof SURFACE_CONFIG)[Surface];
  messages: { role: "user" | "assistant"; content: string }[];
  send: (obj: unknown) => void;
}

async function runPlainStream({ client, config, messages, send }: RunArgs) {
  const responseStream = client.messages.stream({
    model: config.model,
    max_tokens: config.maxTokens,
    system: [
      {
        type: "text",
        text: config.systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
    ...(config.model === MODEL_OPUS
      ? { output_config: { effort: config.effort } }
      : {}),
  });

  for await (const event of responseStream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      send({ type: "text", text: event.delta.text });
    }
  }

  const finalMessage = await responseStream.finalMessage();
  send({
    type: "done",
    usage: {
      input: finalMessage.usage.input_tokens,
      output: finalMessage.usage.output_tokens,
      cacheRead: finalMessage.usage.cache_read_input_tokens ?? 0,
      cacheWrite: finalMessage.usage.cache_creation_input_tokens ?? 0,
    },
  });
}

type AnyToolResult =
  | SearchFlightsResult
  | SearchHotelsResult
  | SearchCarsResult
  | SearchPackagesResult
  | HoldBookingResult
  | SaveTripIdeaResult;

async function runTripToolLoop({
  client,
  config,
  messages,
  send,
}: RunArgs) {
  // Per-tool result queues. Tools push into their own queue via the onResult
  // callback, and we drain by tool name once the model has emitted
  // tool_use blocks for this iteration.
  const flightQ: SearchFlightsResult[] = [];
  const hotelQ: SearchHotelsResult[] = [];
  const carQ: SearchCarsResult[] = [];
  const packageQ: SearchPackagesResult[] = [];
  const holdQ: HoldBookingResult[] = [];
  const tripIdeaQ: SaveTripIdeaResult[] = [];

  const tools = [
    makeSearchFlightsTool((r) => flightQ.push(r)),
    makeSearchHotelsTool((r) => hotelQ.push(r)),
    makeSearchCarsTool((r) => carQ.push(r)),
    makeSearchPackagesTool((r) => packageQ.push(r)),
    makeHoldBookingTool((r) => holdQ.push(r)),
    makeSaveTripIdeaTool((r) => tripIdeaQ.push(r)),
  ];

  const runner = client.beta.messages.toolRunner({
    model: config.model,
    max_tokens: config.maxTokens,
    system: [
      {
        type: "text",
        text: config.systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
    tools,
    ...(config.model === MODEL_OPUS
      ? { output_config: { effort: config.effort } }
      : {}),
    stream: true,
  });

  let pendingToolUses: { id: string; name: string }[] = [];
  let lastUsage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number | null;
    cache_creation_input_tokens?: number | null;
  } | null = null;

  const drainByName = (name: string): AnyToolResult | undefined => {
    switch (name) {
      case "search_flights":
        return flightQ.shift();
      case "search_hotels":
        return hotelQ.shift();
      case "search_cars":
        return carQ.shift();
      case "search_packages":
        return packageQ.shift();
      case "hold_booking":
        return holdQ.shift();
      case "save_trip_idea":
        return tripIdeaQ.shift();
      default:
        return undefined;
    }
  };

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
        // Errors will surface again on the next iteration; ignore here.
      }

      for (const tu of pendingToolUses) {
        const result = drainByName(tu.name);
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
