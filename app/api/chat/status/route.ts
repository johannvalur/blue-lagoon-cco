import { NextRequest } from "next/server";
import { getAnthropic, MODEL_OPUS } from "@/lib/anthropic";
import { buildStatusSystemPrompt } from "@/lib/prompts/customer/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface StatusChatRequest {
  messages: IncomingMessage[];
}

const MAX_TOKENS = 2048;

export async function POST(req: NextRequest) {
  let body: StatusChatRequest;
  try {
    body = (await req.json()) as StatusChatRequest;
  } catch {
    return jsonError("Invalid JSON body.", 400);
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

  // Build the system prompt at request-time so the disruption briefing
  // (flight numbers, routes, projected new ETDs) is freshly grounded in
  // today's scenario data.
  const systemPrompt = buildStatusSystemPrompt();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      };

      try {
        const responseStream = client.messages.stream({
          model: MODEL_OPUS,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages,
          ...{ output_config: { effort: "low" } },
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
