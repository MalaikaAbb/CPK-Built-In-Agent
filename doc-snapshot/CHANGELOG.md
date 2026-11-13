# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-13

### 11:08 UTC — 12 pages, highest severity high

**High — Dynamic Schema A2UI**

`/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “Implement the React renderers” · in a `typescript` block

9 code lines changed.

````diff
- up: "#059669",
- down: "#dc2626",
+ up: "light-dark(#059669, #34d399)",
+ down: "light-dark(#dc2626, #f87171)",
+ stroke="var(--card)"
- <Tooltip />
+ <Tooltip contentStyle={tooltipStyle} />
- <Tooltip />
````

**High — Fixed Schema A2UI**

`/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Implement the React renderers” · in a `typescript` block

16 code lines changed.

````diff
- <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
+ <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-muted-foreground">
- <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900">
+ <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900 dark:text-foreground">
- <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900">
+ <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900 dark:text-foreground">
- <Separator className="flex-1 bg-neutral-200" />
+ <Separator className="flex-1 bg-neutral-200 dark:bg-border" />
````

**High — Components and surfaces**

`/generative-ui/components` · route `/generative-ui/components` · under “What is this?”

118 code lines, 44 prose lines changed. The number of fenced code blocks changed.

````diff
- With components and surfaces, the agent renders real React or Angular components while it answers:
+ With components and surfaces, the agent renders real React, Angular, React Native or Vue components while it answers:
- These steps add generative UI to a Next.js or Angular app, with an OpenAI model through TanStack AI.
+ These steps add generative UI to a Next.js, Angular, React Native or Vue app, with an OpenAI model through TanStack AI.
- Already have CopilotKit running? Do step 3 only. Your runtime needs no change: when the provider sends a catalog, the runtime gives that run a `render_ui` tool and a short guide. Your agent must pass the run's tools and context to its model, as in step 2. For a LangGraph Python agent, add `CopilotKitMiddleware`.
+ Already have CopilotKit running? Do step 3 only. Your runtime needs no change: when the provider sends a catalog with at least one component, the runtime gives that run a `render_ui` tool and a short guide. Your agent must pass the run's tools and context to its model, as in step 2. For a LangGraph Python agent, add `CopilotKitMiddleware`.
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
````

**High — Catalogs**

`/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs` · under “Create a catalog”

128 code lines, 43 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ A component of the catalog is a React Native component. It renders native views, and a slot arrives as React nodes:
+ 
+ ```tsx title="src/shopUI.tsx"
+ import { Image, StyleSheet, Text, View } from "react-native";
+ import { z } from "zod";
````

**High — Adopt from A2UI**

`/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui` · under “Adopt from A2UI”

49 code lines, 1 heading, 35 prose lines changed. The number of fenced code blocks changed.

````diff
- > Move an app from the a2ui renderer (A2UI v0.9) to components and surfaces (A2UI 1.0): the provider, the catalog, the operations, and what the agent receives.
+ > Move an app from the a2ui renderer to components and surfaces: the provider, the catalog, the operations, and what the agent receives.
- The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is the A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
+ The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9 by default, with explicit A2UI 1.0 support in React: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is a separate A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
+ ## Use 1.0 with the React a2ui renderer
+ 
+ You can keep the `a2ui` provider option and opt into the native 1.0 basic catalog:
+ 
````

**High — Markdown mode**

`/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode` · under “What is this?”

18 code lines, 14 prose lines changed. The number of fenced code blocks changed.

````diff
+ <Callout type="info" title="React Native">
+ Markdown mode is not available on React Native yet. `GenerativeUIProvider` from `@copilotkit/react-native/generative-ui` uses the [tool transport](/generative-ui/components/transports#tool-transport) only: `transport: "markdown"` is a type error, and passed from JavaScript it is dropped, with a warning in development.
+ </Callout>
+ 
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "Vue"]} persist>
+ <Tab value="Vue">
+ ```vue title="src/App.vue"
````

**High — Standard catalog**

`/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog` · under “What is this?”

42 code lines, 25 prose lines changed. The number of fenced code blocks changed.

````diff
+ <Callout type="info" title="React Native">
+ The standard components render DOM, so React Native has no `standardUI` yet. Build a catalog of your own native components with `createGenerativeUI`; see [Catalogs](/generative-ui/components/catalogs) and [Generative UI with your own components](/react-native#generative-ui-with-your-own-components).
+ </Callout>
+ 
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "Vue"]} persist>
+ <Tab value="Vue">
+ ```vue
````

**High — State and actions**

`/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions` · under “Show live app state”

175 code lines, 52 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ ```tsx title="src/shopUI.tsx"
+ const cartSchema = z.object({
+ items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
+ });
+ 
````

**High — Surfaces**

`/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces` · under “What is this?”

149 code lines, 59 prose lines changed. The number of fenced code blocks changed.

````diff
- - **The chat.** Always there. The agent can use every component of the catalog.
- - **A page target.** An area of your page that you mark with `GenerativeUISurface`, or `<copilot-generative-ui-surface>` in Angular. The agent sees it only while it is on screen.
+ - **The chat.** Always there. The agent can use every component of the catalog. On React Native, you draw chat surfaces yourself, with `GenerativeUIActivity`; see [Chat surfaces on React Native](#chat-surfaces-on-react-native). The agent is offered the chat target even when the app shows no chat, so a React Native app that renders only `GenerativeUISurface` targets, or only the prebuilt `CopilotChat` (which does not draw surfaces yet), never shows a surface aimed at the chat.
+ - **A page target.** An area of your page that you mark with `GenerativeUISurface`, or `<copilot-generative-ui-surface>` in Angular. The agent sees it only while it is mounted.
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ ```tsx title="src/FeaturedProducts.tsx"
````

**High — Theming**

`/generative-ui/components/theming` · route `/generative-ui/components/theming` · under “What is this?”

35 code lines, 18 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "Vue"]} persist>
+ <Tab value="Vue">
+ ```vue
+ <script setup lang="ts">
+ import { CopilotKitProvider } from "@copilotkit/vue/v2";
+ import { standardUI, type GenerativeUITheme } from "@copilotkit/vue/v2/generative-ui";
+ 
````

**High — Transports**

`/generative-ui/components/transports` · route `/generative-ui/components/transports` · under “What is this?”

18 code lines, 29 prose lines changed. The number of fenced code blocks changed.

````diff
- The agent must send the UI to the browser somehow. Some agents are good at tool calls. Others only stream text, or you build their prompt yourself. A **transport** is the way the UI travels:
+ The agent must send the UI to the app somehow: the browser, or a React Native app. Some agents are good at tool calls. Others only stream text, or you build their prompt yourself. A **transport** is the way the UI travels:
- Both transports use the same catalogs, surfaces, and components. Only the path between the agent and the browser changes.
+ Both transports use the same catalogs, surfaces, and components. Only the path between the agent and the app changes.
- | Checked before the browser gets it | yes, by the runtime, and again in the browser | in the browser |
+ | Checked before the app gets it | yes, by the runtime, and again in the app | in the app |
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
````

**High — Sub-agents**

`/multi-agent/subagents` · route `/multi-agent/subagents` · under “Rendering a live delegation log” · in a `typescript` block

30 code lines changed.

````diff
- className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden"
+ className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden dark:bg-card dark:border-border"
- <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC]">
+ <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC] dark:border-border dark:bg-muted">
- <span className="text-lg font-semibold text-[#010507]">
+ <span className="text-lg font-semibold text-[#010507] dark:text-foreground">
- className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em]"
+ className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em] dark:text-foreground"
````

---

## 2026-11-11

### 14:07 UTC — 31 pages, highest severity high

**High — Advanced Configuration**

`/advanced-configuration` · route `/advanced-configuration` · under “Multi-step tool calling” · in a `typescript` block

18 code lines changed.

````diff
- model: "openai:gpt-5.4-mini",
+ model: "openai:gpt-6-luna",
- model: "openai:gpt-5.4-mini",
+ model: "openai:gpt-6-luna",
- model: "openai:gpt-5.4-mini",
+ model: "openai:gpt-6-luna",
- model: "openai:gpt-5.4-mini",
+ model: "openai:gpt-6-luna",
````

**High — AgentRunner and persistence**

`/backend/agent-runner` · route `/backend/agent-runner` · under “Choosing a runner” · in a `ts` block

6 code lines changed.

````diff
- agents: { default: new BuiltInAgent({ model: "openai/gpt-4o-mini" }) },
+ agents: { default: new BuiltInAgent({ model: "openai/gpt-6-luna" }) },
- agents: { default: new BuiltInAgent({ model: "openai/gpt-4o-mini" }) },
+ agents: { default: new BuiltInAgent({ model: "openai/gpt-6-luna" }) },
- agents: { default: new BuiltInAgent({ model: "openai/gpt-4o-mini" }) },
+ agents: { default: new BuiltInAgent({ model: "openai/gpt-6-luna" }) },
````

**High — Copilot Runtime**

`/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “The default agent” · in a `ts` block

2 code lines changed.

````diff
- default: new BuiltInAgent({ model: "openai:gpt-4.1" }),
+ default: new BuiltInAgent({ model: "openai:gpt-6-luna" }),
````

**High — Use any model router**

`/backend/custom-agent` · route `/backend/custom-agent` · under “When to use Simple Mode vs Factory Mode”

24 code lines, 4 prose lines changed.

````diff
- | **Model resolution** | Built-in (`"openai/gpt-4o"`) | You set up the model yourself |
+ | **Model resolution** | Built-in (`"openai/gpt-6-luna"`) | You set up the model yourself |
- model: openai("gpt-4o"),
+ model: openai("gpt-6-luna"),
- adapter: openaiText("gpt-4o"),
+ adapter: openaiText("gpt-6-luna"),
- return streamText({ model: openai("gpt-4o", { apiKey }), ... });
+ return streamText({ model: openai("gpt-6-luna", { apiKey }), ... });
````

**High — Runtime HTTP endpoints**

`/backend/runtime-endpoints` · route `/backend/runtime-endpoints` · under “Single-route mode” · in a `ts` block

2 code lines changed.

````diff
- agents: { default: new BuiltInAgent({ model: "openai/gpt-4o-mini" }) },
+ agents: { default: new BuiltInAgent({ model: "openai/gpt-6-luna" }) },
````

**High — Model Selection**

`/model-selection` · route `/model-selection` · under “Supported Models”

6 code lines, 18 prose lines changed.

````diff
- The tables list the models these docs use. The quickstart uses `openai:gpt-5.4-mini`.
+ The tables list the models these docs use. The quickstart uses `openai:gpt-6-luna`.
- | GPT-5.5      | `openai:gpt-5.5`      |
- | GPT-5.4      | `openai:gpt-5.4`      |
- | GPT-5.4 Mini | `openai:gpt-5.4-mini` |
- | GPT-5        | `openai:gpt-5`        |
- | GPT-5 Mini   | `openai:gpt-5-mini`   |
- | GPT-4.1      | `openai:gpt-4.1`      |
````

**High — Introduction**

`/quickstart` · routes `/`, `/quickstart`, `/doc-sync` · under “Setup Copilot Runtime” · in a `ts` block

2 code lines changed.

````diff
- model: "openai:gpt-5.4-mini",
+ model: "openai:gpt-6-luna",
````

**High — Server Tools**

`/server-tools` · route `/server-tools` · under “Defining a tool” · in a `typescript` block

6 code lines changed.

````diff
- model: "openai:gpt-5.4-mini",
+ model: "openai:gpt-6-luna",
- model: "openai:gpt-5.4-mini",
+ model: "openai:gpt-6-luna",
- model: "openai:gpt-5.4-mini",
+ model: "openai:gpt-6-luna",
````

**Info — Dynamic Schema A2UI**

`/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema`

Now tracked for the first time.

**Info — Fixed Schema A2UI**

`/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema`

Now tracked for the first time.

**Info — Components and surfaces**

`/generative-ui/components` · route `/generative-ui/components`

Now tracked for the first time.

**Info — Catalogs**

`/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs`

Now tracked for the first time.

**Info — Adopt from A2UI**

`/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui`

Now tracked for the first time.

**Info — Markdown mode**

`/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode`

Now tracked for the first time.

**Info — Standard catalog**

`/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog`

Now tracked for the first time.

**Info — State and actions**

`/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions`

Now tracked for the first time.

**Info — Surfaces**

`/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces`

Now tracked for the first time.

**Info — Theming**

`/generative-ui/components/theming` · route `/generative-ui/components/theming`

Now tracked for the first time.

**Info — Transports**

`/generative-ui/components/transports` · route `/generative-ui/components/transports`

Now tracked for the first time.

**Info — Hashbrown**

`/generative-ui/hashbrown` · route `/generative-ui/hashbrown`

Now tracked for the first time.

**Info — JSON Render**

`/generative-ui/json-render` · route `/generative-ui/json-render`

Now tracked for the first time.

**Info — MCP Apps**

`/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps`

Now tracked for the first time.

**Info — Open Generative UI**

`/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui`

Now tracked for the first time.

**Info — Components as Tools**

`/generative-ui/tool-based` · route `/generative-ui/tool-based`

Now tracked for the first time.

**Info — Governed Action Approval UI**

`/human-in-the-loop/governed-actions` · route `/human-in-the-loop/governed-actions`

Now tracked for the first time.

**Info — HITL Overview**

`/human-in-the-loop/index` · route `/human-in-the-loop`

Now tracked for the first time.

**Info — MCP Servers**

`/mcp-servers` · route `/mcp-servers`

Now tracked for the first time.

**Info — Sub-agents**

`/multi-agent/subagents` · route `/multi-agent/subagents`

Now tracked for the first time.

**Info — Agent Read-Only Context**

`/shared-state/agent-readonly` · route `/shared-state/agent-readonly`

Now tracked for the first time.

**Info — Render agent state in your app**

`/shared-state/rendering-in-app` · route `/shared-state/rendering-in-app`

Now tracked for the first time.

**Info — WebMCP**

`/webmcp` · route `/webmcp`

Now tracked for the first time.

---

---

## 2026-10-30

### 09:20 UTC — 8 pages, highest severity high

**High — Advanced Configuration**

`/advanced-configuration` · route `/advanced-configuration` · under “URL attachments”

19 code lines, 1 heading, 19 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## URL attachments
+ 
+ When a message has an image or file given by URL, and the model cannot take that URL directly, the server downloads the file and sends its content to the model. Use `urlDownload` to control these downloads:
+ 
+ ```typescript
+ const agent = new BuiltInAgent({
+ model: "openai:gpt-5.4-mini",
+ urlDownload: { // [!code highlight:4]
````

**High — Model Selection**

`/model-selection` · route `/model-selection` · under “Google”

34 code lines, 2 headings, 65 prose lines changed. The number of fenced code blocks changed.

````diff
- | Gemini 2.5 Pro        | `google:gemini-2.5-pro`        |
- | Gemini 2.5 Flash      | `google:gemini-2.5-flash`      |
- | Gemini 2.5 Flash Lite | `google:gemini-2.5-flash-lite` |
+ | Gemini 3.8 Flash      | `google:gemini-3.8-flash`      |
+ | Gemini 3.5 Flash      | `google:gemini-3.5-flash`      |
+ | Gemini 3.5 Flash Lite | `google:gemini-3.5-flash-lite` |
- model: "google:gemini-2.5-pro",
+ model: "google:gemini-3.8-flash",
````

**High — Threads Drawer**

`/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “Add your own "New conversation" button”

41 code lines, 1 heading, 19 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Add your own "New conversation" button
+ 
+ The Drawer has its own "New Conversation" row. Your app can also keep its own
+ button, for example in a toolbar or a page header. To start a new conversation
+ from that button, call `startNewThread()` from
+ [`useCopilotChatConfiguration`](/reference/hooks/useCopilotChatConfiguration).
+ This is the same function the Drawer calls for its own row.
+ 
````

**Medium — Slots**

`/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “`messageView` sub-slots”

1 heading, 10 prose lines changed.

````diff
+ | `workSummary`      | The "Working… / Worked for 9s" line when `toolCallDisplay` is `"turn"`.     |
- | `toolCallsView`    | Tool call visualization.           |
+ | `toolCallsView`    | Tool call visualization. Has its own sub-slot (see below). |
+ 
+ ### `toolCallsView` sub-slots
+ 
+ Available via `messageView={{ assistantMessage: { toolCallsView: { ... } } }}`:
+ 
````

**Low — Copilot Runtime**

`/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “CopilotKit Intelligence”

2 prose lines changed.

````diff
- [Threads](/threads), the [inspector](/inspector), and other CopilotKit Intelligence capabilities are provided through the runtime. These give you conversation persistence and debugging without extra setup.
+ [Threads](/AG-UI-Streams), the [inspector](/inspector), and other CopilotKit Intelligence capabilities are provided through the runtime. These give you conversation persistence and debugging without extra setup.
````

**Low — Use any model router**

`/backend/custom-agent` · route `/backend/custom-agent` · under “How It Works”

7 prose lines changed.

````diff
+ <Callout type="info" title="Using CopilotKit Intelligence? Replace runner with intelligence">
+ Intelligence stores the threads and runs for you, so remove `runner` and pass
+ `intelligence` (and `identifyUser`) to `CopilotRuntime` instead. The custom
+ agent and its `factory` do not change. See
+ [An existing runtime that already has a runner](/intelligence/quickstart#an-existing-runtime-that-already-has-a-runner).
+ </Callout>
+ 
````

**Low — Inspector**

`/inspector` · route `/inspector` · under “Follow and reproduce a run”

2 prose lines changed.

````diff
- [Thread](/threads) and choose **Try from here**. Inspector copies its
+ [Thread](/AG-UI-Streams) and choose **Try from here**. Inspector copies its
````

**Info — Runtime HTTP endpoints**

`/backend/runtime-endpoints` · route `/backend/runtime-endpoints`

Content changed.

---

---
