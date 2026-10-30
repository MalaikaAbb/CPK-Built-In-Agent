# CopilotKit + Built-in Agent Test Suite

A navigable, working test harness for CopilotKit's **built-in agent** — each doc page is a route that actually runs the thing it describes.

| | |
|---|---|
| **Doc sync date** | Machine-maintained — `doc-snapshot/manifest.json` → `syncedAt`. The 2026-10-30 page-by-page sync (§9.27–§9.47) was taken from the **rendered** pages, which the `.md`-based sync cannot see (§9.27). |
| **CopilotKit packages** | `@copilotkit/react-core` 1.83.0 · `@copilotkit/runtime` 1.83.0 · `@copilotkit/shared` 1.83.0 · `@copilotkit/core` 1.83.0 · `@copilotkit/a2ui-renderer` 1.83.0 |
| **AG-UI packages** | `@ag-ui/client` 1.0.3 · `@ag-ui/core` 1.0.3 (CopilotKit 1.83 pins 1.0.2 — kept at 1.0.3 by choice, §9.30) · `@ag-ui/mcp-apps-middleware` 0.1.2 |
| **Model routers** | `ai` 6.0.319 · `@ai-sdk/openai` 3.0.135 · `@ai-sdk/mcp` 1.0.100 · `@tanstack/ai` 1.0.1 · `@tanstack/ai-openai` 1.0.1 |
| **Generative UI libraries** | `@json-render/react` 0.21.3 · `@hashbrownai/react` 0.7.0 (pinned, §9.33) · `recharts` 3.10 · `maplibre-gl` 5.24 · `zod` 4.6.7 at the root, zod 3 scoped to `src/a2ui/` (§9.31) |
| **Frontend** | Next.js 16.3.0 (App Router) · React 19.2 · TypeScript 5 · Tailwind 4 |
| **Build status** | No CI. **After the 2026-10-30 sync: not run in a browser, no `next build`.** Every new route was checked with `tsc --noEmit` only; all remaining errors are listed in §9 and every one is in published doc code, a type-only package drift, or the duplicate `@ag-ui` copies. See §9.47 for two things that could still fail `next build`. The previous verification (1.70.1, headless Chrome) is out of date. |

---

## 2. Overview

CopilotKit's **built-in agent** is the one integration in this family with no third-party agent framework in it. `BuiltInAgent`, from `@copilotkit/runtime/v2`, *is* the agent: it owns the model call, the tool loop, MCP, and the AG-UI state tools, and it runs inside the Next.js process.

This repo covers the doc pages listed in §8 — the Basics, Generative UI, Interactivity and Agent-capabilities sections of the built-in agent's sidebar plus the Runtime pages — as one navigable Next app. Each route implements what its page teaches and shows the exact source that makes it work, read off disk at render time. The nav mirrors the docs sidebar's separators and folders.

**Everything comes from the documentation.** Doc code is copied verbatim, bugs included. Where a page's demo Code tab imports modules it never publishes, only leaf UI pieces (badge, button, card, layout) are written as labelled stand-ins; showcase test plumbing (header forwarding, aimock, CVDIAG) is dropped and named on the route; anything essential that is missing is left missing and reported (§9).

Tracks: **<https://docs.copilotkit.ai/quickstart>** (the built-in agent's pages sit at the site root, not under a framework slug).

---

## 3. Architecture

```
Browser (React 19)
  │  @copilotkit/react-core/v2 — <CopilotKitProvider>, CopilotChat, hooks
  │  POST /api/copilotkit/agent/:agentId/run   (SSE)
  │  GET  /api/copilotkit/info
  ▼
Next.js 16 App Router  ·  localhost:3000
  │  app/api/copilotkit/[[...slug]]/route.ts          ← the shared runtime (SSE only)
  │    CopilotRuntime (v2)  +  createCopilotRuntimeHandler
  │    runner: MyRunner extends InMemoryAgentRunner
  │  app/api/copilotkit-threads/[[...slug]]/route.ts  ← Threads Drawer + Headless
  │    Threads only: intelligence + identifyUser when CPK_INTELLIGENCE_API_KEY
  │    is set, otherwise SSE + InMemoryAgentRunner
  │  app/api/copilotkit-<demo>/[[...slug]]/route.ts   ← per-page runtimes, where
  │    the page publishes its own (A2UI, OGUI, JSON Render, Hashbrown,
  │    Components and surfaces, MCP Apps, MCP Servers, Authentication)
  ▼
BuiltInAgent instances  —  in the same process
  │  src/copilotkit/agents.ts and the per-page files beside it
  ▼
OpenAI · Anthropic · Google · MiniMax        local MCP servers (npx, §6)
```

**There is no backend directory, and no agent framework.** The agent ships inside `@copilotkit/runtime`. The app is one process on one port; the MCP pages additionally need the official reference servers started with `npx`.

The root provider is `<CopilotKitProvider>`, as the Quickstart now publishes it. **CopilotKit Intelligence is scoped to the two Threads routes**: their demos use `ThreadsProvider` (`src/components/threads-provider.tsx`) against `/api/copilotkit-threads`, and no other route touches the platform, so a missing or misconfigured project key cannot break them. Demo routes whose doc code mounts its own provider are listed in `src/lib/inspector.ts`, which switches the root Inspector off there so only one appears.

### Agents on the shared runtime

| Agent id | Config that matters | Used by |
|---|---|---|
| `default` | model only | Quickstart, Prebuilt Components, Slots, Headless UI, Frontend Tools, Agent Context, Governed Actions, WebMCP, AgentRunner, Threads Lifecycle (the Threads runtime registers the same agent as its `default`) |
| `serverToolsAgent` | `tools: [getWeather]` · `maxSteps: 2` | Server Tools |
| `renderingAgent` | `tools: [get_weather]` · `maxSteps: 2` | Tool Rendering, Programmatic Control, AG-UI, Runtime endpoints, Inspector, Slots levels 5–6 |
| `advancedAgent` | prompt · sampling params · `overridableProperties` · `urlDownload` | Advanced Configuration |
| `sharedStateAgent` | `maxSteps: 5` (state tools need >1) | Shared State |
| `modelSelectionAgent` | `overridableProperties: ["model"]` — model chosen per run via `forwardedProps.model` | Model Selection |
| `gen-ui-tool-based` / `gen-ui-tool-based-factory` | the page's prompt / its AI SDK factory | Components as Tools |
| `hitl-in-chat`, `readonly-state-agent-context` | the Quickstart agent under the ids the demos publish | HITL Overview, Agent Read-Only Context |
| `subagents` | the Code tab's TanStack factory + `buildSubagentTools` | Sub-agents |
| `aiSdkAgent` / `tanStackAgent` | factory mode, `gpt-4o` | Use any model router |

Several rather than one because what these pages teach *is* constructor configuration. Agent ids are the keys of the record passed to `new CopilotRuntime({ agents })`; a component with no `agentId` resolves to `default`.

---

## 4. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | **24+** | `@modelcontextprotocol/server-everything` 2.1 (MCP Servers route) requires 24. Developed on 24.16. |
| npm | 10+ | npm 12 refuses some lockfile tarballs by default — use `npm install --allow-remote=all` if `npm install` fails with `EALLOWREMOTE`. |
| OpenAI API key | — | Required. The default model is `openai:gpt-5.4-mini`; several pages hard-code `gpt-5.4`, `gpt-5.5` or `gpt-4o`, kept as published. |
| Anthropic / Google / MiniMax keys | — | Optional. Only `/model-selection` uses them. |

No Python, no separate agent process, no framework CLI.

---

## 5. Setup

```bash
git clone <this-repo> built-in-agent && cd built-in-agent
cd frontend && npm install        # also runs postinstall: links zod 3 into src/a2ui/
cp ../.env.example .env.local
```

Then edit `frontend/.env.local`:

| Variable | What it does |
|---|---|
| `OPENAI_API_KEY` | **Required.** Read server-side by `BuiltInAgent`; never exposed to the browser. |
| `OPENAI_MODEL` | Model id for every classic-mode agent outside Model Selection. Defaults to the Quickstart's `openai:gpt-5.4-mini`. |
| `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` / `MINIMAX_API_KEY` | Optional. Needed only for those providers' rows on `/model-selection`; the dropdown marks providers whose key is missing. |
| `MINIMAX_BASE_URL` | Optional. MiniMax's China endpoint, as the Model Selection page documents. |
| `MCP_HTTP_URL` / `MCP_SSE_URL` | Optional. Override the local MCP server URLs used on `/mcp-servers` (default `http://localhost:3001/mcp` and `http://localhost:3002/sse`). |
| `MCP_API_KEY` / `DB_MCP_KEY` | Optional. Read by the MCP Servers samples exactly as published; the reference server ignores auth. |
| `CPK_INTELLIGENCE_API_KEY` | Optional. The project API key. Turns on CopilotKit Intelligence **for the Threads runtime only** (`/api/copilotkit-threads`, used by Threads Drawer and Headless Threads): its `/info` reports `mode: "intelligence"` and threads persist. Every other route is unaffected. Older `.env.local` files may still say `INTELLIGENCE_API_KEY`, which nothing reads. |
| `COPILOTKIT_LICENSE_TOKEN` | Optional. Self-hosted/offline licensing for the Threads Drawer; cloud-hosted projects unlock through their subscription instead. See §9.17. |
| `CPK_TELEMETRY_ID` | Optional, non-secret. The `CopilotRuntime` constructor falls back to it when no `telemetryId` is passed. |
| `SL_ENABLED` | Documented as CLI output, read by no installed `@copilotkit` package — see §9.18. |
| `NEXT_PUBLIC_DEMO_USER_ID` / `NEXT_PUBLIC_DEMO_USER_NAME` | Optional. The identity the Threads runtime's `identifyUser` falls back to when no `x-user-id` header is sent. Changing it gives a different thread list. |
| `NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY` | Optional; no route here needs it. |

**Ports:** the app on **3000**. MCP servers, only when testing those routes: **3001** (Streamable HTTP), **3002** (SSE), **3108** (MCP Apps example — the port the MCP Apps page uses).

---

## 6. Running the project

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

**For `/mcp-servers` and `/generative-ui/mcp-apps` only**, start the official reference servers in separate terminals **before** `npm run dev` (the `mcpClients` samples connect at import time). Start them from a shell with no API keys exported — server-everything's `get-env` tool hands its process environment to the model.

```bash
npm run mcp:everything       # → "MCP Streamable HTTP Server listening on port 3001"
npm run mcp:everything:sse   # → SSE on http://localhost:3002/sse  (SSE samples only)
npm run mcp:apps             # → "MCP server listening on http://localhost:3108/mcp"
```

Quick health checks that need no model call:

```bash
curl -s http://localhost:3000/api/copilotkit/info          # → JSON listing every shared-runtime agent
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

Code on a page is never a re-typed approximation: each page reads real files via `src/lib/source.ts`. Where a page shows the *documentation's* code rather than this repo's, it is captioned as such. **Statuses for routes added on 2026-10-30 are from code inspection and `tsc` only — none has been driven in a browser yet.**

### Getting Started

**`/`** — Orientation and the agent roster.

**`/quickstart`** — `BuiltInAgent` + `CopilotSidebar` under `<CopilotKitProvider>`. **Try:** `Can you tell me a joke?` **Pass:** tokens stream and render as markdown; the Inspector's Agents › Agent tab lists `default`. **Fail:** an error banner — check `OPENAI_API_KEY`.

### Basics

**`/prebuilt-components`** — `CopilotChat`, `CopilotSidebar`, `CopilotPopup` in tabs. **Try:** say `Hello`, switch tabs, ask `what did I just say?` **Pass:** all three drive the same agent and the conversation survives the switch.

**`/custom-look-and-feel/slots`** — Six levels: class strings, prop overrides, a whole component, a children render function, and (new) `transformMessages` and `groupMessages`. **Try (levels 5–6):** `What's the weather in Tokyo and in Paris?` **Pass:** level 5 shows weather cards with results while tool-result messages are filtered out; level 6 folds the tool steps into an expandable "N tool steps" row that stays open when scrolled away and back. **Fail:** tool rows render individually in level 6.

**`/custom-look-and-feel/headless-ui`** — A chat with zero CopilotKit chrome. **Try:** `Write a long paragraph about otters`. **Pass:** text streams into hand-written bubbles and Stop halts it mid-sentence.

**`/programmatic-control`** — The agent as an object. **Try:** press **Run Agent** with the pre-filled weather prompt. **Pass:** status flips to Running, the subscriber list fills with `onRunStartedEvent` → `onRunFinalized`, and a weather card renders. **Fail:** nothing happens on Run.

**`/prebuilt-components/copilot-threads-drawer`** — Four variants: drawer + chat, drawer + `CopilotSidebar`, your own **New conversation** button, and an app-controlled `threadId`; plus a checkbox that injects the page's CSS-parts sample. **Try:** variant 3 — send a message, press the header button. **Pass:** the chat returns to the welcome screen, no row stays selected, and the new thread gets a row only after its first run. With the checkbox on, the drawer's own New-conversation row and (+) launcher disappear. **Fail:** an **Upgrade** view — the runtime has no entitlement (§9.17); check `/headless-threads`.

**`/headless-threads`** — `useThreads`, hand-rendered, including **rename**, plus (new) a strip driven by `useAgent({ agentId, runtimeAgentId, threadId })`. **Try:** select a thread. **Pass:** the strip shows that thread's id and its message count; rename/archive/delete work. **Fail:** the list stays empty while chat works — the runtime is in SSE mode.

**`/frontend-tools`** — `sayHello` executing in the browser. **Try:** `Say hello to Malaika`. **Pass:** a native browser alert, then the agent confirms.

### Generative UI

**`/generative-ui/tool-based`** — `useComponent` registers `render_bar_chart`; config-mode and factory-mode agents. **Try:** `Show me quarterly revenue as a bar chart`. **Pass:** a bar chart card inline on the first turn, with invented values. **Fail:** a prose answer or an empty card. Factory mode may answer in prose — the published factory has no system prompt.

**`/generative-ui/tool-rendering`** — Named renderer plus wildcard. **Try:** `What's the weather in Tokyo?` **Pass:** "Calling weather API..." becomes "Called the weather API for Tokyo."

**`/generative-ui/components`** (+ 8 sub-pages) — `generativeUI={{ ui }}` on a nested `CopilotKitProvider`, against the page's TanStack factory at `/api/copilotkit-genui`.
- **Overview:** `Compare the Starter, Team, and Enterprise plans in a table` → a table streams in; `add a column for support` changes it in place.
- **Surfaces:** `Show me cheap running shoes in the featured row` → the featured row is replaced; `Show the featured products again` restores the fallback.
- **Catalogs:** `Show me three running shoes as product cards` → a ProductGrid; the Export tab shows the catalog JSON.
- **Standard catalog:** `Show the Eiffel Tower and the Louvre on a map` → a map on `standardUI`, none on the variant that drops it.
- **State and actions:** add a product twice, then ask for cards → "In cart: 2"; Add to cart updates the cart with no chat message; choosing a plan posts a message; checkout edits persist.
- **Theming:** ask for a card with a button, slider and chart → amber accent; with dark mode toggled, the per-mode colours apply.
- **Transports:** tool transport → a component message; markdown transport → the table inline in the reply; `agentIds` → `shop` renders, `default` answers in text.
- **Markdown mode:** `seat-count slider at $29/seat` → a live slider inside the reply.
- **Adopt from A2UI:** `flight card SFO→JFK` → Airport, Arrow, Airport.

**Fail** on any of them: plain text where a component should be. Open Inspector → Generative UI; its Surfaces tab names rejected operations.

**`/generative-ui/a2ui/dynamic-schema`** — A BYO catalog the agent composes. **Try:** `Show me a sales dashboard with KPIs and revenue by region as a pie chart`. **Pass:** a composed surface with KPI tiles and a chart. **Fail:** plain text (the tool was not injected or not called), or "Catalog not found".

**`/generative-ui/a2ui/fixed-schema`** — The flight card. **Try:** `Find me a flight from SFO to JFK on United for $289`. **Pass:** a card showing SFO → JFK, a UNITED pill and $289. **Fail:** blank codes or React error #31 — the scoped zod 3 link is missing; rerun `npm install`.

**`/generative-ui/json-render`** — **Try:** `Show me the sales dashboard with metrics and a revenue chart`. **Pass:** the JSON streams, then becomes a MetricCard plus a Recharts chart. **Fail:** raw JSON stays in the bubble.

**`/generative-ui/hashbrown`** — **Try:** `Show me a sales dashboard with a revenue chart and key metrics`. **Pass:** the `{ui:[…]}` reply renders progressively as metric cards and Recharts charts. **Fail:** `Export prompt doesn't exist` — `@hashbrownai/*` was upgraded past 0.7.0 (§9.33).

**`/generative-ui/mcp-apps`** — needs `npm run mcp:apps`. **Try:** `What time is it on the server?` **Pass:** a `get-time` call, then an iframe card from `ui://get-time/mcp-app.html`. **Fail:** plain text — port 3108 is not up.

**`/generative-ui/open-generative-ui`** — **Try (minimal):** `Build an interactive bar chart of monthly signups with Chart.js`. **Pass:** a sandboxed iframe with a chart. **Try (advanced, `demo-chat/advanced`):** the Calculator suggestion. **Pass:** `evaluateExpression` logs in the console and the result appears in the iframe. **Fail:** a raw HTML code block.

### Interactivity

**`/shared-state`** — `agent.state` written from both sides. **Try:** `Add a task to buy groceries`, then **Dark Mode** and `what theme am I using?` **Pass:** the list grows and the agent answers "dark".

**`/shared-state/rendering-in-app`** — **Try:** `Rename the project to 'Spring release'`. **Pass:** the canvas updates in place; the write-back buttons toggle items. **Fail:** the canvas stays on "Untitled".

**`/shared-state/agent-readonly`** — **Try:** `What's my name and timezone?` **Pass:** Atai / America/Los_Angeles, following form edits; `Change my name` is refused. **Fail:** the agent does not know your name.

**`/human-in-the-loop`** — `useHumanInTheLoop` `book_call`. **Try:** `Please book an intro call with the sales team`. **Pass:** a time-picker card; pick a slot and the agent confirms the booking. **Fail:** a prose answer with no card.

**`/human-in-the-loop/governed-actions`** — **Try:** `Send a $40 refund to customer 1182 via approve_governed_action with verdict require_approval`. **Pass:** an approval card with Approve/Reject; `allow`/`deny` verdicts resolve without asking. **Fail:** no card.

**`/webmcp`** — **Pass:** the status line reports whether `document.modelContext` exists; in Chrome 149+ with WebMCP enabled, `searchOrders` appears in the Model Context Tool Inspector. **Every call throws** `searchOrders is not defined` (§9.39). **Fail:** the tool is missing from the inspector in a WebMCP-enabled browser.

**`/agent-app-context`** *(not in the sidebar)* — `useAgentContext`. **Try:** `Who am I, and what am I working on?` **Pass:** Jane Smith and both projects, with no tool call.

**`/generative-ui/your-components/display-only`**, **`/interactive`** *(not in the sidebar)* — `useComponent` and an approval gate; unchanged.

### Agent capabilities

**`/server-tools`** — `defineTool`. **Try:** `What's the weather in Lisbon?` **Pass:** a `getWeather` row with `{ temperature: 72, … }`, then a prose answer.

**`/mcp-servers`** — needs `npm run mcp:everything` (+ `mcp:everything:sse`). Ten samples in a picker. **Try:** `Use the echo tool to say hello` or `Add 17 and 25 with the sum tool`. **Pass:** the tool row completes (no sample sets `maxSteps`, so the run stops there). Collisions sample: `staging_echo`/`production_echo`; multiple servers: `mcp1_`/`mcp2_`/`mcp3_` prefixes; with server tools: `getUser` returns Jane, Admin. **Fail:** a run error naming 3001/3002; on the `mcpClients` samples, every message failing means the server was down at first import — restart `next dev`.

**`/model-selection`** — One agent, a dropdown of all 22 specifiers on the page (13 OpenAI, 4 Anthropic, 3 Google, 2 MiniMax); the choice goes out as `forwardedProps.model` on each run. **Try:** `Which model and provider are you?`, switch model, ask again. **Pass:** each message runs on the model shown when it was sent (check the Inspector's run input), in one continuing conversation; providers without a key are marked and do not run. **Fail:** a run error naming the model — that id or key is the finding; or every reply comes from `gpt-5.4-mini`, meaning the override is not reaching the agent.

**`/advanced-configuration`** — Every knob, `overridableProperties`, and (new) `urlDownload`. **Try:** the same question under each preset. **Pass:** the pirate prompt takes effect (whitelisted) and the token cap does not.

**`/multi-agent/subagents`** — **Try:** `Research the history of the bicycle, write a one-paragraph summary, then have it critiqued.` **Pass:** three inline sub-agent cards, three delegation-log entries, then a final answer. Delegation depends on the model choosing it unprompted — the supervisor prompt is unpublished (§9.35).

### Intelligence

**`/threads-lifecycle`** — Where a `threadId` comes from and what `explicit` changes. **Try:** **New chat**, **Open conversation**, **Set id, no replay**. **Pass:** as the route describes.

### Backend

**`/backend/copilot-runtime`** — Routing across agents. **Try:** `Hello`, then switch ids. **Pass:** each id streams and keeps its own transcript.

**`/backend/runtime-endpoints`** — **Try:** **GET /api/copilotkit/info**. **Pass:** `200 OK` listing the agents.

**`/backend/custom-agent`** — Factory mode, AI SDK and TanStack AI. **Try:** `Write two sentences about tide pools` in both tabs. **Pass:** both stream.

**`/backend/agent-runner`** — **Try:** send two messages. **Pass:** each adds a `run` line to the log.

**`/backend/ag-ui`** — **Try:** `What's the weather in Tokyo?` **Pass:** `RUN_STARTED` → `TEXT_MESSAGE_CONTENT`… → `TOOL_CALL_END` → `RUN_FINISHED`.

**`/auth`** — **Pass:** only the valid token works; the other two 401 on `GET /info`.

**`/inspector`** — **Pass:** a CopilotKit button in a viewport corner (dev only).

**`/status`** — Every route in one table.

---

## 8. Testing checklist / current status

| Doc page | Route | Status | Notes |
|---|---|---|---|
| `/quickstart` | `/` | 📖 Reference | Orientation + agent roster. |
| `/quickstart` | `/quickstart` | ✅ Working | Synced 2026-10-30: provider is `CopilotKitProvider` in `providers.tsx`; route exports PATCH/DELETE; Intelligence left in this repo's runtime for Headless Threads. |
| `/prebuilt-components` | `/prebuilt-components` | ✅ Working | No change on the page. |
| `/custom-look-and-feel/slots` | `/custom-look-and-feel/slots` | ✅ Working | Now in the sidebar. New: `transformMessages`, `groupMessages`, `workSummary`, `toolCallsView.group`. Sample type errors unchanged (§9.5). |
| `/custom-look-and-feel/headless-ui` | `/custom-look-and-feel/headless-ui` | ✅ Working | Now in the sidebar; only the page title changed. |
| `/programmatic-control` | `/programmatic-control` | ✅ Working | Prose-only change (resume via `copilotkit.runAgent`). |
| `/prebuilt-components/copilot-threads-drawer` | same | ✅ Working | New sidebar-host, own-button, controlled and CSS-parts samples as variants 2–4. Runs on `/api/copilotkit-threads` (§9.49). Not re-verified in a browser. |
| `/headless-threads` | `/headless-threads` | ✅ Working | New thread-scoped `useAgent` strip. Runs on `/api/copilotkit-threads` (§9.49). Not re-verified in a browser. |
| `/frontend-tools` | `/frontend-tools` | ✅ Working | No change on the page. |
| `/generative-ui/tool-based` | same | ✅ Working | Config + factory modes; pie chart and suggestions unpublished (§9.34). |
| `/generative-ui/tool-rendering` | same | ✅ Working | No change on the page (§9.6). |
| `/generative-ui/components` | same | ⚠️ Partial | Published factory; `chat()` without `threadId` is a type error (§9.29). |
| `/generative-ui/components/surfaces` | same | ⚠️ Partial | Product data and fallback row are scaffolding (§9.41). |
| `/generative-ui/components/catalogs` | same | ⚠️ Partial | `cartUI`, `Hero`, `Panel` scaffolding; export shown in-browser (§9.41). |
| `/generative-ui/components/standard-catalog` | same | ⚠️ Partial | `ProductCard`/`productSchema` scaffolding. |
| `/generative-ui/components/state-and-actions` | same | ⚠️ Partial | `Cart` and fragment catalogs scaffolding. |
| `/generative-ui/components/theming` | same | ⚠️ Partial | Colour-scheme script in body; placeholder `mapStyle` URLs. |
| `/generative-ui/components/transports` | same | ⚠️ Partial | Runtime snippet's `agent` undefined; `shop` agent is glue. |
| `/generative-ui/components/markdown-mode` | same | ⚠️ Partial | `sendContext: false` has only a Python backend on the page. |
| `/generative-ui/components/from-a2ui` | same | ⚠️ Partial | "After" runs; `Airport`/`Arrow` scaffolding. |
| `/generative-ui/a2ui/dynamic-schema` | same | ✅ Working | Prose path: `injectA2UITool: true` on the runtime, Quickstart agent (§9.37). |
| `/generative-ui/a2ui/fixed-schema` | same | ✅ Working | Needs the scoped zod 3 link (§9.31). |
| `/generative-ui/json-render` | same | ✅ Working | Test-plumbing imports commented out. |
| `/generative-ui/hashbrown` | same | ✅ Working | Hashbrown pinned to 0.7.0 for the Code tab's `prompt`/`examples` (§9.33). Not yet run in a browser. |
| `/generative-ui/mcp-apps` | same | ✅ Working | Needs `npm run mcp:apps`; the page publishes no server. |
| `/generative-ui/open-generative-ui` | same | ✅ Working | Unpublished design skill commented out (§9.36). |
| `/generative-ui/your-components/display-only` | same | ✅ Working | **Not in the doc sidebar.** |
| `/generative-ui/your-components/interactive` | same | ✅ Working | **Not in the doc sidebar.** |
| `/shared-state` | `/shared-state` | ✅ Working | Prose-only change (§9.9). |
| `/shared-state/rendering-in-app` | same | ✅ Working | `toggleItem` fragment wired to buttons (§9.43). |
| `/shared-state/agent-readonly` | same | ✅ Working | `demo-layout` stand-in. |
| `/human-in-the-loop/index` | `/human-in-the-loop` | ✅ Working | Pattern 1 only; Pattern 2 (`useInterrupt`) has no built-in-agent demo. |
| `/human-in-the-loop/governed-actions` | same | ✅ Working | HITL-tool path only; `useInterrupt` path skipped (§9.38). |
| `/webmcp` | `/webmcp` | ⚠️ Partial | `searchOrders` undefined; needs Chrome 149+ (§9.39). |
| `/agent-app-context` | same | ✅ Working | **Not in the doc sidebar.** |
| `/server-tools` | `/server-tools` | ✅ Working | Prose-only change; other samples still reference undefined helpers (§9.10). |
| `/mcp-servers` | `/mcp-servers` | ✅ Working | Needs `npm run mcp:everything`; placeholder hosts → local server (§9.40). |
| `/model-selection` | `/model-selection` | ✅ Working | All 22 specifiers, chosen per run on one agent via `overridableProperties: ["model"]` (§9.48). A provider runs only if its key is set. |
| `/advanced-configuration` | same | ✅ Working | `urlDownload` added; agent re-aligned with the page (§9.45). |
| `/multi-agent/subagents` | same | ⚠️ Partial | Supervisor prompt unpublished (§9.35). |
| `/threads-lifecycle` | same | ✅ Working | Not re-synced in this pass. Now on the SSE runtime, so history lasts only for the dev server's lifetime. |
| `/backend/copilot-runtime` | same | ✅ Working | Not re-synced in this pass (§9.2). |
| `/backend/runtime-endpoints` | same | ✅ Working | Not re-synced in this pass. |
| `/backend/custom-agent` | same | ⚠️ Partial | Not re-synced in this pass (§9.11). |
| `/backend/agent-runner` | same | ✅ Working | Not re-synced in this pass. |
| `/backend/ag-ui` | same | ✅ Working | Not re-synced in this pass. |
| `/auth` | `/auth` | ✅ Working | Not re-synced in this pass (§9.8). |
| `/inspector` | `/inspector` | ✅ Working | Not re-synced in this pass. |

**Legend:** ✅ Working · ⚠️ Partial · 📖 Reference · 🚧 Not started · ❌ Broken

> **Caveat on "Working":** for routes added or changed on 2026-10-30, "Working" means everything the feature needs is published and wired, and the code typechecks apart from the documented doc-verbatim errors. None of them has yet been driven against a live model in a browser.

---

## 9. Known issues / doc-vs-implementation discrepancies

Items 1–16 were found against `@copilotkit/react-core` 1.66.2, items 17–26 against 1.70.1, items 27–47 against 1.83.0 in the 2026-10-30 sync. Earlier items have not been re-verified on 1.83.0 except where marked.

**1. ✅ RESOLVED 2026-09-04 — The Quickstart's runtime route could not serve the documented HTTP surface**
[`/quickstart`](https://docs.copilotkit.ai/quickstart) used to mount a v1 `CopilotRuntime` plus `copilotRuntimeNextJSAppRouterEndpoint` at `app/api/copilotkit/route.ts`. A fixed Next.js segment matches that path and nothing beneath it, so `GET /info` and `POST /agent/:agentId/run` 404'd while the bare URL kept answering — the app looked connected and never replied.

The Quickstart now publishes `createCopilotRuntimeHandler` at `app/api/copilotkit/[[...slug]]/route.ts`, which is the shape this repo has mounted from the start. `copilotRuntimeNextJSAppRouterEndpoint` still exists, but is now confined to the "Single-route only, no option" row on [`/backend/runtime-endpoints`](https://docs.copilotkit.ai/backend/runtime-endpoints) (§9.24) rather than being what the Quickstart teaches. **This was not in any drift report** — the old shape sat behind a conflict marker (§9.20), so the comparison never saw it move. Still open on that page: it exports only `GET` and `POST`, so thread rename/archive/delete would 405 (see the route's own callout).

**2. Two different runtimes share the name `CopilotRuntime`**
[`/backend/copilot-runtime`](https://docs.copilotkit.ai/backend/copilot-runtime) shows a Next.js sample importing it from `@copilotkit/runtime` (v1, needs a `serviceAdapter`) and then documents `a2ui`, `mcpApps`, and `forwardHeaders`, which are options on the **v2** runtime in `@copilotkit/runtime/v2`. Nothing on the page distinguishes them.

**3. ✅ RESOLVED 2026-10-30 — `<CopilotKit>` defaulted to single-endpoint transport**
On 1.83.0 `<CopilotKit>` passes `useSingleEndpoint` through untouched (`undefined` → auto-detect), and the Quickstart now publishes `<CopilotKitProvider>`, which detects the transport from `/info`. This repo's root provider is `<CopilotKitProvider>` and no longer passes `useSingleEndpoint`. The original finding, for the record:

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

**13. ✅ RESOLVED 2026-10-30 — The Anthropic model ids in the docs were not Anthropic's model ids**
The page now lists hyphenated ids (`claude-opus-4-8`, `claude-sonnet-4-6`, …) and `BuiltInAgentModel` carries the same. The original finding:

[`/model-selection`](https://docs.copilotkit.ai/model-selection) lists Claude ids with dotted versions — "Claude Sonnet 4.5", "Claude Opus 4.1", "Claude 3.5 Haiku" — and `BuiltInAgentModel` carries literals in the same shape (`"anthropic/claude-sonnet-4.5"`). But `resolveModel` passes everything after the prefix straight to `createAnthropic()(model)` with no normalisation, and Anthropic's API separates the version with **hyphens**. `anthropic:claude-sonnet-4.5` gets:

```
404  {"type":"error","error":{"type":"not_found_error","message":"model: claude-sonnet-4.5"}}
```

The working id is `claude-sonnet-4-5`, confirmed against `GET https://api.anthropic.com/v1/models`. Agent C uses the hyphenated form. This does not affect the other two providers — `gpt-4.1` and `gemini-2.5-flash` are exactly what OpenAI and Google expect, dots included.

**14. ✅ RESOLVED 2026-10-30 — Four different model ids, one of them unsupported**
`openai:gpt-5.4-mini` is now in the Model Selection table, so this repo's default `OPENAI_MODEL` is the Quickstart's `openai:gpt-5.4-mini`. The original finding:

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

**What that hid on `/model-selection`:** the doc's Anthropic table lists `claude-opus-4-8`, `claude-sonnet-4-6`, `claude-haiku-4-5` and `claude-sonnet-4-5`, and a **MiniMax** provider section with `MINIMAX_API_KEY` / `MINIMAX_BASE_URL` exists that this repo has no row for at all. The route's provider table still reads `claude-sonnet-4-5 · claude-opus-4-5 · claude-haiku-4-5` — and `claude-opus-4-5` appears nowhere in the doc. Corrected on 2026-10-30: the route now carries every specifier on the page, MiniMax included.

**21. ✅ RESOLVED 2026-10-30 — Six of `/model-selection`'s doc samples were declared but never rendered**
The route was rebuilt; every published sample now renders. The original finding:

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


### Found in the 2026-10-30 sync (against 1.83.0)

**27. The `.md` export is not what the page shows for the built-in agent**
Every page's `<url>.md` carries the default (LangGraph/Python) snippets. The rendered page substitutes the built-in agent's own code: [`/multi-agent/subagents`](https://docs.copilotkit.ai/multi-agent/subagents) shows TanStack `subagent-tools.ts` where the `.md` has `subagents.py`, and [`/generative-ui/a2ui/fixed-schema`](https://docs.copilotkit.ai/generative-ui/a2ui/fixed-schema) drops its Python blocks entirely. This sync was taken from the rendered HTML and from the demo Code tabs (inline in each page's RSC payload). `/doc-sync` fetches `.md`, so it cannot see framework-specific snippet changes.

**28. The Quickstart's runtime sample renders with a stray `//,`**
`agents: { default: builtInAgent }, // [!code highlight],` in the source renders as `agents: { default: builtInAgent }, //,`. Harmless, but it is what a reader copies. Kept verbatim in the published-code panel.

**29. `@tanstack/ai` 1.0 rejects the published TanStack factories — at run time, not just in types**
Every published TanStack factory (Components and surfaces, A2UI fixed schema, OGUI, Sub-agents, JSON Render, Hashbrown, and this repo's existing `tanStackAgent`) was written against `@tanstack/ai` 0.x and calls `chat({ adapter, messages, … })` without `threadId`. 1.0.1 checks it at run time and throws `chat() needs a threadId. Pass a non-empty string…` before contacting the model; a call inside a tool surfaces as that tool's `{ error }` result. Several also use `openaiText("gpt-5.4")`, which is not in `@tanstack/ai-openai` 1.0.1's model union — that one is type-only. Calls patched with `threadId: input.threadId` are marked `[harness]` or carry a comment saying the published call omits it; the Sub-agents nested call is one of them (§9.35).

**30. Duplicate `@ag-ui` copies**
CopilotKit 1.83 pins `@ag-ui/client`/`core` to exactly 1.0.2; this repo's root is 1.0.3 by choice (it is what Hashbrown 0.8.3 pins). npm therefore installs nested 1.0.2 copies under each `@copilotkit/*` package, and TypeScript treats `AbstractAgent` from the two as unrelated ("separate declarations of a private property `_debug`"). Visible as type errors in `/programmatic-control` (`agent.subscribe`) and on `MCPAppsMiddleware` in `.use()`. Runtime is unaffected (`use()` does no `instanceof` check). Aligning `dependencies` + `overrides` to 1.0.2 removes them.

**31. Two doc pages need different zod majors from the same `import { z } from "zod"`**
The A2UI pages say `npm install @copilotkit/a2ui-renderer zod`, which installs zod 4. The A2UI binder (`@a2ui/web_core` 0.10.4) still detects bindable props through zod 3 internals (`_def.typeName`), so under zod 4 `{ path: "/origin" }` reaches the renderer unresolved and the card crashes with React error #31 — the failure the fixed-schema page itself warns about, from a different cause. `@json-render/react` has a hard peer dependency on zod ^4. This repo keeps zod 4 at the root and, via `scripts/link-a2ui-zod.mjs` (run as `postinstall`), symlinks `src/a2ui/node_modules/zod` to the renderer's own zod 3 copy, so the A2UI catalog files keep the doc's import verbatim and resolve zod 3.

**32. Every demo Code tab imports showcase modules the page never publishes**
`header-forwarding` (`forwardingFetch`, `withForwardedHeaders`), `demo-stream`, `cvdiag-backend`, `demo-prompts`, `agentic-chat-factory`, `reasoning-factory`, `server-tools`, `state-tools`, `suggestions`, `demo-layout`, `_components/*`, `chat`. The test plumbing (header forwarding for aimock, CVDIAG, the 404→400 probe wrapper, the demo loop strategy) is dropped and named on each route; leaf UI pieces are labelled stand-ins. What could not be filled is listed per page below.

**33. Hashbrown's Code tab targets Hashbrown 0.7, and the page names no version**
[`/generative-ui/hashbrown`](https://docs.copilotkit.ai/generative-ui/hashbrown)'s renderer imports `prompt` from `@hashbrownai/core` and passes `useUiKit({ examples })`. Both were removed in 0.8.0; installing the latest (0.8.3) fails with `Export prompt doesn't exist in target module` — a module error that breaks `next build` for the whole app, not just a type error. This repo pins `@hashbrownai/core` and `@hashbrownai/react` to exactly **0.7.0**, the last release with both; the renderer's other imports (`exposeComponent`, `exposeMarkdown`, `useJsonParser`, `s`) exist there, and its `@ag-ui` 1.0.2 pin matches CopilotKit 1.83's. The published code is unchanged.

**34. Components as Tools: pie chart, suggestions and prompt are unpublished**
The Code tab imports `./pie-chart` and `./suggestions`; the showcase route uses `GEN_UI_TOOL_BASED_PROMPT`. The page's prose publishes its own complete config-mode agent and `SYSTEM_PROMPT`, which is what runs. The published factory-mode agent passes no system prompt, so it may answer in prose.

**35. Sub-agents: the supervisor prompt is unpublished**
`SUBAGENTS_PROMPT` comes from `demo-prompts`, which the page does not show. The published tools, factory and `delegations` state run without it, so delegation depends on the request wording and the tool descriptions. `stateTools`/`baseServerTools` (tools for other showcase demos) are dropped; with them gone, a `Set.has` in the factory narrows to the three sub-agent literals and no longer typechecks (type-only). The nested sub-agent `chat()` in `subagent-tools.ts` omitted `threadId`, so every delegation returned `{"error":"chat() needs a threadId…"}` (§9.29); `buildSubagentTools` now also takes the parent run's `threadId` and passes it, marked `[harness]`.

**36. Open Generative UI: the design skill is unpublished**
The minimal demo passes `openGenerativeUI={{ designSkill: VISUALIZATION_DESIGN_SKILL }}` from `./design-skill`, which is never shown. Commented out; the provider's default design skill applies.

**37. A2UI pages: prose and Code tab disagree**
Dynamic schema: the prose says a catalog auto-injects `generate_a2ui` and the runtime needs no `a2ui` block; the built-in-agent Code tab opts out (`injectA2UITool: false`) and a TanStack agent owns `generate_a2ui` through `a2ui-factory.ts`. This repo runs the prose path instead (`injectA2UITool: true`, the Quickstart agent) and does not use that factory. The opt-out tool is printed as LangGraph Python (`get_a2ui_tools`) even on this page, and the "progressive streaming" section describes LangGraph only. Fixed schema: the prose runtime snippet sets `a2ui.agents`; the Code-tab route does not. The renderers read theme CSS variables (`--card`, `--border`, `--muted-foreground`, …) no page defines.

**38. Governed Action Approval UI**
`z.record(z.unknown())` is a TypeScript error under zod 4 (two or three arguments expected) but works at runtime. `executeSideEffect` is never defined. The card uses `text-muted-foreground` / `bg-muted`, which this app does not define. The `useInterrupt` half is reference only: `BuiltInAgent` never emits interrupts.

**39. WebMCP: `searchOrders` is never defined**
Both samples call it. Kept undefined, so every call throws; registration onto `document.modelContext` is verbatim and testable in Chrome 149+.

**40. MCP Servers / MCP Apps**
MCP Servers uses only placeholder hosts (pointed here at the official `@modelcontextprotocol/server-everything`, URL kept as a comment per line); `ToolSet` is used without an import; the dynamic-auth sample calls `isTokenExpired`, `getFreshToken`, `makeTransport`, `currentClient`, and `persistentClient` is undefined (labelled stand-ins). MCP Apps publishes no server; this repo runs the official ext-apps example (`@modelcontextprotocol/server-basic-react`) on the page's port 3108.

**41. Components and surfaces sub-pages are fragments**
They use `cartUI`, `Hero`, `Panel`, `Product`, `ProductRow`, `Cart`, `ProductCard`, `productSchema`, `Airport`, `Arrow` without defining them (labelled scaffolding in `_shared/scaffolding.tsx`). The export sample needs Node `fs`; the Transports runtime snippet references an undefined `agent`; Theming's `mapStyle` URLs are placeholders; `sendContext: false` has only a Python backend (undefined `MY_PROMPT`, unimported `json`); the Catalogs `ProductCard` description refers to a tool result no page provides, so the agent invents products.

**42. JSON Render and Hashbrown factories contradict each other on JSON mode**
Hashbrown's factory says it removed `response_format` and relies on the prompt; JSON Render's says prompt-only output dropped closing braces, so it restored `text.format`. Both read showcase theme variables that are not published.

**43. Shared-state sub-pages**
Rendering-in-app's `toggleItem` fragment has an implicit-`any` parameter. Agent Read-Only Context credits `CopilotKitMiddleware`, which is the LangGraph mechanism; for the built-in agent `useAgentContext` reaches the model directly.

**44. Threads Drawer samples**
`publicLicenseKey` is gone from the provider; entitlement is server-side now. The new samples nest their own `CopilotKitProvider` and use `height: 100dvh`, so inside the harness's demo frame variants 2–3 can overflow. `ControlledChat` is printed without imports or a provider.

**45. Advanced Configuration had drifted before this sync**
This repo's agent lacked the page's `topK: 40` and `stopSequences: ["END"]`, and its Anthropic `providerOptions` sample was the older `thinking: { type: "enabled", budgetTokens }` on `claude-sonnet-4-5`; the page uses `{ thinking: { type: "adaptive" }, effort: "high" }` on `claude-sonnet-4-6`. All three now match the page, along with the new `urlDownload`.

**46. Slots' list-level samples name no agent**
`transformMessages`/`groupMessages` only show an effect when tool calls are in the thread, so the demo mounts the unchanged samples inside `CopilotChatConfigurationProvider agentId="renderingAgent"`.

**47. Two things that may break `next build` (unverified)**
`next build` was not run after this sync. Hashbrown's missing `prompt` export failed at bundle time before the 0.7.0 pin (§9.33). The `mcpClients` samples connect to the MCP server with top-level `await` at import, so a build that evaluates those route modules with no server running could fail. `next dev` isolates both to their own routes.

**48. Model Selection switches the model per run, which the page itself does not present**
[`/model-selection`](https://docs.copilotkit.ai/model-selection) says the model is configured on the agent, that CopilotKit exposes no hosted endpoint for switching it per request, and that switching per user or request means constructing the agent you want. This repo's route nevertheless uses one agent with `overridableProperties: ["model"]` — the mechanism [`/advanced-configuration`](https://docs.copilotkit.ai/advanced-configuration) documents — and sends the dropdown's specifier as the provider's `properties`, which CopilotKit forwards on every run. That lets the browser pick any model the keys reach, which [`/backend/custom-agent`](https://docs.copilotkit.ai/backend/custom-agent) warns against in production. Chosen deliberately for a local harness. The demo mounts its own provider so the `model` property cannot reach other routes' runs (Advanced Configuration's agent also accepts it).

**49. Intelligence is scoped to its own runtime here, which no page does**
The Threads pages put `intelligence` on the app's one runtime at `/api/copilotkit`. With it there, every route depends on the platform: an inactive project or failed entitlement lookup makes every run fail with `Timed out joining channel` (`CHANNEL_JOIN_TIMEOUT`) while the client waits on the realtime channel. This repo therefore keeps the shared runtime SSE-only, as the Quickstart now publishes it, and serves the Threads Drawer and Headless Threads demos from `/api/copilotkit-threads`. The drawer's verbatim variants 2–3 have their published `runtimeUrl="/api/copilotkit"` changed to that path, labelled in each file.

### Why `typescript.ignoreBuildErrors` is on

Doc samples are reproduced verbatim, which is this repo's whole purpose — correcting them would defeat it. `npm run typecheck` prints every resulting error; each is listed above (items 5–7, 29, 30, 35, 38–40, 43) and called out on its route page. `next.config.ts` sets `ignoreBuildErrors: true` so those type errors do not stop `next build`; it does not cover module-resolution errors (§9.47).

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Every chat errors immediately | No `OPENAI_API_KEY` | Set it in `frontend/.env.local` and restart — Next reads env at startup. |
| `RUN_ERROR: Incorrect API key provided` | Placeholder or wrong key | The key reaches the provider fine; it is the key itself that is rejected. |
| Model-not-found errors | The default `openai:gpt-5.4-mini`, or a page's hard-coded `gpt-5.4`/`gpt-5.5`/`gpt-4o`, is not on your account | Set `OPENAI_MODEL` for the classic agents; hard-coded ids are the page's and are kept. `/model-selection` shows exactly which ids your keys can reach. |
| `/backend/custom-agent` alone fails | That factory hardcodes the doc's `gpt-4o` | Either grant the key access or edit the model in `src/copilotkit/agents.ts`. |
| Tool runs but custom UI never renders | Renderer name ≠ tool name | `useRenderTool({ name })` must equal the tool's `name` exactly — `get_weather` ≠ `getWeather`. |
| Tool result appears, then silence | `maxSteps` is 1 | The run ended on the tool call. Raise `maxSteps` on that agent. |
| Agent never writes shared state | State was empty at run start | Seed a shape with `agent.setState` first; an empty `{}` means no state tools are offered. |
| No Inspector button | Production build, or a route listed in `src/lib/inspector.ts` (its own provider mounts the Inspector instead) | The provider mounts it in development only. Never mount `<CopilotKitInspector />` by hand. |
| "CopilotKit core not attached" | A hand-mounted inspector | Same fix — let the provider mount it. |
| `GET /api/copilotkit/info` 404s | Route on a fixed segment | It must be `app/api/copilotkit/[[...slug]]/route.ts`. |
| Key is set, but `/info` still reports `mode: "sse"` | `.env.local` carried over the pre-2026-09-04 name `INTELLIGENCE_API_KEY` | The runtime reads `CPK_INTELLIGENCE_API_KEY`. Nothing errors on the old name — the runtime just never sees a key and starts in SSE mode. Values now look like `cpk-…`. |
| `Timed out joining channel` on Threads routes | The Intelligence project behind `CPK_INTELLIGENCE_API_KEY` is not active on the realtime service (`/api/copilotkit-threads/info` shows `runtimeEntitlements.status: "unavailable"`) | Check the project in the CopilotKit dashboard, or unset the key to run those two routes on SSE. Other routes are unaffected (§9.49). |
| Everything 401s | Pointed at `/api/copilotkit-auth` | That endpoint is gated on purpose. The app-wide provider uses `/api/copilotkit`. |
| `POST /api/copilotkit 404` + `Agent default not found`, but `curl …/info` returns 200 | A provider forced to `useSingleEndpoint` against a multi-route runtime | Leave `useSingleEndpoint` unset (auto) or `false`. See §9.3. |
| Runner log empty but chat works | Runtime using the default runner | Check `runner: new MyRunner()` in the route file. |
| State/threads reset on restart | `InMemoryAgentRunner` | By design. Subclass it and write through to a store, or use the Intelligence runner. |
| `LanguageModelV4 is not assignable` | `@ai-sdk/openai` 4.x | Pin to the `ai-v6` line (3.x) — see §9.16. |
| A2UI fixed-schema card blank or React error #31 | `src/a2ui/node_modules/zod` link missing, so A2UI definitions got zod 4 | `cd frontend && npm run postinstall` (or `npm install`). See §9.31. |
| `/mcp-servers` or `/generative-ui/mcp-apps` run errors naming 3001/3002/3108 | The reference MCP server is not running | `npm run mcp:everything` / `mcp:everything:sse` / `mcp:apps`, then restart `next dev` for the `mcpClients` samples. |
| `Export prompt doesn't exist in target module` | `@hashbrownai/*` upgraded past 0.7.0 | Keep both pinned to exactly 0.7.0 — see §9.33. |
| `EALLOWREMOTE` on `npm install <pkg>` | npm 12 default | `npm install --allow-remote=all <pkg>`. |

---

## Doc drift detection

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind all 21 tracked doc pages, diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

> **Blind spot** — the `.md` export carries LangGraph-default snippets, not the built-in agent's; framework-specific code changes are invisible to this sync (§9.27).

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
└── frontend/                       # the whole app — Next.js + the agent in one process
    ├── scripts/link-a2ui-zod.mjs   # postinstall: zod 3 for src/a2ui only (§9.31)
    └── src/
        ├── copilotkit/
        │   ├── agents.ts           # ★ the shared runtime's agents record
        │   ├── model.ts            # default model + the Model Selection table
        │   ├── tools.ts            # defineTool server tools
        │   ├── runner.ts           # MyRunner extends InMemoryAgentRunner
        │   ├── tool-based.ts       # Components as Tools agents + prompt
        │   ├── subagents/          # Sub-agents tools + Code-tab factory
        │   ├── genui-factories/    # A2UI fixed-schema + OGUI factories (Code tab)
        │   ├── mcp-servers.ts      # mcpServers samples
        │   ├── mcp-clients/        # mcpClients samples
        │   ├── mcp-local.ts        # local MCP URLs
        │   └── auth-demo.ts
        ├── a2ui/                   # A2UI catalogs (definitions, renderers) — resolves zod 3
        ├── lib/
        │   ├── nav-config.ts       # ★ routes, docs, status — mirrors the doc sidebar
        │   ├── inspector.ts        # routes whose demo mounts its own provider
        │   ├── factory/            # JSON Render + Hashbrown factories (Code tab)
        │   ├── source.ts · highlight.ts · doc-sync/
        ├── components/
        │   ├── providers.tsx       # ★ root <CopilotKitProvider>
        │   ├── threads-provider.tsx # provider for the Threads runtime
        │   ├── weather-tool.tsx · source-code.tsx · demo-frame.tsx · route-header.tsx · ui.tsx
        └── app/
            ├── layout.tsx · page.tsx · status/ · doc-sync/
            ├── api/
            │   ├── copilotkit/[[...slug]]/route.ts            # ★ shared runtime (SSE)
            │   ├── copilotkit-threads/ …                      # Intelligence — Threads routes only
            │   ├── copilotkit-auth/ …                         # gated runtime (auth page)
            │   ├── copilotkit-genui/ · copilotkit-genui-transports/
            │   ├── copilotkit-a2ui-fixed-schema/ · copilotkit-declarative-gen-ui/ · copilotkit-ogui/
            │   ├── copilotkit-declarative-json-render/ · copilotkit-declarative-hashbrown/
            │   ├── copilotkit-mcp-apps/ · copilotkit-mcp-servers/ · copilotkit-mcp-clients/
            │   └── runner-log/route.ts
            └── <doc route>/
                ├── page.tsx              # notes + exact source (server component)
                └── demo-chat/            # ★ the running feature + its doc files
```

---

## 12. References

Grouped as the doc sidebar groups them.

**Getting Started** — [Quickstart](https://docs.copilotkit.ai/quickstart)

**Basics** — [Prebuilt Components](https://docs.copilotkit.ai/prebuilt-components) · [Slots](https://docs.copilotkit.ai/custom-look-and-feel/slots) · [Headless UI](https://docs.copilotkit.ai/custom-look-and-feel/headless-ui) · [Programmatic Control](https://docs.copilotkit.ai/programmatic-control) · [Threads Drawer](https://docs.copilotkit.ai/prebuilt-components/copilot-threads-drawer) · [Headless Threads](https://docs.copilotkit.ai/headless-threads) · [Frontend Tools](https://docs.copilotkit.ai/frontend-tools)

**Generative UI** — [Components as Tools](https://docs.copilotkit.ai/generative-ui/tool-based) · [Tool Call Rendering](https://docs.copilotkit.ai/generative-ui/tool-rendering) · [Components and surfaces](https://docs.copilotkit.ai/generative-ui/components) ([Surfaces](https://docs.copilotkit.ai/generative-ui/components/surfaces) · [Catalogs](https://docs.copilotkit.ai/generative-ui/components/catalogs) · [Standard catalog](https://docs.copilotkit.ai/generative-ui/components/standard-catalog) · [State and actions](https://docs.copilotkit.ai/generative-ui/components/state-and-actions) · [Theming](https://docs.copilotkit.ai/generative-ui/components/theming) · [Transports](https://docs.copilotkit.ai/generative-ui/components/transports) · [Markdown mode](https://docs.copilotkit.ai/generative-ui/components/markdown-mode) · [Adopt from A2UI](https://docs.copilotkit.ai/generative-ui/components/from-a2ui)) · [Dynamic Schema A2UI](https://docs.copilotkit.ai/generative-ui/a2ui/dynamic-schema) · [Fixed Schema A2UI](https://docs.copilotkit.ai/generative-ui/a2ui/fixed-schema) · [JSON Render](https://docs.copilotkit.ai/generative-ui/json-render) · [Hashbrown](https://docs.copilotkit.ai/generative-ui/hashbrown) · [MCP Apps](https://docs.copilotkit.ai/generative-ui/mcp-apps) · [Open Generative UI](https://docs.copilotkit.ai/generative-ui/open-generative-ui) · [Display-only](https://docs.copilotkit.ai/generative-ui/your-components/display-only) † · [Interactive](https://docs.copilotkit.ai/generative-ui/your-components/interactive) †

**Interactivity** — [Shared State](https://docs.copilotkit.ai/shared-state) · [Render agent state in your app](https://docs.copilotkit.ai/shared-state/rendering-in-app) · [Agent Read-Only Context](https://docs.copilotkit.ai/shared-state/agent-readonly) · [HITL Overview](https://docs.copilotkit.ai/human-in-the-loop/index) · [Governed Action Approval UI](https://docs.copilotkit.ai/human-in-the-loop/governed-actions) · [WebMCP](https://docs.copilotkit.ai/webmcp) · [Agent Context](https://docs.copilotkit.ai/agent-app-context) †

**Agent capabilities** — [Server Tools](https://docs.copilotkit.ai/server-tools) · [MCP Servers](https://docs.copilotkit.ai/mcp-servers) · [Model Selection](https://docs.copilotkit.ai/model-selection) · [Advanced Configuration](https://docs.copilotkit.ai/advanced-configuration) · [Sub-agents](https://docs.copilotkit.ai/multi-agent/subagents)

**Intelligence** — [Thread & History Lifecycle](https://docs.copilotkit.ai/threads-lifecycle)

**Backend** — [Copilot Runtime](https://docs.copilotkit.ai/backend/copilot-runtime) · [Runtime HTTP endpoints](https://docs.copilotkit.ai/backend/runtime-endpoints) · [Use any model router](https://docs.copilotkit.ai/backend/custom-agent) · [AgentRunner and persistence](https://docs.copilotkit.ai/backend/agent-runner) · [Connect AG-UI agents](https://docs.copilotkit.ai/backend/ag-ui) · [Authentication](https://docs.copilotkit.ai/auth) · [Inspector](https://docs.copilotkit.ai/inspector)

**In the doc sidebar but not covered here** — State Rendering · A2UI overview · State Streaming · Pausing the Agent for Input · Headless Interrupts · Write your own AG-UI agent · Message history · Self-managed agents · Deploy to any runtime · Intelligence pages

**External** — [AG-UI protocol](https://ag-ui.com) · [Vercel AI SDK](https://ai-sdk.dev) · [MCP ext-apps](https://github.com/modelcontextprotocol/ext-apps)

† Resolves but is absent from the doc sidebar as of 2026-10-30.
