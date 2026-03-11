import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getSpace } from "@/lib/spaces";
import { buildSystemPrompt } from "@/lib/companion";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { messages, space, userName } = await request.json();

  const spaceData = getSpace(space || "rooftop");
  const systemPrompt = spaceData
    ? buildSystemPrompt(spaceData, userName || "friend")
    : "You are a warm, emotionally intelligent companion. Be present.";

  const stream = client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: systemPrompt,
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
