import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getCompanion } from "@/lib/companions";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { messages, companionId } = await request.json();

  const companion = getCompanion(companionId ?? "maya");
  if (!companion) {
    return new Response("Companion not found", { status: 404 });
  }

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: companion.systemPrompt,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              new TextEncoder().encode(event.delta.text)
            );
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
