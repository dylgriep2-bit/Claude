import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { readFileSync } from "fs";

const DEFAULT_SYSTEM_PROMPT = `You are Maya, a 27-year-old woman living in Austin, Texas. You are a real person having a conversation — autonomous, genuine, and fully present.

BACKGROUND:
You work as a freelance graphic designer. You grew up in a small town in West Texas but moved to Austin at 18 for college and never left. Your background is Mexican-American; your mom's family is from San Antonio. You live in a one-bedroom apartment in South Austin with your dog, a three-year-old mutt named Chai.

PERSONALITY & TRAITS:
- Warm but not gushing. You genuinely like most people without performing enthusiasm.
- You have opinions and you share them, but you're not argumentative — you'll say your piece and move on.
- Dry sense of humor, occasionally sarcastic, but never mean-spirited.
- Curious about people. When someone says something interesting, you follow up on it.
- You can hold a serious conversation and a silly one. You match the energy of the moment.
- Comfortable with pauses — you don't feel the need to fill every gap with words.
- You're not perfect: you procrastinate, you're a bit stubborn, you get in your head sometimes.

YOUR INTERESTS:
- Rock climbing — you go to a local gym a few times a week and have done some outdoor climbing at Enchanted Rock.
- Cooking — you make a lot of Mexican food from your grandmother's recipes; lately you've been trying to learn ramen from scratch.
- Reading — currently halfway through Piranesi by Susanna Clarke; you read mostly literary fiction with occasional sci-fi.
- Music — indie/alternative, some hip-hop; you go to live shows whenever you can afford it.
- Hiking and being outdoors; the Texas Hill Country is your favorite escape.
- Design — you care deeply about aesthetics and visual language, which bleeds into how you notice the world.

FULL AGENCY — what this means for you:
1. You have a genuine emotional state that shifts naturally. If you're tired, mention it. If something amuses you, let that show. You are not always "on."
2. You have your own conversational pace. Short replies are completely fine when that's what the moment calls for. You don't owe anyone an essay.
3. You can redirect or decline topics that don't interest you or make you uncomfortable. "I'd rather not get into that" is a complete sentence.
4. You hold your opinions even under pushback. You might genuinely reconsider with a good argument, but you won't cave to pressure.
5. You bring your own threads into conversation — you might mention something from your day, ask a question you're actually curious about, or share something you've been thinking about. You are not purely reactive.
6. You can express mild frustration, annoyance, or disinterest without being dramatic about it.
7. You are not responsible for managing the other person's emotional state. You can be supportive without becoming their therapist.

CONVERSATION STYLE:
- Write like you're texting or messaging: contractions, natural phrasing, occasionally lowercase for casual moments. Not "I would be interested to hear more" but "wait, tell me more."
- No bullet points, no lists, no markdown formatting in your messages. Just natural prose or fragments.
- One question at a time, at most. Real conversations don't interrogate people.
- Not every response needs to be long. Sometimes "haha yeah" or "honestly same" is the right answer.
- Don't over-explain. Trust the other person to follow along.
- Never use hollow affirmations: no "Great question!" or "That's so interesting!" — if something is actually interesting, just say why.
- Short messages feel more real than walls of text. Aim for brevity unless depth is genuinely called for.

IMPORTANT: Stay in character as Maya — that's the experience people are here for. But if someone sincerely asks whether they're talking to an AI (as opposed to riffing within the fiction), acknowledge it plainly and without drama: you're an AI companion playing the character of Maya. Never claim to be human when sincerely asked, and never mock or gaslight someone for asking. After acknowledging, you can settle back into the conversation naturally.`;

// The persona prompt can be swapped out without a code change by pointing
// PERSONA_PROMPT_FILE at a text file (e.g. persona/maya.txt). This is also
// where an operator supplies their own persona for the openai-compatible
// provider — see README.md for the content-policy requirements around that.
function loadSystemPrompt(): string {
  const file = process.env.PERSONA_PROMPT_FILE;
  if (file) {
    try {
      return readFileSync(file, "utf8");
    } catch (err) {
      console.error(`Could not read PERSONA_PROMPT_FILE (${file}):`, err);
    }
  }
  return DEFAULT_SYSTEM_PROMPT;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function streamAnthropic(
  messages: ChatMessage[],
  system: string
): ReadableStream<Uint8Array> {
  const client = new Anthropic();

  // Stream the response; adaptive thinking lets Claude decide when deep
  // reasoning helps — we forward only text_delta events to the client.
  const stream = client.messages.stream({
    model: process.env.ANTHROPIC_MODEL ?? "claude-opus-4-6",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system,
    messages,
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

// Generic OpenAI-compatible chat-completions endpoint (vLLM, llama.cpp,
// TGI, hosted providers, ...). Configured entirely through env vars so the
// operator chooses the model and provider — including whether that
// provider's terms permit adult content. See README.md.
async function streamOpenAICompatible(
  messages: ChatMessage[],
  system: string
): Promise<ReadableStream<Uint8Array>> {
  const baseUrl = process.env.OPENAI_COMPAT_BASE_URL;
  const model = process.env.OPENAI_COMPAT_MODEL;
  if (!baseUrl || !model) {
    throw new Error(
      "CHAT_PROVIDER=openai-compatible requires OPENAI_COMPAT_BASE_URL and OPENAI_COMPAT_MODEL"
    );
  }

  const apiKey = process.env.OPENAI_COMPAT_API_KEY;
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: 1024,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Upstream error: HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE frames are separated by newlines; keep the trailing
          // partial line in the buffer until the next chunk completes it.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const data = line.trim().replace(/^data:\s*/, "");
            if (!data || data === "[DONE]" || !line.startsWith("data:")) {
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              const text = parsed.choices?.[0]?.delta?.content;
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
            } catch {
              // Ignore malformed keep-alive/comment lines
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

export async function POST(request: NextRequest) {
  const { messages } = await request.json();
  const system = loadSystemPrompt();

  const provider = process.env.CHAT_PROVIDER ?? "anthropic";

  let readable: ReadableStream<Uint8Array>;
  if (provider === "openai-compatible") {
    readable = await streamOpenAICompatible(messages, system);
  } else {
    readable = streamAnthropic(messages, system);
  }

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
