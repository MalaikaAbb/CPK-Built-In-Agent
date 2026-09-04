# CopilotKit + Built-in Agent Test Suite

A navigable, working test harness for CopilotKit's **built-in agent** — each doc page is a route that actually runs the thing it describes.

| | |
|---|---|
| **Doc sync date** | Machine-maintained — `doc-snapshot/manifest.json` → `syncedAt`, rewritten on every sync |
| **CopilotKit packages** | `@copilotkit/react-core` 1.70.1 · `@copilotkit/runtime` 1.70.1 · `@copilotkit/shared` 1.70.1 |
| **AG-UI packages** | `@ag-ui/client` 0.0.59 · `@ag-ui/core` 0.0.59 |
| **Model routers** | `ai` 6.0.242 · `@ai-sdk/openai` 3.0.104 · `@tanstack/ai` 0.43.0 · `@tanstack/ai-openai` 0.18.0 |
| **Frontend** | Next.js 16.3.0 (App Router) · React 19.2 · TypeScript 5 · Tailwind 4 |
| **Build status** | No CI. Verified locally against 1.70.1: `next build` ✅ (55 routes) · lint ✅ 0 errors, 17 warnings (unused imports left by trimmed callouts, plus the doc samples' unused bindings — see §9.21) · the browser-driven run below predates the 1.70.1 bump and has not been repeated · dev server boots with all 10 agents on `GET /info` ✅ · driven in headless Chrome: every provider tab and both factory tabs reached a real `POST /agent/<id>/run` 200; with Intelligence keyed, `/info` reports `mode: "intelligence"` + `licenseStatus: "valid"` and all three Rich Threads routes were exercised end to end (drawer unlocked and auto-named a thread, headless rename applied, `explicit` replay verified) ✅ · `tsc --noEmit` ❌ 9 errors, **all in verbatim doc samples** — see §9 |

---

## 2. Overview

CopilotKit's **built-in agent** is the one integration in this family with no third-party agent framework in it. `BuiltInAgent`, from `@copilotkit/runtime/v2`, *is* the agent: it owns the model call, the tool loop, MCP, and the AG-UI state tools, and it runs inside the Next.js process.

This repo covers a **scoped set of 24 doc pages** (§8) — every page listed in §12 — as one navigable Next app. Each route implements what its page teaches and shows the exact source that makes it work, read off disk at render time.

**Everything comes from the documentation.** No tool, prompt, or config value was invented. Where a doc sample cannot run as written — because it calls a helper the docs never define, or because it does not compile against the shipped types — the sample is shown verbatim and the page says exactly what is wrong with it.

Tracks: **<https://docs.copilotkit.ai/quickstart>** (the built-in agent's pages sit at the site root, not under a framework slug).

---

## 3. Architecture

```
Browser (React 19)
  │  @copilotkit/react-core/v2 — <CopilotKit>, CopilotChat, hooks
  │  POST /api/copilotkit/agent/:agentId/run   (SSE)
  │  GET  /api/copilotkit/info
  ▼
Next.js 16 App Router  ·  localhost:3000
  │  app/api/copilotkit/[[...slug]]/route.ts
  │    CopilotRuntime (v2)  +  createCopilotRuntimeHandler
  │    intelligence: CopilotKitIntelligence  +  identifyUser   (when keyed)
  │    runner: MyRunner extends InMemoryAgentRunner            (SSE fallback)
  ▼
BuiltInAgent × 10  —  in the same process
  │  src/copilotkit/agents.ts
  ▼
OpenAI · Google · Anthropic
  (openai:gpt-4.1 by default; /model-selection drives one agent per provider)
```

**There is no backend directory, and no agent framework.** The agent ships inside `@copilotkit/runtime`. One command, one port.

A second, token-gated runtime is mounted at `app/api/copilotkit-auth/[[...slug]]/route.ts` purely so the Authentication page's `onRequest` hook can be demonstrated without 401-ing the rest of the harness.

### The ten agents

| Agent id | Config that matters | Used by |
|---|---|---|
| `default` | model only | Quickstart, Prebuilt Components, Slots, Headless UI, Display-only, Interactive, Frontend Tools, Agent Context, AgentRunner, Authentication |
| `serverToolsAgent` | `tools: [getWeather]` · `maxSteps: 2` | Server Tools |
| `renderingAgent` | `tools: [get_weather]` · `maxSteps: 2` | Tool Rendering, Programmatic Control, AG-UI, Runtime endpoints, Inspector |
| `advancedAgent` | prompt · sampling params · `overridableProperties` | Advanced Configuration |
| `sharedStateAgent` | `maxSteps: 5` (state tools need >1) | Shared State |
| `openAiAgent` | `openai:…` · `apiKey: OPENAI_API_KEY` | Model Selection — Agent A |
| `googleAgent` | `google:…` · `apiKey: GOOGLE_API_KEY` | Model Selection — Agent B |
| `anthropicAgent` | `anthropic:…` · `apiKey: ANTHROPIC_API_KEY` | Model Selection — Agent C |
| `aiSdkAgent` | `type: "aisdk"` · `streamText` + `openai("gpt-4o")` | Use any model router |
| `tanStackAgent` | `type: "tanstack"` · `chat` + `openaiText("gpt-4o")` | Use any model router |

Ten rather than one because what these pages teach *is* constructor configuration — tools, `maxSteps`, sampling parameters, factory mode. Those cannot share an instance without one page silently changing another page's behaviour. Agent ids are the keys of the record passed to `new CopilotRuntime({ agents })`; a component with no `agentId` resolves to `default`.

---

## 4. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 20+ | Next.js 16 requires 20+. Developed on 24.16. |
| npm | 10+ | Or pnpm/yarn/bun. |
| OpenAI API key | — | Required. Must have access to the model in `OPENAI_MODEL`, and to `gpt-4o` for both factories on `/backend/custom-agent`. |
| Google / Anthropic keys | — | Optional. Only `/model-selection` Agents B and C use them. |

No Python, no second runtime, no separate agent process, no framework CLI.

---

## 5. Setup

```bash
git clone <this-repo> built-in-agent && cd built-in-agent
cd frontend && npm install
cp ../.env.example .env.local
```

Then edit `frontend/.env.local`:

| Variable | What it does |
|---|---|
| `OPENAI_API_KEY` | **Required.** Read server-side by `BuiltInAgent`; never exposed to the browser. |
| `OPENAI_MODEL` | Model id for every agent, and for Agent A on `/model-selection`. Defaults to `openai:gpt-4.1`. |
| `GOOGLE_API_KEY` / `ANTHROPIC_API_KEY` | Optional. Needed only for Agents B and C on `/model-selection`; that route reports which keys are set and skips the columns whose key is missing. |
| `GOOGLE_MODEL` / `ANTHROPIC_MODEL` | Optional model ids for those two. Default to `google:gemini-2.5-flash` and `anthropic:claude-sonnet-4-5` (hyphens — see §9.13). |
| `CPK_INTELLIGENCE_API_KEY` | Optional. The project API key. Turns on CopilotKit Intelligence: `/info` reports `mode: "intelligence"` and threads persist. Without it the runtime falls back to SSE + `MyRunner` and every route still works. Renamed from `INTELLIGENCE_API_KEY` on 2026-09-04 — an older `.env.local` sets a variable nothing reads. |
| `COPILOTKIT_LICENSE_TOKEN` | Optional, and **separate** from the key above. It is the *fallback* input to `/info`'s `licenseStatus`, which is what `<CopilotThreadsDrawer>` gates its locked Upgrade view on — the runtime resolves managed entitlements first. Managed projects are not issued one and do not need one: an active `managedOrgSubscription` reaches `valid` without it. Offline/self-hosted licensing only. See §9.17. |
| `CPK_TELEMETRY_ID` | Optional, non-secret. The `CopilotRuntime` constructor falls back to it when no `telemetryId` is passed. Written by the CLI's `init`/`create`. |
| `SL_ENABLED` | Documented as CLI output, but read by no installed `@copilotkit` package and never explained. Left unset here — see §9.18. |
| `NEXT_PUBLIC_DEMO_USER_ID` / `NEXT_PUBLIC_DEMO_USER_NAME` | Optional. The identity the provider sends as `x-user-id`/`x-user-name` for `identifyUser`. Threads are per-user, so changing it gives a different thread list. |
| `NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY` | Optional; no route here needs it. |

**Default port:** **3000** — the only one.

---

## 6. Running the project

One process, one terminal.

```bash
cd frontend
npm run dev
```

Success looks like:

```
▲ Next.js 16.3.0 (Turbopack)
- Local:   http://localhost:3000
✓ Ready in 375ms
```

Open **<http://localhost:3000>**.

Two quick health checks that need no model call:

```bash
curl -s http://localhost:3000/api/copilotkit/info          # → JSON listing all ten agents
curl -s -o /dev/null -w "%{http_code}\n" \
     http://localhost:3000/api/copilotkit-auth/info        # → 401, by design
```

If chats fail, the usual cause is a missing `OPENAI_API_KEY` — Next reads `.env.local` at startup, so restart after setting it.

---

## 7. What to expect — walkthrough per section

### How each route is split

| | |
|---|---|
| **`<route>`** | Notes, pass/fail criteria, and **the exact source**, read off disk at render time. No live chat. |
| **`<route>/demo-chat`** | Just the running feature, no chrome — built for screen recording. Reached via **Open demo ↗**, which always opens a new tab. |

Code on a page is never a re-typed approximation: each page reads real files via `src/lib/source.ts` and syntax-highlights them with Shiki. Excerpts use `#region` markers, which stay visible in the source and are labelled with line numbers. Where a page shows the *documentation's* code rather than this repo's, it is captioned as such.

### Getting Started

**`/`** — Orientation and the agent roster.

**`/quickstart`** — `BuiltInAgent` + `CopilotSidebar`, the whole stack. **Try:** `What can you do?` **Pass:** tokens stream and render as markdown. **Fail:** an error banner — check `OPENAI_API_KEY`.

### Basics

**`/prebuilt-components`** — `CopilotChat`, `CopilotSidebar`, `CopilotPopup` in tabs. **Try:** say `Hello`, switch tabs, ask `what did I just say?` **Pass:** all three drive the same agent and the conversation survives the switch.

### Rich Threads

**`/prebuilt-components/copilot-threads-drawer`** — The prebuilt sidebar: list, switch, start, archive, delete, with no thread state of your own. **Try:** say `Hello`, then click **New Conversation** and say hello again. **Pass:** two rows in the drawer; clicking the first replays its messages. **Fail:** an **Upgrade** button instead of a list — that is the no-license-token state, *not* a threads failure. Check `/headless-threads` to confirm threads work.

**`/headless-threads`** — The same data through `useThreads`, hand-rendered, including **rename** (the drawer omits it). **Try:** send a message, press **Rename** on the row. **Pass:** the row renames without a reload; Archive greys it, Delete removes it. **Fail:** the list stays empty while chat works — the runtime is in SSE mode; check the home page's Connection panel.

**`/threads-lifecycle`** — Where a `threadId` comes from and what `explicit` changes. **Try:** press **New chat**, then **Open conversation**, then **Set id, no replay**. **Pass:** New chat mints a new id; Open conversation replays history with `explicit: true`; Set id lands on the *same* id with the welcome screen and `explicit: false`. **Fail:** the buttons no-op and warn in the console — a `threadId` prop crept back onto the chat.

### Custom Look and Feel

**`/custom-look-and-feel/slots`** *(live but absent from the doc sidebar)* — Four override levels. **Pass:** L1 tints the message area, L2 auto-focuses the input, L3 renders bare aligned text with no bubbles, L4 shows a "My Agent" header with the welcome screen gone.

**`/custom-look-and-feel/headless-ui`** *(absent from the sidebar)* — A chat with zero CopilotKit chrome. **Try:** `Write a long paragraph about otters`. **Pass:** text streams into hand-written bubbles and Stop halts it mid-sentence.

**`/programmatic-control`** — The agent as an object. **Try:** press **Run Agent** with the pre-filled weather prompt. **Pass:** status flips to Running, the subscriber list fills with `onRunStartedEvent` → `onRunFinalized`, and a weather card renders in the conversation column. **Fail:** nothing happens on Run — `addMessage` alone does not start a run.

**`/inspector`** — The overlay, mounted by the provider. **Pass:** a CopilotKit button in the viewport corner; opening it lists all six agents and the run's events. **Fail:** no button — the provider is `CopilotKitProvider`, which defaults it off.

### Generative UI

**`/generative-ui/your-components/display-only`** *(absent from the sidebar)* — `useComponent`. **Try:** `Show the weather card for Tokyo: 77 degrees, clear`. **Pass:** a bordered card renders inline. **Fail:** the agent describes the weather in prose.

**`/generative-ui/your-components/interactive`** *(absent from the sidebar)* — `useHumanInTheLoop`. **Try:** `Run the command rm -rf /tmp/cache`. **Pass:** the command appears in a code block with Approve/Deny and **nothing further streams** until you click; the next message reflects your choice. **Fail:** it continues without waiting.

**`/generative-ui/tool-rendering`** — Named renderer plus wildcard. **Try:** `What's the weather in Tokyo?` **Pass:** "Calling weather API..." becomes "Called the weather API for Tokyo." **Fail:** the wildcard ⏳/JSON row renders instead — the names no longer match.

### App Control

**`/frontend-tools`** — `sayHello` executing in the browser. **Try:** `Say hello to Malaika`. **Pass:** a native browser alert, then the agent confirms. **Fail:** a text reply with no alert.

**`/shared-state`** — `agent.state` written from both sides. **Try:** `Add a task to buy groceries`, then press **Dark Mode** and ask `what theme am I using?` **Pass:** the list grows without a reload and the agent answers "dark". **Fail:** the list never changes, or the agent calls a state tool and then says nothing (`maxSteps` back at 1).

**`/agent-app-context`** — `useAgentContext`. **Try:** `Who am I, and what am I working on?` **Pass:** the agent names Jane Smith and both projects with **no tool call** in the transcript. **Fail:** it says it has no information about you.

### Built-in Agent

**`/server-tools`** — `defineTool`, executing in the runtime. **Try:** `What's the weather in Lisbon?` **Pass:** a ⏳→✓ `getWeather` row with `{ temperature: 72, … }`, then a prose answer using it. **Fail:** an answer with no tool row, or a tool row followed by silence.

**`/model-selection`** — Three agents in three tabs, one per provider: **Agent A** OpenAI, **Agent B** Google, **Agent C** Anthropic. Identical `BuiltInAgent` construction; the only difference is the model prefix and which key each reads. **Try:** `Which model and provider are you?` in each tab, then switch back to the first. **Pass:** each tab answers independently and names its own provider, and its transcript is still there when you return; a tab whose key is missing says so instead of offering a chat. **Fail:** a run error naming the model — the id does not exist, or that tab's key has no access to it.

**`/advanced-configuration`** — Every `BuiltInAgent` knob, plus `overridableProperties`. **Try:** the same question under each of the three presets. **Pass:** the pirate prompt visibly takes effect (whitelisted) and the 12-token cap does not (not whitelisted). **Fail:** preset 2 reads the same as preset 1, or preset 3 truncates.

### Runtime

**`/backend/copilot-runtime`** — Routing across all six agents. **Try:** `Hello`, then switch ids. **Pass:** every id streams and each keeps its own transcript. **Fail:** an agent-not-found error.

**`/backend/runtime-endpoints`** — The HTTP surface, probed live. **Try:** press **GET /api/copilotkit/info**. **Pass:** `200 OK` and a JSON body listing six agents. **Fail:** 404 — the handler is on a fixed segment rather than a catch-all.

**`/backend/custom-agent`** — Factory mode in two tabs: **AI SDK** (`type: "aisdk"`, `streamText`) and **TanStack AI** (`type: "tanstack"`, `chat`). **Try:** `Write two sentences about tide pools` in both tabs. **Pass:** both stream like any other route — the client cannot tell them apart, because both come out as AG-UI events — and each tab keeps its own transcript across switches. **Fail:** an immediate run error — both factories use the doc's hardcoded `gpt-4o`, so a key without access to it fails on this route and nowhere else.

**`/backend/agent-runner`** — `MyRunner`, installed on the live runtime. **Try:** send two messages. **Pass:** each adds a `run` line to the log, all sharing one thread id. **Fail:** the log stays empty while the chat works.

**`/backend/ag-ui`** — Live event capture. **Try:** `Hello`, then `What's the weather in Tokyo?` **Pass:** `RUN_STARTED` → a burst of `TEXT_MESSAGE_CONTENT` → `RUN_FINISHED`, and a `TOOL_CALL_END` line on the second. **Fail:** no events while text appears.

**`/auth`** — A bearer token and an `onRequest` hook. **Try:** send under each of the three token settings. **Pass:** only the valid token works; the other two fail to send at all, because the 401 lands on `GET /info` at mount. **Fail:** all three work.

**`/status`** — Every route in one table.

---

## 8. Testing checklist / current status

| Doc page | Route | Status | Notes |
|---|---|---|---|
| `/quickstart` | `/` | 📖 Reference | Orientation + agent roster. |
| `/quickstart` | `/quickstart` | ✅ Working | Runtime route restructured (§9.1); provider needs `useSingleEndpoint={false}` (§9.3). |
| `/prebuilt-components` | `/prebuilt-components` | ✅ Working | |
| `/prebuilt-components/copilot-threads-drawer` | `/prebuilt-components/copilot-threads-drawer` | ✅ Working | Verified unlocked with both credentials set; drawer listed and auto-named a real thread. |
| `/headless-threads` | `/headless-threads` | ✅ Working | `useThreads` list + rename/archive/delete verified against a live runtime. |
| `/threads-lifecycle` | `/threads-lifecycle` | ✅ Working | `explicit: true` replays history; `explicit: false` keeps the id and shows the welcome screen. Both verified. |
| `/custom-look-and-feel/slots` | `/custom-look-and-feel/slots` | ✅ Working | **Not in the doc sidebar**; resolves. Sample does not typecheck (§9.5). |
| `/custom-look-and-feel/headless-ui` | `/custom-look-and-feel/headless-ui` | ✅ Working | **Not in the doc sidebar**; resolves. `msg.content` does not typecheck (§9.7). |
| `/programmatic-control` | `/programmatic-control` | ✅ Working | `defineToolCallRenderer` needed an `args` schema (§9.4). |
| `/inspector` | `/inspector` | ✅ Working | Dev-only by design. |
| `/generative-ui/your-components/display-only` | `/generative-ui/your-components/display-only` | ✅ Working | **Not in the doc sidebar**; resolves. |
| `/generative-ui/your-components/interactive` | `/generative-ui/your-components/interactive` | ✅ Working | **Not in the doc sidebar**; resolves. Compiles unmodified. |
| `/generative-ui/tool-rendering` | `/generative-ui/tool-rendering` | ✅ Working | Wildcard sample destructures a non-existent `args` (§9.6). |
| `/frontend-tools` | `/frontend-tools` | ✅ Working | |
| `/shared-state` | `/shared-state` | ✅ Working | Needs seeded state and `maxSteps > 1`, neither documented (§9.9). |
| `/agent-app-context` | `/agent-app-context` | ✅ Working | |
| `/server-tools` | `/server-tools` | ✅ Working | `getWeather` runs end to end. The page's other samples call undefined helpers and stay as reference code (§9.10). |
| `/model-selection` | `/model-selection` | ✅ Working | Three agents, one per provider. Each column runs if its key is set; Azure needs a package this repo does not install. |
| `/advanced-configuration` | `/advanced-configuration` | ✅ Working | `mcpServers`/`mcpClients` out of scope. |
| `/backend/copilot-runtime` | `/backend/copilot-runtime` | ✅ Working | Page mixes v1 and v2 runtimes (§9.2). |
| `/backend/runtime-endpoints` | `/backend/runtime-endpoints` | ✅ Working | `/info` probed live; samples are Express. |
| `/backend/custom-agent` | `/backend/custom-agent` | ⚠️ Partial | AI SDK **and** TanStack AI factories both live; raw-event variant shown as code (§9.11). |
| `/backend/agent-runner` | `/backend/agent-runner` | ✅ Working | `MyRunner` wired into the live runtime. |
| `/backend/ag-ui` | `/backend/ag-ui` | ✅ Working | |
| `/auth` | `/auth` | ✅ Working | Second endpoint; `verifyJwt` stubbed (§9.8). |

**Legend:** ✅ Working · ⚠️ Partial · 📖 Reference · 🚧 Not started · ❌ Broken

> **Caveat on "Working":** every route builds, lints, renders, and was confirmed to return 200 in dev, and the full run path was exercised end to end (`POST /agent/default/run` produced a real SSE `RUN_STARTED` and reached the model call). Individual agent *behaviours* were not each driven against a live model — the verification key was a placeholder, so runs terminated at `RUN_ERROR: Incorrect API key`. Anything downstream of a successful model response is unverified.

---

## 9. Known issues / doc-vs-implementation discrepancies

Items 1–16 were found against `@copilotkit/react-core` 1.66.2, `@copilotkit/runtime` 1.66.2, and `ai` 6.0.242, and have not been re-verified since the bump to 1.70.1. Items 17–26 were found against 1.70.1.

**1. ✅ RESOLVED 2026-09-04 — The Quickstart's runtime route could not serve the documented HTTP surface**
[`/quickstart`](https://docs.copilotkit.ai/quickstart) used to mount a v1 `CopilotRuntime` plus `copilotRuntimeNextJSAppRouterEndpoint` at `app/api/copilotkit/route.ts`. A fixed Next.js segment matches that path and nothing beneath it, so `GET /info` and `POST /agent/:agentId/run` 404'd while the bare URL kept answering — the app looked connected and never replied.

The Quickstart now publishes `createCopilotRuntimeHandler` at `app/api/copilotkit/[[...slug]]/route.ts`, which is the shape this repo has mounted from the start. `copilotRuntimeNextJSAppRouterEndpoint` still exists, but is now confined to the "Single-route only, no option" row on [`/backend/runtime-endpoints`](https://docs.copilotkit.ai/backend/runtime-endpoints) (§9.24) rather than being what the Quickstart teaches. **This was not in any drift report** — the old shape sat behind a conflict marker (§9.20), so the comparison never saw it move. Still open on that page: it exports only `GET` and `POST`, so thread rename/archive/delete would 405 (see the route's own callout).

**2. Two different runtimes share the name `CopilotRuntime`**
[`/backend/copilot-runtime`](https://docs.copilotkit.ai/backend/copilot-runtime) shows a Next.js sample importing it from `@copilotkit/runtime` (v1, needs a `serviceAdapter`) and then documents `a2ui`, `mcpApps`, and `forwardHeaders`, which are options on the **v2** runtime in `@copilotkit/runtime/v2`. Nothing on the page distinguishes them.

**3. ⚠️ PARTLY RESOLVED 2026-09-04 — `<CopilotKit>` defaults to single-endpoint transport; the pages now say so**
The behaviour is unchanged and still bites. What changed is that it is finally documented: the Quickstart's provider now passes `useSingleEndpoint={false}` and carries a callout saying `<CopilotKit>` "is the backward-compatible wrapper, and every released version pins it to the single-route transport"; [`/backend/runtime-endpoints`](https://docs.copilotkit.ai/backend/runtime-endpoints)'s provider table now reads `single` in released versions — see below for that row. **Neither appeared in a drift report** — the old provider sample was behind a conflict marker (§9.20). The original finding, still accurate as to behaviour: `<CopilotKit>` passes `useSingleEndpoint: props.useSingleEndpoint ?? true` down to the provider, so unless you explicitly pass `false` the client POSTs `{ method: "info" }` to the **bare** runtime URL instead of calling `GET /info`. Against a multi-route runtime that 404s — and the client then caches single-endpoint transport for the rest of the session, so every subsequent agent lookup reports `Agent default not found`:

```
POST /api/copilotkit 404
[browser] Failed to load runtime info (/api/copilotkit/info): ... status 404
[browser] Agent default not found
```

The error text names `/api/copilotkit/info`, which is misleading: that URL is never requested, and `curl`ing it returns a healthy 200. Only the browser is affected.

This repo passes `useSingleEndpoint={false}` on both providers to pin the REST transport, and has since before either page mentioned it. If you would rather keep the default, set `mode: "single-route"` on the handler instead — but then `GET /info` and `/agent/:agentId/run` stop existing, along with the live probe on `/backend/runtime-endpoints`.

**4. `defineToolCallRenderer` requires an `args` schema**
[`/programmatic-control`](https://docs.copilotkit.ai/programmatic-control) calls it with only `name` and `render`. The shipped function has two overloads — a wildcard where `name` must be the literal `"*"`, and a named one requiring `args` — so the sample matches neither. This repo passes the tool's own Zod schema.

**5. The Slots page's `CustomMessageView` produces four type errors**
[`/custom-look-and-feel/slots`](https://docs.copilotkit.ai/custom-look-and-feel/slots): implicit `any` on `messages`, `isRunning`, and `msg`; and a plain function is not assignable to `SlotValue<typeof CopilotChatMessageView>`, which requires a `Cursor` static. Separately, `"data-testid"` in the props-override sample is not a known property of the `messageView` props type. All render correctly at runtime.

**6. `useDefaultRenderTool`'s sample destructures a prop that does not exist**
[`/generative-ui/tool-rendering`](https://docs.copilotkit.ai/generative-ui/tool-rendering) reads `args` from the render props. `DefaultRenderProps` carries `name`, `status`, and `result` — not `args`. It is `undefined` at runtime and the sample never reads it.

**7. `msg.content` is rendered as a React child without narrowing**
[`/custom-look-and-feel/headless-ui`](https://docs.copilotkit.ai/custom-look-and-feel/headless-ui) and [`/programmatic-control`](https://docs.copilotkit.ai/programmatic-control) both do this. `content` is a union of string, record, and content-part array; only the string branch is a valid child. Programmatic Control's tool-message lookup has the same character of problem — the `.find()` predicate is not a type guard, so the result is not assignable to `renderToolCall`'s `toolMessage`.

**8. `verifyJwt` is called but never defined**
[`/auth`](https://docs.copilotkit.ai/auth) calls it inside `onRequest` and assigns the result to an unused `const user`. There is no signing key, library, or implementation anywhere on the page. This repo substitutes a comparison against a demo token, clearly marked. The page also mounts the gated handler at `/api/copilotkit` — the same path as the ungated one — which cannot both be true in one app.

**9. Shared State omits the two things that make it work**
[`/shared-state`](https://docs.copilotkit.ai/shared-state) shows frontend code only. The built-in agent injects the state section into its system prompt and hands itself `AGUISendStateSnapshot`/`AGUISendStateDelta` **only when the run arrives with a non-empty state object** — with the default `{}` the agent has no idea state exists. And `maxSteps` defaults to 1, so a state write ends the run before the agent replies. Neither is mentioned.

**10. Three of the four Server Tools samples reference undefined helpers**
[`/server-tools`](https://docs.copilotkit.ai/server-tools): `search()`, `db.tickets.create()`, `searchFlights()`, `db.users.findByEmail()`. They are shown verbatim on the route page rather than wired up.

**11. The `custom-agent` samples use a Hono-style default export**
[`/backend/custom-agent`](https://docs.copilotkit.ai/backend/custom-agent) ends every sample with `export default copilotEndpoint` from `createCopilotEndpoint`. A Next.js App Router route needs named `GET`/`POST` exports. The file is captioned `src/copilotkit.ts`, so this is arguably framework-neutral, but it will not work if pasted into `app/api/…/route.ts`.

**12. One tool, two names across pages**
Server Tools calls its weather tool `getWeather`; Tool Rendering and Programmatic Control render `get_weather`. A renderer binds only on an exact match, so no single tool satisfies both. This repo defines the sample under both names and puts each on a different agent.

**13. The Anthropic model ids in the docs are not Anthropic's model ids**
[`/model-selection`](https://docs.copilotkit.ai/model-selection) lists Claude ids with dotted versions — "Claude Sonnet 4.5", "Claude Opus 4.1", "Claude 3.5 Haiku" — and `BuiltInAgentModel` carries literals in the same shape (`"anthropic/claude-sonnet-4.5"`). But `resolveModel` passes everything after the prefix straight to `createAnthropic()(model)` with no normalisation, and Anthropic's API separates the version with **hyphens**. `anthropic:claude-sonnet-4.5` gets:

```
404  {"type":"error","error":{"type":"not_found_error","message":"model: claude-sonnet-4.5"}}
```

The working id is `claude-sonnet-4-5`, confirmed against `GET https://api.anthropic.com/v1/models`. Agent C uses the hyphenated form. This does not affect the other two providers — `gpt-4.1` and `gemini-2.5-flash` are exactly what OpenAI and Google expect, dots included.

**14. Four different model ids, one of them unsupported**
`openai:gpt-5.4-mini` (Quickstart, Server Tools, Advanced Configuration), `openai:gpt-4.1` (Copilot Runtime, Model Selection), `openai/gpt-4o-mini` (Runtime endpoints, AgentRunner), `gpt-4o` (custom-agent). `gpt-5.4-mini` does not appear in the Model Selection page's own list of supported OpenAI models, so the Quickstart pasted verbatim fails with a model-not-found error. All agents here read one `OPENAI_MODEL`.

**15. ✅ RESOLVED 2026-09-04 — `@copilotkit/react-ui` in the Quickstart install line**
It is the v1 UI package and nothing on the page imported from it. The install line is now `npm install @copilotkit/react-core @copilotkit/runtime`, with `@copilotkit/react-ui` dropped. Never a dependency here. **Not in any drift report** — the old install line was behind a conflict marker (§9.20).

**16. AI SDK provider version has to be pinned down, not up**
`@copilotkit/runtime` 1.66.2 depends on `ai` ^6.0.104, whose `LanguageModel` type is `LanguageModelV3 | LanguageModelV2`. The current `@ai-sdk/openai` 4.x emits spec `v4` and is rejected. This repo pins `@ai-sdk/openai` ^3.0.90.

**17. The two license-token pages contradict each other, and only the source resolves it**
[`/headless-threads`](https://docs.copilotkit.ai/headless-threads) gained a paragraph on 2026-09-04: "Managed project setup does not issue `COPILOTKIT_LICENSE_TOKEN`. That token is only for offline or self-hosted licensing and does not replace the managed project API key." Since `<CopilotThreadsDrawer>` gates its locked Upgrade view on `licenseStatus`, that reads as a dead end — a managed project could never reach `valid`.

It isn't one, and [`/backend/runtime-endpoints`](https://docs.copilotkit.ai/backend/runtime-endpoints) is what makes that findable: it documents `runtimeEntitlements` on `/info` for the first time in the same sync. The shipped `resolveCompatibilityLicenseStatus` checks entitlements **first** — a `ready` entitlement whose `source` is `managedOrgSubscription` resolves to `"valid"` when active, and only failing that does it fall back to the token's `licenseChecker`. So a managed project unlocks the drawer through its **entitlement**, not through a token it will never be issued. Neither page says so; the two read as a contradiction until you open `handleGetRuntimeInfo`.

Two more behaviours from that same function, on no page at all: `licenseStatus` is emitted **only** by an Intelligence runtime, so SSE mode reports none whatever the token says; and a retryable entitlement failure with no token fallback resolves to `"unknown"` rather than `"none"`.

**18. `SL_ENABLED` is documented as CLI output but is read by nothing installed**
[`/headless-threads`](https://docs.copilotkit.ai/headless-threads) says CLI `init`/`create` write "the cloud-hosted platform URLs, `SL_ENABLED`, project-scoped `CPK_INTELLIGENCE_API_KEY`, and optional `CPK_TELEMETRY_ID`" to `.env`. Three of those four check out: `CPK_TELEMETRY_ID` is read by the `CopilotRuntime` constructor as the fallback for `telemetryId`, and the project key is read as documented. `SL_ENABLED` appears nowhere in any installed `@copilotkit` package, and the page never says what it does. It is listed in `.env.example` as unverified rather than guessed at.

**19. "OpenAI-compatible" splits in two, and the page's own sample picks the wrong half for half the list**
[`/model-selection`](https://docs.copilotkit.ai/model-selection) added Novita to its list of OpenAI-compatible endpoints with a warning that it must be called as `provider.chat("model")`, not `provider("model")`. The cause is in `@ai-sdk/openai` 3.0.104, not in CopilotKit: `OpenAIProvider`'s bare call signature is typed `(modelId: OpenAIResponsesModelId) => LanguageModelV3` — calling the provider directly *is* the Responses API, with `.chat()`, `.responses()` and `.completion()` as the named alternatives. Any gateway on that list implementing only `/chat/completions` fails the same way, but the page names only Novita and its adjacent OpenRouter sample uses the bare form. Reproduced on the route with both samples side by side.

**20. The doc snapshot baseline was carrying unresolved merge conflicts**
Not a doc bug — a repo one, found while diffing item 19. The pre-sync snapshot at `8be8dd5` contained **114 conflict markers across 10 of the 21 tracked pages** (`quickstart`, `model-selection`, `backend__custom-agent`, `backend__copilot-runtime`, `backend__agent-runner`, `backend__runtime-endpoints`, `auth`, `inspector`, `advanced-configuration`, `backend__ag-ui`), left by the "Resolving Conflicts" merge in `e504bd9`. Since `/doc-sync` diffs each fetched page against that stored copy, every page with markers was diffing against a corrupted baseline, and content sitting on the far side of a `=======` was neither reported as drift nor visible as missing. The 2026-09-04 sync rewrote `pages/` and cleared all of them; one stray marker left in `doc-snapshot/CHANGELOG.md` is removed here.

**Audit status.** Seven of the ten are audited: `model-selection`, `backend__copilot-runtime`, `backend__runtime-endpoints`, `backend__custom-agent` and `backend__agent-runner` as part of their own drift reports, then `quickstart` (§9.1/§9.3/§9.15) and `auth` (§9.26) deliberately. **Three remain unaudited — `inspector` (6 markers), `advanced-configuration` (2), `backend__ag-ui` (2).** Every page audited so far turned up something the drift report could not see, so treat those three as unknown rather than clean.

**What that hid on `/model-selection`:** the doc's Anthropic table lists `claude-opus-4-8`, `claude-sonnet-4-6`, `claude-haiku-4-5` and `claude-sonnet-4-5`, and a **MiniMax** provider section with `MINIMAX_API_KEY` / `MINIMAX_BASE_URL` exists that this repo has no row for at all. The route's provider table still reads `claude-sonnet-4-5 · claude-opus-4-5 · claude-haiku-4-5` — and `claude-opus-4-5` appears nowhere in the doc. Not corrected in this PR; see the note on that route.

**21. Six of `/model-selection`'s doc samples are declared but never rendered**
Pre-existing. `BASIC`, `CUSTOM_KEY`, `CUSTOM_PROVIDER` and `AZURE` are string constants in `src/app/model-selection/page.tsx` that no JSX references, so the route shows a provider table and nothing else — `npm run lint` reports each as unused. `OPENROUTER` was in the same state until item 19 needed a panel to live in; it and the new Novita sample now render. The other four remain dead.

**22. Learning Containers moved off the runtime, and the sync could not see it**
[`/backend/copilot-runtime`](https://docs.copilotkit.ai/backend/copilot-runtime) now configures Learning Containers as `getLearningContainerId` on the `CopilotKitIntelligence` client. The previous shape was `ɵlearning: { containerId }` on `CopilotRuntime`. The 2026-09-04 drift report flagged only the env-var rename and a link move on this page, because the old shape was on the far side of a conflict marker in the stored copy (§9.20) — the comparison never saw it.

Both compile against 1.70.1: `ɵlearning` is still accepted and carries `@deprecated Configure getLearningContainerId on CopilotKitIntelligence`, so this is a migration, not a break. The callback argument was reshaped though — `userId: string` became `user: { id, name } | null` (nullable on the `channel` surface), and flat `threadId` / `runId` moved inside `input`, the AG-UI `RunAgentInput`. Two constraints appear only in the type's doc comment and nowhere on the page: the callback must return the same id for every run on a thread, since a thread cannot move Containers after first assignment; and returning `null`/`undefined` leaves the thread unassigned. Documented on the route; not implemented, as this repo has no Intelligence Project to create a Container in.

**23. `/info` grew two Intelligence-only fields, and the page documents one of the two entitlement error codes**
[`/backend/runtime-endpoints`](https://docs.copilotkit.ai/backend/runtime-endpoints) now documents `runtimeEntitlements` (`ready` / `degraded` / `misconfigured` / `unavailable`) and `inspectorMetadata: true`, both emitted only when `isIntelligenceRuntime(runtime) && webEnabled`. The page names `runtime_entitlements_misconfigured` (`retryable: false`, what a rejected project key produces). The runtime also emits `runtime_entitlements_unavailable` (`retryable: true`) for every other lookup failure, which appears nowhere on the page. `/info` still answers `200` in both cases by design — it is an availability endpoint. The probe in `src/lib/intelligence.ts` now parses both fields; neither is observable in this harness without a project key.

**24. The page now states §9.1 outright**
Its handler table gained a "Single-route only, no option" row naming `copilotRuntimeNextJSAppRouterEndpoint` and its four siblings — the v1 wrappers this repo has flagged as unable to serve Rich Threads since it was built (§9.1). The page is explicit that `useSingleEndpoint={false}` does not rescue them: it points the browser at REST sub-routes the wrapper will never serve, so moving off them is a server-side change, not a provider prop. A `createCopilotEndpointSingleRouteExpress` → `createCopilotExpressHandler` alias row was added alongside it. Nothing to change here — this harness has always mounted `createCopilotRuntimeHandler` at a catch-all — but §9.1 is now doc-acknowledged rather than a repo-only finding.

**25. Two pages document the same browser-controls-the-model capability, and only one of them warns about it**
[`/backend/custom-agent`](https://docs.copilotkit.ai/backend/custom-agent) hardened its `forwardedProps` samples on 2026-09-04. "Let the frontend override model, temperature, or other settings at runtime" became a rule — non-secret preferences only, validate every value against backend-owned limits, and never use these properties for credentials, tenant identity, authorization, or unrestricted model and provider selection. Concretely: `resolveModel(props.model)` became an equality check against one allowed id (and `resolveModel` left the imports), `temperature` gained a `0..1` bound, and the TanStack sample dropped its `openaiText((props.model as string) ?? "gpt-4o")` pass-through.

Nothing to fix in this repo's factories — `aiSdkAgent` and `tanStackAgent` never read `forwardedProps` and pin their models. But `advancedAgent` carries `overridableProperties: ["model", "temperature", "prompt"]`, which is the same capability through a different door: the browser picks model, sampling temperature and system prompt, unbounded. That array is published verbatim by [`/advanced-configuration`](https://docs.copilotkit.ai/advanced-configuration), which carries **no** warning of any kind and lists thirteen overridable properties including `providerOptions`. The two pages now give opposite guidance for equivalent mechanisms. This repo had already flagged the exposure on `/advanced-configuration` before either doc did — "a client can pick which model your key pays for" — so that callout is extended rather than added. Left as published, since correcting the array would stop the route matching its page.

**26. `/auth`'s thread-authorization half was never implemented here**
Found in the §9.20 audit, though not itself marker-hidden — `onBeforeHandler` appears in both the old and new snapshots. The route covered `onRequest` only, while the page's second half documents thread authorization: `onRequest` runs *before* routing and cannot see which thread is addressed, so ownership checks belong in `onBeforeHandler`, which receives a `route` carrying the `threadId`. Now documented on the route with the published sample; still not implemented, because this harness has no user store to own a `thread_owners` table.

The page's list of six threadId-carrying routes (`agent/stop`, `threads/update`, `threads/archive`, `threads/messages`, `threads/events`, `threads/state`) is exactly correct against the shipped `RouteInfo` union. But it treats `threads/list` as the sole route `onBeforeHandler` cannot authorize; `RouteInfo` shows `threads/subscribe`, `threads/clear` and the four `memories/*` routes are equally without a `threadId`, and `threads/clear` is a mutation. That gap is on no page.

Worth stating plainly: off CopilotKit Intelligence there is no server-side binding between a thread and a user, so **every thread route in this harness accepts any `threadId` it is handed.** That is documented behaviour for a runtime with no platform store, not a defect — but it is why no route here is a deployment pattern.

### Why `typescript.ignoreBuildErrors` is on

Items 5, 6, and 7 are doc samples reproduced verbatim, which is this repo's whole purpose — correcting them would defeat it. They produce **9 `tsc` errors across 4 demo files**, and Next refuses to build with any. `next.config.ts` sets `ignoreBuildErrors: true` with that reasoning recorded inline. `npm run typecheck` still prints the full list, and every one of them is called out on its own route page. No error outside those four files is being suppressed.

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Every chat errors immediately | No `OPENAI_API_KEY` | Set it in `frontend/.env.local` and restart — Next reads env at startup. |
| `RUN_ERROR: Incorrect API key provided` | Placeholder or wrong key | The key reaches the provider fine; it is the key itself that is rejected. |
| Model-not-found errors | A `gpt-5.4*` id from the docs | Set `OPENAI_MODEL` to something your account has, e.g. `openai:gpt-4.1`. |
| `404 not_found_error: model: claude-sonnet-4.5` | Anthropic ids use hyphens, the docs print dots | Use `anthropic:claude-sonnet-4-5`. Already the default here; if you set `ANTHROPIC_MODEL` yourself, hyphenate it. See §9.13. |
| `/backend/custom-agent` alone fails | That factory hardcodes the doc's `gpt-4o` | Either grant the key access or edit the model in `src/copilotkit/agents.ts`. |
| Tool runs but custom UI never renders | Renderer name ≠ tool name | `useRenderTool({ name })` must equal the tool's `name` exactly — `get_weather` ≠ `getWeather`. |
| Tool result appears, then silence | `maxSteps` is 1 | The run ended on the tool call. Raise `maxSteps` on that agent. |
| Agent never writes shared state | State was empty at run start | Seed a shape with `agent.setState` first; an empty `{}` means no state tools are offered. |
| No Inspector button | Provider is `CopilotKitProvider` | Use `<CopilotKit>`, which defaults `enableInspector` on in dev. Never mount `<CopilotKitInspector />` by hand. |
| "CopilotKit core not attached" | A hand-mounted inspector | Same fix — let the provider mount it. |
| `GET /api/copilotkit/info` 404s | Route on a fixed segment | It must be `app/api/copilotkit/[[...slug]]/route.ts`. |
| Key is set, but `/info` still reports `mode: "sse"` | `.env.local` carried over the pre-2026-09-04 name `INTELLIGENCE_API_KEY` | The runtime reads `CPK_INTELLIGENCE_API_KEY`. Nothing errors on the old name — the runtime just never sees a key and starts in SSE mode. Values now look like `cpk-…`. |
| Everything 401s | Pointed at `/api/copilotkit-auth` | That endpoint is gated on purpose. The app-wide provider uses `/api/copilotkit`. |
| `POST /api/copilotkit 404` + `Agent default not found`, but `curl …/info` returns 200 | `<CopilotKit>` defaults `useSingleEndpoint` to **true**, so the browser speaks single-route to a multi-route runtime | Pass `useSingleEndpoint={false}` on the provider. Already set here — if you see this, check you have not removed it. See §9.3. |
| Runner log empty but chat works | Runtime using the default runner | Check `runner: new MyRunner()` in the route file. |
| State/threads reset on restart | `InMemoryAgentRunner` | By design. Subclass it and write through to a store, or use the Intelligence runner. |
| `LanguageModelV4 is not assignable` | `@ai-sdk/openai` 4.x | Pin to ^3.0.90 — see §9.16. |

---

## Doc drift detection

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind all 21 tracked doc pages, diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

Doc pages are fetched by appending `.md` to their URL, which returns the authored MDX rather than 250 KB of rendered HTML. Every response is checked for `text/markdown` before it is allowed near the snapshot: a URL that misses the markdown handler still answers `200` with the HTML app shell, and writing that in would destroy the baseline and report the whole corpus as rewritten on the next run. A run commits all pages or none.

**Severity is decided by where the edit landed**, not how big it was:

| Level | Trigger |
|---|---|
| **High** | a changed line inside a fenced code block, a changed fence count, or a page that now 404s and is gone from the sitemap |
| **Medium** | a changed heading, changed frontmatter `title`/`description`, or prose in the same section as changed code |
| **Low** | other prose |

**Sections checked** lists every tracked page in nav order with a mark — `✓` unchanged, `!` changed, `+` stored, `✗` 404, `~` unstable, `·` not checked. Expanding a row shows the comparison: for a changed page the diff (`−` existing snapshot, `+` newly fetched), and for an unchanged one the two matching hashes, which is the evidence the check ran.

**`doc-snapshot/CHANGELOG.md`** is the record that survives a re-sync. Because syncing replaces the copy it just compared against, the run *after* a change reports nothing — so the changelog is written at the moment of discovery and never rewritten later. Only changed pages are recorded; a clean run does not touch the file. It keeps the three most recent dated entries, counted rather than aged, so a change from six weeks ago still shows if nothing has happened since.

**One sync date.** `syncedAt` in `doc-snapshot/manifest.json`, rewritten on every run and shown on `/`, `/status` and `/doc-sync`. There is no hand-maintained date to keep in step with it.

**To test it**, edit any `doc-snapshot/pages/*.md` file and press the button — a line inside a code fence for High, a `##` heading for Medium, a sentence for Low. The comparison reads the stored file itself, so nothing else needs changing. Both `/doc-sync` and the changelog label the result as a local snapshot edit rather than upstream drift.

Commit `doc-snapshot/` — `pages/`, `manifest.json` and `CHANGELOG.md` are the baseline every diff is taken against. `reports/` is gitignored derived data.

> **Note** — this repo's `DOCS_ROOT` is a page rather than a section prefix, so the sitemap check that spots doc pages added or removed upstream finds nothing to scope itself to and stays inert here. Page-by-page diffing is unaffected.

---

## 11. Project structure

```
built-in-agent/
├── CLAUDE.md
├── README.md
├── .env.example
│
└── frontend/                  # the whole app — Next.js + the agent in one process
    └── src/
        ├── copilotkit/
        │   ├── agents.ts             # ★ the 6 BuiltInAgent instances
        │   ├── tools.ts              # ★ defineTool server tools
        │   ├── runner.ts             # ★ MyRunner extends InMemoryAgentRunner
        │   ├── model.ts              # single model id for every agent
        │   └── auth-demo.ts          # demo token shared by the gated route + page
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx              # / — orientation + agent roster
        │   ├── status/page.tsx
        │   ├── api/
        │   │   ├── copilotkit/[[...slug]]/route.ts       # ★ the runtime
        │   │   ├── copilotkit-auth/[[...slug]]/route.ts  # ★ gated runtime (auth page)
        │   │   └── runner-log/route.ts                   # harness instrumentation
        │   └── <doc route>/
        │       ├── page.tsx          # notes + exact source (server component)
        │       └── demo-chat/page.tsx # ★ the running feature, chrome-free
        ├── components/
        │   ├── providers.tsx         # ★ <CopilotKit> + renderToolCalls
        │   ├── weather-tool.tsx      # ★ defineToolCallRenderer
        │   ├── source-code.tsx       # renders a repo file verbatim
        │   ├── code-figure.tsx       # shared, Shiki-highlighted code block
        │   ├── app-chrome.tsx        # sidebar layout, skipped on /demo-chat
        │   ├── demo-frame.tsx        # thin bar + back link for demo routes
        │   ├── nav-sidebar.tsx
        │   ├── route-header.tsx
        │   └── ui.tsx                # Panel, Callout, CodeBlock, TryIt
        └── lib/
            ├── nav-config.ts         # ★ single source of truth: routes, docs, status
            ├── source.ts             # server-only file reader
            └── highlight.ts          # server-only Shiki wrapper
```

---

## 12. References

**Getting Started** — [Quickstart](https://docs.copilotkit.ai/quickstart)

**Basics** — [Prebuilt Components](https://docs.copilotkit.ai/prebuilt-components)

**Rich Threads** — [Threads Drawer](https://docs.copilotkit.ai/prebuilt-components/copilot-threads-drawer) · [Headless Threads](https://docs.copilotkit.ai/headless-threads) · [Thread & History Lifecycle](https://docs.copilotkit.ai/threads-lifecycle)

**Custom Look and Feel** — [Slots](https://docs.copilotkit.ai/custom-look-and-feel/slots) † · [Headless UI](https://docs.copilotkit.ai/custom-look-and-feel/headless-ui) † · [Programmatic Control](https://docs.copilotkit.ai/programmatic-control) · [Inspector](https://docs.copilotkit.ai/inspector)

**Generative UI** — [Display-only](https://docs.copilotkit.ai/generative-ui/your-components/display-only) † · [Interactive](https://docs.copilotkit.ai/generative-ui/your-components/interactive) † · [Tool Rendering](https://docs.copilotkit.ai/generative-ui/tool-rendering)

**App Control** — [Frontend Tools](https://docs.copilotkit.ai/frontend-tools) · [Shared State](https://docs.copilotkit.ai/shared-state) · [Agent Context](https://docs.copilotkit.ai/agent-app-context)

**Built-in Agent** — [Server Tools](https://docs.copilotkit.ai/server-tools) · [Model Selection](https://docs.copilotkit.ai/model-selection) · [Advanced Configuration](https://docs.copilotkit.ai/advanced-configuration)

**Runtime** — [Copilot Runtime](https://docs.copilotkit.ai/backend/copilot-runtime) · [Runtime HTTP endpoints](https://docs.copilotkit.ai/backend/runtime-endpoints) · [Use any model router](https://docs.copilotkit.ai/backend/custom-agent) · [AgentRunner and persistence](https://docs.copilotkit.ai/backend/agent-runner) · [Connect AG-UI agents](https://docs.copilotkit.ai/backend/ag-ui) · [Authentication](https://docs.copilotkit.ai/auth)

**In the doc sidebar but outside this repo's scope** — MCP Servers · MCP Apps · A2UI · Synchronize Thread History · Threads & Persistence Architecture · Self-managed agents · Deploy to any runtime · Anonymous Telemetry · Intelligence Platform

**External** — [AG-UI protocol](https://ag-ui.com) · [Vercel AI SDK](https://ai-sdk.dev)

† Resolves but is absent from the doc sidebar as of the sync date.
