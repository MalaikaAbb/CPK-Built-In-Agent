# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

<<<<<<< HEAD
=======
## 2026-08-26

### 09:46 UTC — 10 pages, highest severity high

**High — Advanced Configuration**

`/advanced-configuration` · route `/advanced-configuration` · under “Provider-specific options” · in a `typescript` block

6 code lines changed.

````diff
- // Anthropic with extended thinking
+ // Anthropic with adaptive thinking
- model: "anthropic:claude-sonnet-4-5",
+ model: "anthropic:claude-sonnet-4-6",
- anthropic: { thinking: { type: "enabled", budgetTokens: 10000 } },
+ anthropic: { thinking: { type: "adaptive" }, effort: "high" },
````

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

`/backend/agent-runner` · route `/backend/agent-runner` · under “The built-in runners”

6 code lines, 10 prose lines changed.

````diff
- | `IntelligenceAgentRunner` | `@copilotkit/runtime/v2` | Backs the Enterprise Intelligence Platform with durable threads, cross-instance persistence, and threads/history features. Used automatically on an Intelligence runtime. |
+ | `IntelligenceAgentRunner` | `@copilotkit/runtime/v2` | Backs CopilotKit Intelligence with durable threads, cross-instance persistence, and threads/history features. Used automatically on an Intelligence runtime. |
- the Enterprise Intelligence Platform's `IntelligenceAgentRunner` or supply your
+ CopilotKit Intelligence's `IntelligenceAgentRunner` or supply your
- ```ts title="app/api/copilotkit/route.ts"
+ ```ts title="app/api/copilotkit/[[...slug]]/route.ts"
- ```ts title="app/api/copilotkit/route.ts"
+ ```ts title="app/api/copilotkit/[[...slug]]/route.ts"
````

**High — Copilot Runtime**

`/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “Setting up the runtime” · in a `ts` block

55 code lines, 3 headings, 32 prose lines changed. The number of fenced code blocks changed.

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

33 code lines, 15 prose lines changed.

````diff
- createCopilotEndpoint,
+ createCopilotRuntimeHandler,
- createCopilotEndpoint,
+ createCopilotRuntimeHandler,
- createCopilotEndpoint,
+ createCopilotRuntimeHandler,
- model: anthropic("claude-sonnet-4", {
- thinking: { type: "enabled", budgetTokens: 10000 },
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

`/quickstart` · routes `/`, `/quickstart`, `/doc-sync` · under “Quickstart”

39 code lines, 1 heading, 66 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
- body="Add persistent threads and the inspector with the Enterprise Intelligence Platform."
+ body="Add persistent threads and the inspector with CopilotKit Intelligence."
- <SignupLink surface="docs_built_in_agent_quickstart_step1">Sign up for a free developer account</SignupLink> on our Enterprise Intelligence Platform to get a license key. You'll use it later to enable persistent threads and the inspector.
+ <SignupLink surface="docs_built_in_agent_quickstart_step1">Sign up for a free developer account</SignupLink> for CopilotKit Intelligence to get a license key. You'll use it later to enable persistent threads and the inspector.
- npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
+ npm install @copilotkit/react-core @copilotkit/runtime
+ 
````

**Low — Connect AG-UI agents**

`/backend/ag-ui` · route `/backend/ag-ui` · under “The proxy pattern”

2 prose lines changed.

````diff
- routing, and CopilotKit Enterprise Intelligence without changing how the
+ routing, and CopilotKit Intelligence without changing how the
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

>>>>>>> f5ec48e (Docs Sync: Aug 26)
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
