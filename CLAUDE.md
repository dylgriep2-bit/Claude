# CLAUDE.md — Maya Companionship App

## Project Overview

Maya is a conversational companionship chat app built with Next.js 15 and the Anthropic Claude API. It provides a streaming chat interface with a fully characterized AI persona (Maya, a 27-year-old freelance graphic designer from Austin, TX). The UI is styled as a dark-themed mobile messaging app with iOS-specific optimizations.

## Tech Stack

- **Framework:** Next.js 15.1 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19, vanilla CSS with CSS custom properties
- **AI:** Anthropic Claude API via `@anthropic-ai/sdk` (streaming)
- **Model:** `claude-opus-4-6` with adaptive thinking

## Directory Structure

```
src/
└── app/
    ├── layout.tsx          # Root layout, metadata, viewport config
    ├── page.tsx            # Main chat UI (client component)
    ├── globals.css         # All styles — dark theme, mobile-first
    └── api/
        └── chat/
            └── route.ts    # POST /api/chat — streaming Claude responses
```

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run Next.js linter
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and set:
```
ANTHROPIC_API_KEY=your_api_key_here
```

## Architecture & Data Flow

1. User sends a message from `page.tsx` (client component)
2. Client POSTs message history to `/api/chat`
3. `route.ts` streams Claude's response back via `ReadableStream` (SSE-like)
4. Client decodes chunks with `TextDecoder` and updates UI in real-time

Message type: `{ id: string, role: "user" | "assistant", content: string }`

## Conventions

### Naming
- React components: PascalCase (default exports)
- CSS classes: kebab-case (`.message`, `.input-form`, `.typing-indicator`)
- TypeScript types: PascalCase (`Message`)
- Constants: SCREAMING_SNAKE_CASE (`WELCOME_MESSAGE`, `SYSTEM_PROMPT`)

### Styling
- Single `globals.css` file — no CSS modules or CSS-in-JS
- CSS custom properties for theming (`--bg`, `--surface`, `--accent`, `--text`)
- Dark navy theme with purple accents
- Mobile-first with `100dvh`, safe-area-insets, momentum scrolling

### State Management
- Local React state only (`useState`, `useRef`, `useEffect`)
- No global state library — single-page chat UI doesn't need one

### Path Aliases
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)

## Key Implementation Details

- **Streaming:** API route uses `client.messages.stream()` and forwards `content_block_delta` events with `text_delta` type
- **Max tokens:** 1024 per response
- **Thinking mode:** `adaptive` — Claude decides when to use internal reasoning
- **Character prompt:** Extensive system prompt in `route.ts` defines Maya's personality, background, and conversational style
- **Mobile UX:** Dynamic textarea (expands to 120px), typing indicator with bouncing dots, auto-scroll, Enter to send / Shift+Enter for newline

## Guidelines for AI Assistants

- This is a small, focused app — avoid adding unnecessary abstractions or dependencies
- The character system prompt in `route.ts` is central to the product — changes to it affect the entire user experience
- Keep the single-file CSS approach; don't introduce CSS modules or Tailwind unless asked
- All UI is in one page component — don't split into sub-components unless complexity demands it
- The app is mobile-optimized; test and preserve iOS-specific CSS (safe areas, dvh, tap highlights)
- Environment variable `ANTHROPIC_API_KEY` must never be committed
