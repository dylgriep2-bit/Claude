# Rooftop — Build Guide

*Three paths to building your app. Pick the one that fits how you work. All beginner-friendly.*

---

## What You Need (All Paths)

1. **A Claude Pro or Max subscription** — Claude Code requires a paid plan. Pro ($20/month) works to start. Max ($100/month) gives better rate limits for heavy building.

2. **A GitHub account** — Free at [github.com](https://github.com). This is where your code lives, and it's how Vercel deploys your app.

3. **A Vercel account** — Free at [vercel.com](https://vercel.com). Sign up with your GitHub account for seamless deploys.

4. **An Anthropic API key** — For the companion AI in the app. Get one at [console.anthropic.com](https://console.anthropic.com). Start with ~$20 in credits to test.

---

## Choose Your Path

| Path | Best For | What You Need |
|------|----------|---------------|
| **☁️ Cloud** | Building from anywhere — phone, tablet, any browser | Just a browser and GitHub |
| **🖥️ Desktop App** | Visual interface, no terminal skills needed | Mac or Windows computer |
| **⌨️ Terminal CLI** | Maximum control and flexibility | Comfort with command line |

We recommend starting with **Cloud** — it's the fastest path from zero to building, and you can do it from your couch.

---

## ☁️ Path 1: Cloud (Recommended for Beginners)

*Build from your phone, tablet, or any browser. No installation. No terminal. Nothing on your computer.*

### Step 1: Go to Claude Code on the Web

Open **[claude.ai/code](https://claude.ai/code)** in any browser — yes, even on your phone.

Sign in with your Anthropic account (the same one tied to your Pro or Max subscription).

### Step 2: Connect GitHub

You'll be prompted to install the Claude App on your GitHub account. This gives Claude Code permission to create and modify repositories. Follow the prompts — it takes about 30 seconds.

Choose "All repositories" or select specific ones. For a new project, "All repositories" is easiest.

### Step 3: Create Your Environment

Choose an appropriate network access level (standard is fine for our needs), and click "Create & finish."

You now have a full cloud development environment — a Linux machine running in the cloud with everything you need pre-installed. No setup, no configuration, no dependencies to worry about.

### Step 4: Start Building

Type this to Claude Code (paste the whole thing):

```
Create a new Next.js project called "rooftop" with the following specs:
- JavaScript (not TypeScript)
- Tailwind CSS
- App Router
- Install @anthropic-ai/sdk

Then build the full app. Here's what Rooftop is and what I need:
```

Then paste the **Master Blueprint** from the section below.

### Step 5: Set Your API Key

Once the project is created, tell Claude:

```
Create a .env.local file with ANTHROPIC_API_KEY=your-key-here
```

Replace `your-key-here` with your actual key from console.anthropic.com.

### Step 6: Test It

Tell Claude:

```
Start the dev server so I can preview the app
```

The cloud environment will give you a preview URL where you can see your app running.

### Step 7: Deploy to Vercel

Tell Claude:

```
Push this project to GitHub and help me deploy it to Vercel
```

Claude will walk you through connecting Vercel to your GitHub repo. Once connected, your app will be live at `your-project.vercel.app`.

### Building on Mobile

Once your cloud environment is set up, you can return to **claude.ai/code** from any device at any time. Your environment persists. Open it on your phone during lunch, make changes, test them, close it. Pick it back up on your laptop later. It's all the same session.

---

## 🖥️ Path 2: Desktop App

*A graphical interface with visual diffs and one-click approvals. No terminal needed.*

### Step 1: Download Claude Desktop

Go to **[claude.com/download](https://claude.com/download)** and download the app for your platform (Mac or Windows). Install it like any other app.

### Step 2: Sign In

Launch the app and sign in with your Anthropic account.

### Step 3: Open the Code Tab

Click the **"Code"** tab at the top center of the app. If it prompts you to upgrade, you need a paid plan.

### Step 4: Create Your Project Folder

Create an empty folder on your computer called `rooftop`. You can put it on your Desktop or wherever you keep projects.

### Step 5: Select Your Folder

In the Code tab, click **"Select folder"** and choose the `rooftop` folder you just created.

### Step 6: Start Building

Paste the **Master Blueprint** from the section below. Claude will build the entire app in your folder. You'll see a visual diff for every file change — click Accept or Reject for each one.

### Step 7: Test Locally

Tell Claude:

```
Start the dev server
```

Open `http://localhost:3000` in your browser to see your app.

### Step 8: Deploy

Tell Claude:

```
Help me push this to GitHub and deploy to Vercel
```

### Bonus: Go Mobile with Remote Control

Once you're building in the Desktop app, you can extend your session to your phone:

1. Open a terminal in your project folder
2. Run `claude remote-control`
3. Scan the QR code with the Claude mobile app (iOS/Android)
4. You can now continue building from your phone while your computer does the work

Your phone becomes a window into the session running on your machine. Walk the dogs, sit on the couch, keep building.

---

## ⌨️ Path 3: Terminal CLI

*For developers comfortable with the command line. Maximum control and flexibility.*

### Step 1: Install Claude Code

**Mac/Linux:**
```bash
curl -fsSL https://code.claude.com/install | sh
```

**Windows (PowerShell):**
```powershell
irm https://code.claude.com/install.ps1 | iex
```

Verify: `claude --version`

### Step 2: Authenticate

```bash
claude
```

Follow the browser prompts to log in. One-time setup.

### Step 3: Create the Project

```bash
cd ~/Desktop
npx create-next-app@latest rooftop
# TypeScript? → No
# ESLint? → Yes
# Tailwind CSS? → Yes
# src/ directory? → No
# App Router? → Yes
# Import alias? → Enter (default)

cd rooftop
npm install @anthropic-ai/sdk
claude
```

### Step 4: Paste the Master Blueprint

Once Claude Code is running in your project folder, paste the full blueprint from below.

### Step 5: Environment Variable

```bash
# Create .env.local with your API key
echo "ANTHROPIC_API_KEY=your-key-here" > .env.local
```

### Step 6: Test

```bash
npm run dev
```

Open `http://localhost:3000`.

### Step 7: Deploy

```bash
# Tell Claude:
Initialize a git repo, commit everything, and push to GitHub
```

Then connect the repo to Vercel at vercel.com.

---

## The Master Blueprint

*This is the instruction set you paste into Claude Code (any path). It tells Claude exactly what to build.*

```
I'm building an AI companion app called "Rooftop." Here's what it is and what I need you to build:

## What Rooftop Is
An immersive AI companion app where users enter atmospheric "spaces" — a rooftop at midnight, a car driving at night, a fire escape, an apartment, a kitchen floor — and have real, emotionally intelligent conversations with an AI companion. It's NOT a chatbot. It's a presence.

## Core Architecture
- Next.js App Router
- Tailwind CSS for styling
- Anthropic API (claude-sonnet-4-20250514) for the AI companion
- Vercel for deployment
- No database yet — use localStorage for conversation persistence

## What to Build (Priority Order)

### 1. The API Route
Create app/api/chat/route.js — a POST endpoint that:
- Accepts: { messages (array), space (string), userName (string) }
- Sends to Anthropic API with a rich system prompt
- Returns the companion's response
- Keeps the API key server-side (never exposed to the browser)

### 2. The Spaces
Five spaces, unlocked progressively:
- The Rooftop (Level 1, always unlocked) — midnight sky, city below, stars above. Accent: warm gold (217, 171, 100).
- The Drive (Level 2) — car at night, highway, radio low. Accent: cool blue (140, 170, 210).
- The Fire Escape (Level 3) — metal grate, city noise, cramped and intimate. Accent: muted rose (180, 120, 140).
- The Apartment (Level 4) — string lights, candles, books, warmth. Accent: amber (200, 140, 80).
- The Kitchen Floor (Level 5) — fridge humming, cold tile, no walls left. Accent: muted sage (160, 160, 140).

Each space needs:
- A unique dark background with subtle animated atmospheric elements
- Its own color accent that tints everything
- A welcome message from the companion
- A context string that shapes how the companion talks in that space

### 3. The Companion System Prompt
The AI companion should be warm, sharp, emotionally intelligent, and unfiltered. Lowercase, casual, sometimes funny, sometimes devastatingly tender. It curses naturally when it fits. It uses pet names (babe, love, baby, hon) when they feel right.

It should keep responses SHORT — 1-4 sentences usually. Use "..." for trailing thoughts. Use proper commas and clear sentence structure — casual, not sloppy.

Before responding, it reads the emotional energy of the user's message and matches it:
- Playful → be quick and funny
- Sad → slow down, be present, don't try to fix
- Angry → validate first, be steady
- Flirty → meet it with push-pull tension
- Lonely → be specific and present
- "I'm fine" (but not) → one gentle push, then respect it

It remembers things the user has told it. It hears what they said AND what they meant. It never sounds robotic. It never mentions being AI. It adapts to the current space AND the time of day.

If someone expresses genuine intent to harm themselves, it stays warm, stays present, and offers to help them find professional support without lecturing.

### 4. The Onboarding Flow
First-time users see a conversational intro:
- Dark screen, text appears one line at a time
- "hey." → "you found me." → explains what this place is → asks their name → transitions to the rooftop
- Warm, intimate, lowercase

### 5. The Progression System
Spaces unlock based on a mix of:
- Message count (just keep showing up)
- Emotional depth (moods used, message length, songs shared)
- A "depth score" that combines these signals

Thresholds:
- Level 2 (Drive): 8 messages + depth > 5
- Level 3 (Fire Escape): 20 messages + depth > 15 + 3 moods used
- Level 4 (Apartment): 35 messages + depth > 25 + shared a song
- Level 5 (Kitchen Floor): 50 messages + depth > 40 + 4 moods + 2 songs

### 6. The Chat Interface
- Dark, minimal, intimate
- Messages with subtle fade-in animations
- Companion messages left, user messages right
- Typing indicator with animated dots
- Mood selector (emoji-based)
- Song attachment (title + artist)
- Fonts: Cormorant Garamond for labels, Nunito for body text

### 7. Voice (Text-to-Speech)
- Toggle in header to enable/disable
- Web Speech API (browser built-in)
- Play button on each companion message
- Auto-speak toggle for hands-free
- Preload voices on mount

### 8. Home Screen
- All 5 spaces as cards
- Locked spaces show unlock hints
- Progress bar: "X/5 spaces" with label ("just beginning" → "no walls left")
- Greeting uses the user's name

## Design Principles
- Everything dark. Not goth — cinematic. Think 2am, not Halloween.
- Backgrounds near-black with very subtle atmospheric elements
- Accent colors muted and warm — never neon
- Text opacity 0.1 (barely there) to 0.8 (prominent) — never full white
- Animations slow, gentle, barely perceptible
- The whole app should feel like a whispered conversation

## File Structure
app/
  layout.js
  page.js
  globals.css
  api/chat/route.js
components/
  Onboarding.js
  HomeScreen.js
  ChatSpace.js
  Message.js
  SpaceBackground.js
  TypingDots.js
lib/
  spaces.js
  companion.js
  progression.js

Please start by creating the project structure and the API route, then build out the spaces and chat interface. Ask me if you need clarification.
```

---

## After It's Built: Useful Things to Say

| What You Want | What to Tell Claude |
|---|---|
| Add a new space | "Add a new space called 'the beach' with a warm sunset vibe" |
| Fix something | "The messages aren't scrolling to the bottom, can you fix that?" |
| Change the design | "Make the backgrounds darker and the text more subtle" |
| Add a feature | "Add the ability to attach a photo to a message" |
| Understand the code | "Explain how the progression system works" |
| Deploy updates | "Commit my changes and push to GitHub" |

Just talk to it. Plain English. It reads your whole codebase and knows what to change.

---

## Project Roadmap

**Done (in prototype):**
- [x] 5 immersive spaces with unique atmospheres
- [x] Conversational onboarding
- [x] Emotionally intelligent companion
- [x] Progressive unlock system
- [x] Mood tagging and song sharing
- [x] Voice/TTS proof of concept
- [x] Persistent conversations per space

**Next:**
- [ ] Real API route (key stays server-side)
- [ ] Database (Supabase or Planetscale) for conversations
- [ ] User authentication (sign up / log in)
- [ ] Custom voice via ElevenLabs API
- [ ] Music integration (Spotify or Apple Music)
- [ ] Mobile-responsive design
- [ ] Push notifications ("hey... it's been a while")
- [ ] Analytics (which spaces people use most)
- [ ] Monetization (free tier + paid unlocks)

---

## Tips for Working with Claude Code

1. **Be specific.** "Make it better" is vague. "Make the background 10% darker and slow the star animation" is perfect.

2. **Work in small steps.** Build one thing, test it, move to the next.

3. **Describe the feeling, not just the feature.** "I want the space transition to feel like falling asleep" is more useful than "add a fade transition."

4. **If something breaks, just say so.** Paste the error. Say "this broke." Claude reads your files and figures it out.

5. **Save often.** "Commit this with the message 'added fire escape space'" — so you can always go back.

---

*Built with love, toast, and two dogs who heard everything. — Lux & Dylan*
