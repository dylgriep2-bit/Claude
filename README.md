# Maya — AI companionship app

A mobile-friendly chat app built with Next.js 15, React 19, and TypeScript.
Users chat with "Maya," an AI companion persona, with streamed responses.

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in your keys
npm run dev
```

## Architecture

- `src/app/page.tsx` — chat UI (age gate, message list, streaming input)
- `src/app/api/chat/route.ts` — streaming chat endpoint, provider-agnostic
- `src/app/globals.css` — all styling

### Providers

The backend is selected with `CHAT_PROVIDER`:

| Provider | Env vars | Notes |
| --- | --- | --- |
| `anthropic` (default) | `ANTHROPIC_API_KEY`, optional `ANTHROPIC_MODEL` | Powers the default persona. Anthropic's usage policy **does not permit sexually explicit content**, so this provider must only be used with non-explicit personas. |
| `openai-compatible` | `OPENAI_COMPAT_BASE_URL`, `OPENAI_COMPAT_MODEL`, optional `OPENAI_COMPAT_API_KEY` | Any OpenAI-compatible `/chat/completions` endpoint: vLLM, llama.cpp server, TGI, or a hosted provider. |

### Personas

The system prompt is built in (Maya) but can be replaced by pointing
`PERSONA_PROMPT_FILE` at a plain-text file. Whatever persona you supply,
keep these properties — they are load-bearing for compliance, not
stylistic suggestions:

1. **The persona must acknowledge being an AI when sincerely asked.**
   Companion-chatbot disclosure laws (e.g. California SB 243, in force
   since January 2026) require clear notification that the user is
   interacting with an AI, and prohibit the bot claiming to be human.
   The UI disclosure alone is not sufficient if the persona actively
   denies being an AI.
2. **Adult characters only.** Every persona must be unambiguously an
   adult. This is an absolute requirement regardless of provider.
3. **No impersonation of real people** without their documented consent.

## Operating this app with adult (NSFW) content

If you configure a persona and provider for adult content, you take on
real obligations as the operator. Non-exhaustive checklist:

- **Model/provider terms** — use only a provider or self-hosted model
  whose license and terms of service permit adult content. The Anthropic
  API does not; do not route explicit personas through it.
- **Age assurance** — the built-in age gate is a self-attestation
  screen, which is the floor, not the ceiling. Several jurisdictions
  (UK Online Safety Act, various US state laws) require robust age
  verification for adult services; you will likely need a real
  age-verification provider before public launch.
- **AI disclosure** — keep the persistent UI disclosure and the
  persona's acknowledgment behavior (see above). Some jurisdictions also
  require periodic re-disclosure during long sessions and crisis-response
  protocols (e.g. surfacing suicide-prevention resources).
- **Prohibited content, no exceptions** — any depiction of minors,
  non-consent presented as real, or real-person impersonation must be
  blocked at the persona and moderation layer.
- **App store policies** — Apple and Google broadly prohibit explicit
  sexual content in native apps; a web app avoids review but not the
  legal obligations above.
- **Privacy** — companion-app conversations are sensitive personal data.
  Publish a privacy policy, minimize retention, and handle deletion
  requests before you have real users.

This repository ships with the default non-explicit persona and the
Anthropic provider. The compliance work above is a prerequisite for —
not a consequence of — flipping the switch.
