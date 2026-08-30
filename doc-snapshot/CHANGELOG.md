# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-25

### 06:00 UTC — 8 pages, highest severity high

**High — Authentication**

`/auth` · route `/auth` · under “When to use this”

75 code lines, 6 headings, 18 prose lines changed. The number of fenced code blocks changed.

````diff
- <WhenFrameworkHas flag="auth_pattern" equals="runtime-onrequest">
- ## Frontend
- Pass your token via the `headers` prop on `<CopilotKit>`. CopilotKit forwards every request with that header attached.
- ```tsx title="frontend/src/app/page.tsx"
- import { CopilotKit } from "@copilotkit/react-core/v2";
- <CopilotKit
- runtimeUrl="/api/copilotkit"
- headers={{
````

**High — AgentRunner and persistence**

`/backend/agent-runner` · route `/backend/agent-runner` · under “Choosing a runner” · in a `ts` block

6 code lines changed.

````diff
- ```ts title="app/api/copilotkit/route.ts"
+ ```ts title="app/api/copilotkit/[[...slug]]/route.ts"
- ```ts title="app/api/copilotkit/route.ts"
+ ```ts title="app/api/copilotkit/[[...slug]]/route.ts"
- ```ts title="app/api/copilotkit/route.ts"
+ ```ts title="app/api/copilotkit/[[...slug]]/route.ts"
````

**High — Copilot Runtime**

`/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “Setting up the runtime” · in a `ts` block

55 code lines, 1 heading, 30 prose lines changed. The number of fenced code blocks changed.

````diff
- ```ts title="app/api/copilotkit/route.ts"
+ ```ts title="app/api/copilotkit/[[...slug]]/route.ts" doctest="component"
- ExperimentalEmptyAdapter,
- copilotRuntimeNextJSAppRouterEndpoint,
- } from "@copilotkit/runtime";
- import { NextRequest } from "next/server";
- 
- const serviceAdapter = new ExperimentalEmptyAdapter();
````

**High — Use any model router**

`/backend/custom-agent` · route `/backend/custom-agent` · under “Quick Start” · in a `typescript` block

19 code lines, 9 prose lines changed.

````diff
- createCopilotEndpoint,
+ createCopilotRuntimeHandler,
- createCopilotEndpoint,
+ createCopilotRuntimeHandler,
- createCopilotEndpoint,
+ createCopilotRuntimeHandler,
- model: anthropic("claude-sonnet-4", {
+ model: anthropic("claude-sonnet-4-6", {
````

**High — Runtime HTTP endpoints**

`/backend/runtime-endpoints` · route `/backend/runtime-endpoints` · under “Provider and handler pairs”

14 code lines, 3 headings, 92 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Provider and handler pairs
+ 
+ The browser provider and the Runtime handler have to agree on the **transport**.
+ CopilotKit ships more than one name for each half, and they are not
+ interchangeable: each provider setting requires a matching handler mode.
+ Different pages and older apps show different pairs, so this table is the
+ mapping:
+ 
````

**High — Model Selection**

`/model-selection` · route `/model-selection` · under “Model Selection”

29 code lines, 1 heading, 66 prose lines changed. The number of fenced code blocks changed.

````diff
- models from OpenAI, Anthropic, and Google, or pass any custom AI SDK model.
+ built-in model strings or pass any custom AI SDK model.
- | Model | Specifier |
- |-------|-----------|
- | GPT-5 | `openai:gpt-5` |
- | GPT-5 Mini | `openai:gpt-5-mini` |
- | GPT-4.1 | `openai:gpt-4.1` |
+ | Model        | Specifier             |
````

**High — Introduction**

`/quickstart` · routes `/`, `/quickstart`, `/doc-sync` · under “Install CopilotKit packages” · in a `npm` block

28 code lines, 1 heading, 41 prose lines changed.

````diff
- npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
+ npm install @copilotkit/react-core @copilotkit/runtime
+ 
+ The components used below (`CopilotKit`, `CopilotSidebar`) and the
+ stylesheet all come from `@copilotkit/react-core/v2`, so
+ `@copilotkit/react-ui` is not needed for this setup.
- ```ts title="app/api/copilotkit/route.ts"
+ <Callout type="warn" title="Already have an agent? Do not use BuiltInAgent">
````

**Low — Inspector**

`/inspector` · route `/inspector` · under “What it shows”

21 prose lines changed.

````diff
- The CopilotKit Inspector is a built-in debugging tool that overlays on your app, giving you full visibility into what's happening between your frontend and your agents in real time.
+ The CopilotKit Inspector is a built-in debugging tool that overlays on your app.
+ The first open lands on **Home**. Later opens return to the last pane you used.
+ | **Home** | Project, runtime, services, and CopilotKit news. |
+ | **Memory** | Inspect long-term memory when Intelligence exposes it. |
- The primary navigation groups the Inspector into **Threads**, **Agents**, and
- **Learning**. Threads is the default. Open a real Thread to inspect its
+ The sidebar has three groups: **Home**, **Workbench** (Threads, Memory), and
````

---

## 2026-08-17

### 12:35 UTC — 1 page, highest severity high

**High — Your Components · Interactive** · _local snapshot edit, not an upstream change_

`/generative-ui/your-components/interactive` · route `/generative-ui/your-components/interactive` · under “Create a frontend human-in-the-loop tool” · in a `tsx` block

3 code lines changed.

````diff
- 
+ import { useHumanInTheLoop } from "@copilotkit/react-core/v2"; // [!code highlight]
+ import { z } from "zod";
````
