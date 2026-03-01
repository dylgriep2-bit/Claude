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

  try {
    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Chat API error:", message);
    return new Response(message, { status: 500 });
  }
}
