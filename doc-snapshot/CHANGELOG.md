# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

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

## 2026-10-21

### 14:32 UTC — 18 pages, highest severity high

**High — Authentication**

`/auth` · route `/auth` · under “When to use this”

3 code lines, 44 prose lines changed.

````diff
- If you don't need any of those, skip auth entirely. The agent runs anonymously and the frontend never has to care about tokens.
+ If you run the TypeScript runtime without Intelligence and do not need any of those, your agent can run anonymously. Intelligence runtimes require a trusted application-user identity for protected web requests.
+ <Callout type="info" title="Runtime authentication APIs">
+ The runtime hooks on this page use the TypeScript API. Python, Go, Ruby, and C#/.NET use their host's request and authentication APIs; follow their [Intelligence setup examples](/intelligence/quickstart#connect-your-runtime). In every language, resolve the user from a verified session or token and keep the Intelligence API key on the server.
+ </Callout>
+ 
- The Intelligence runtime requires an `identifyUser` callback — construction throws without one (or without at least one Channel). It runs on the server, once per request, and the id it returns is the scope the runtime hands to the platform. (`intelligence` below is a `CopilotKitIntelligence` instance; [Connect your runtime to Intelligence](/intelligence/connect-your-runtime) covers building it.)
+ The Intelligence runtime requires an `identifyUser` callback — construction throws without one (or without at least one Channel). It runs on the server, once per request, and the id it returns is the scope the runtime hands to the platform. (`intelligence` below is a `CopilotKitIntelligence` instance; [Connect your runtime to Intelligence](/intelligence/quickstart) covers building it.)
````

**High — AgentRunner and persistence**

`/backend/agent-runner` · route `/backend/agent-runner` · under “AgentRunner and persistence”

4 code lines, 39 prose lines changed. The number of fenced code blocks changed.

````diff
- Every CopilotKit runtime delegates agent execution and persistence to an
+ The TypeScript CopilotKit runtime delegates agent execution and persistence to an
+ <Callout type="info" title="TypeScript runner APIs">
+ The runner classes and customization examples on this page belong to the TypeScript runtime. Python, Go, Ruby, and C#/.NET runtimes use Intelligence for persistence and do not expose these runner classes. See the [Intelligence quickstart](/intelligence/quickstart#connect-your-runtime) for their setup.
+ </Callout>
+ 
- | `IntelligenceAgentRunner` | `@copilotkit/runtime/v2` | Backs CopilotKit Intelligence with durable threads, cross-instance persistence, and threads/history features. Used automatically on an Intelligence runtime. |
+ | `IntelligenceAgentRunner` | `@copilotkit/runtime/v2` | Backs CopilotKit Intelligence with threads, cross-instance persistence, and threads/history features. Used automatically on an Intelligence runtime. |
````

**High — Copilot Runtime**

`/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “Copilot Runtime”

15 code lines, 3 headings, 71 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
+ ## Runtime languages
+ 
+ **TypeScript is the default and most fully featured runtime. It is the only runtime that can run without CopilotKit Intelligence.** Use it for an open-source setup, or connect it to Intelligence when you need its services.
+ 
+ Python, Go, Ruby, and C#/.NET runtimes require an Intelligence project and server-side API key. They work with both [cloud-hosted](/intelligence/managed-intelligence-platform) and [self-hosted](/intelligence/self-hosting) Intelligence; they do not provide an in-memory or SQLite runner.
+ 
+ | Language | Host | Without Intelligence |
````

**High — Use any model router**

`/backend/custom-agent` · route `/backend/custom-agent` · under “When to use Simple Mode vs Factory Mode”

3 code lines, 13 prose lines changed.

````diff
+ To write the whole agent yourself instead of a factory, extend AG-UI's
+ `AbstractAgent`. See [Write your own AG-UI agent](/backend/custom-ag-ui-agent).
+ 
- The factory receives an `AgentFactoryContext` (from `@copilotkit/runtime/v2`):
+ The factory receives an `BuiltInAgentFactoryContext` (from `@copilotkit/runtime/v2`):
- interface AgentFactoryContext {
+ interface BuiltInAgentFactoryContext {
+ learnedSkills: BuiltInAgentLearnedSkills; // catalog and read-only AI SDK tools, empty when disabled
````

**High — Runtime HTTP endpoints**

`/backend/runtime-endpoints` · route `/backend/runtime-endpoints` · under “Runtime HTTP endpoints”

77 code lines, 9 headings, 218 prose lines changed. The number of fenced code blocks changed.

````diff
+ <Callout type="info" title="Other runtime languages">
+ Python, Go, Ruby, and C#/.NET runtimes require Intelligence and serve multi-route endpoints. Use `useSingleEndpoint={false}` with the React provider; do not send a single-route envelope to those servers. The JavaScript handler factories, legacy endpoints, and optional TypeScript features below are specific to the TypeScript runtime. See the [Intelligence quickstart](/intelligence/quickstart#connect-your-runtime) for native server setup.
+ </Callout>
+ 
- | Provider                                 | `useSingleEndpoint` | Transport                                 | Needs handler | Route file                      |
- | ---------------------------------------- | ------------------- | ----------------------------------------- | ------------- | ------------------------------- |
- | `<CopilotKitProvider>`                   | omitted             | `auto` — detected from `/info`            | either        | matches the handler             |
- | `<CopilotKit>`                           | omitted             | `single` in released versions — see below | single-route  | `route.ts`, `POST`              |
````

**High — Slots**

`/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Reshaping the Message List”

41 code lines, 2 headings, 16 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Reshaping the Message List
+ 
+ Slots change how each message renders. To change _which_ messages render — hide some, replace them, reorder them — pass `transformMessages` to the message view. It receives the whole list and returns the list to render.
+ 
+ ```tsx title="page.tsx"
+ import { useCallback } from "react";
+ import { CopilotChat, type Message } from "@copilotkit/react-core/v2";
+ 
````

**High — Headless Threads**

`/headless-threads` · route `/headless-threads` · under “Headless Threads”

7 code lines, 1 heading, 47 prose lines changed. The number of fenced code blocks changed.

````diff
+ Intelligence’s AG-UI streams power the history and delivery behind this custom UI. Use `useThreads` to list and manage conversations, and pass their `threadId` to your chat.
+ 
- CopilotKit Rich Threads enable persistent, resumable multi-turn conversations. The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
+ The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
- [scope Rich Threads to the signed-in user](/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
+ [scope AG-UI Streams to the signed-in user](/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
- <Callout type="info" title="Migrating existing history?">
- Threads capture new CopilotKit conversations once your app is connected to
````

**High — Inspector**

`/inspector` · route `/inspector` · under “Inspector”

4 code lines, 5 headings, 89 prose lines changed. The number of fenced code blocks changed.

````diff
- > Inspector for debugging actions, readables, agent status, messages, and context.
+ > Verify your setup, debug agent runs, reproduce issues, and review Threads and Learning.
- ## What it shows
+ The CopilotKit Inspector overlays your development application so you can
+ verify the connection, investigate a run, and work with Threads and Learning
+ without leaving the page.
- The CopilotKit Inspector is a built-in debugging tool that overlays on your app.
- The first open lands on **Home**. Later opens return to the last pane you used.
````

**High — Model Selection**

`/model-selection` · route `/model-selection` · under “Supported Models”

9 code lines, 24 prose lines changed. The number of fenced code blocks changed.

````diff
+ The tables list the models these docs use. The quickstart uses `openai:gpt-5.4-mini`.
+ The Built-in Agent sends the model id to the provider unchanged, so other model ids
+ from the same provider also work.
+ 
+ | GPT-5.5      | `openai:gpt-5.5`      |
+ | GPT-5.4      | `openai:gpt-5.4`      |
+ | GPT-5.4 Mini | `openai:gpt-5.4-mini` |
- model: "openai:gpt-4.1",
````

**High — Threads Drawer**

`/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “When should I use this?”

27 code lines, 3 headings, 54 prose lines changed. The number of fenced code blocks changed.

````diff
- server-side). <SignupLink surface="docs_drawer">Get a free developer account</SignupLink> to set that up.
+ server-side). <SignupLink surface="docs_drawer">Start cloud-hosted setup</SignupLink> to create or select a project.
- [scope Rich Threads to the signed-in user](/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
+ [scope AG-UI Streams to the signed-in user](/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
- body="Get persistent threads and realtime sync on the free Developer tier."
+ body="Connect a cloud-hosted project to get persistent threads and realtime sync."
+ <Callout type="warn">
+ **The Drawer ships only in `@copilotkit/react-core/v2`.** There is no v1
````

**High — Introduction**

`/quickstart` · routes `/`, `/quickstart`, `/doc-sync` · under “Quickstart”

35 code lines, 5 headings, 68 prose lines changed. The number of fenced code blocks changed.

````diff
- > Get started with CopilotKit's Built-in Agent in minutes.
+ > Build a working AI chat with CopilotKit in minutes.
- <IntelligenceOnboardingPrompt
- feature="learning"
- surface="docs_built_in_agent_quickstart"
- />
+ ## Start with your coding agent
+ Use this prompt to build a working chat with CopilotKit's built-in agent. Your coding agent will follow this guide in your project, or you can work through the manual steps below.
````

**Medium — Headless UI**

`/custom-look-and-feel/headless-ui` · route `/custom-look-and-feel/headless-ui` · under “Fully Headless UI”

2 headings changed.

````diff
- # Fully Headless UI
+ # Headless UI
````

**Medium — Thread & History Lifecycle**

`/threads-lifecycle` · route `/threads-lifecycle` · under “The lifecycle at a glance”

3 headings, 17 prose lines changed.

````diff
- 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/intelligence/threads-explained) for the full server-side model.
+ 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [AG-UI Streams & Framework Threads](/intelligence/threads-explained) for the full server-side model.
- ## Scope Rich Threads to the signed-in user
+ <span id="scope-rich-threads-to-the-signed-in-user" />
+ ## Scope AG-UI Streams to the signed-in user
+ 
- [Connect your runtime to Intelligence](/intelligence/connect-your-runtime) covers the
+ [Connect your runtime to Intelligence](/intelligence/quickstart) covers the
````

**Low — Agent Context**

`/agent-app-context` · route `/agent-app-context` · under “Implementation”

17 prose lines changed.

````diff
+ 
+ <Callout type="warn" title="Context values arrive as JSON strings">
+ The AG-UI protocol defines a context value as a string. Therefore
+ `useAgentContext` calls `JSON.stringify` on any `value` that is not already a
+ string, and your agent receives the JSON text instead of the object or the
+ array.
+ 
+ Parse the value before you read a field from it. Use `json.loads(item["value"])`
````

**Low — Connect AG-UI agents**

`/backend/ag-ui` · route `/backend/ag-ui` · under “How agents slot into the runtime”

3 prose lines changed.

````diff
+ To write the custom implementation yourself, and keep its own fields through
+ the clone in step 2, see [Write your own AG-UI agent](/backend/custom-ag-ui-agent).
+ 
````

**Low — Programmatic Control**

`/programmatic-control` · route `/programmatic-control` · under “Overview”

4 prose lines changed.

````diff
- title="Fully Headless UI"
+ title="Headless UI"
- - **`agent.runAgent()`** — Low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or handle follow-ups. Use this only when you need direct control over the agent execution (e.g., resuming from an interrupt with `forwardedProps`).
+ - **`agent.runAgent()`** — Low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or handle follow-ups. Use this only when you need direct control over the agent execution. To resume from an interrupt, use `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events, so that the subscriber lifecycle still wraps the resumed run.
````

**Low — Server Tools**

`/server-tools` · route `/server-tools` · under “When should I use this?”

47 prose lines changed.

````diff
+ <Callout type="warn" title="The tool runs on the server; the UI still runs in the browser">
+ `execute` runs on your server, so it can reach secrets, a database, or an internal service —
+ and it cannot touch the DOM, component state, or anything else in the page. When the *action*
+ itself belongs in the browser, register it as a [frontend tool](/frontend-tools) instead.
+ 
+ Rendering is separate from executing. A server tool's call still streams to the browser, so
+ you can give it UI with a render-only registration under the same tool name while `execute`
+ keeps running on the server.
````

**Low — Shared State**

`/shared-state` · route `/shared-state` · under “When should I use this?”

4 prose lines changed.

````diff
+ <Callout type="info">
+ For a complete example of selecting a prepared control with structured AI judgments and returning user actions to the agent, follow the [CopilotKit + Jev cookbook](/cookbook/jev-generative-ui).
+ </Callout>
+ 
````

---

---

## 2026-09-04

### 14:26 UTC — 11 pages, highest severity high

**High — Copilot Runtime**

`/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “CopilotKit Intelligence”

4 code lines, 2 prose lines changed.

````diff
- The examples below take `intelligence` and `identifyUser` as given. `intelligence` is a `CopilotKitIntelligence` instance — see [Connect your runtime to Intelligence](/premium/connect-your-runtime) for the constructor and where the project API key comes from.
+ The examples below take `intelligence` and `identifyUser` as given. `intelligence` is a `CopilotKitIntelligence` instance — see [Connect your runtime to Intelligence](/intelligence/connect-your-runtime) for the constructor and where the project API key comes from.
- apiKey: process.env.INTELLIGENCE_API_KEY!,
+ apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
- apiKey: process.env.INTELLIGENCE_API_KEY!,
+ apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
````

**High — Use any model router**

`/backend/custom-agent` · route `/backend/custom-agent` · under “With forwardedProps”

22 code lines, 8 prose lines changed.

````diff
- Let the frontend override model, temperature, or other settings at runtime:
+ Use `forwardedProps` only for non-secret, browser-controlled preferences. Validate
+ each value against backend-owned limits before it affects execution. Never use
+ these properties for credentials, tenant identity, authorization, or unrestricted
+ model and provider selection.
- resolveModel,
- const model =
- typeof props.model === "string"
````

**High — Runtime HTTP endpoints**

`/backend/runtime-endpoints` · route `/backend/runtime-endpoints` · under “Provider and handler pairs”

41 code lines, 55 prose lines changed.

````diff
- | Provider | `useSingleEndpoint` | Transport | Needs handler | Route file |
- | --- | --- | --- | --- | --- |
- | `<CopilotKitProvider>` | omitted | `auto` — detected from `/info` | either | matches the handler |
- | `<CopilotKit>` | omitted | `single` in released versions — see below | single-route | `route.ts`, `POST` |
- | `<CopilotKit>` or `<CopilotKitProvider>` | `{true}` | `single` | single-route | `route.ts`, `POST` |
- | `<CopilotKit>` or `<CopilotKitProvider>` | `{false}` | `rest` | multi-route | `[[...slug]]/route.ts`, 4 verbs |
+ | Provider                                 | `useSingleEndpoint` | Transport                                 | Needs handler | Route file                      |
+ | ---------------------------------------- | ------------------- | ----------------------------------------- | ------------- | ------------------------------- |
````

**High — Headless Threads**

`/headless-threads` · route `/headless-threads` · under “Configure your Runtime with CopilotKit Intelligence”

2 code lines, 22 prose lines changed.

````diff
- Your `CopilotRuntime` must be connected to CopilotKit Intelligence before the thread UI can list and resume conversations. That connection is the `intelligence` option below — a `CopilotKitIntelligence` instance. If your app came from a CLI starter, this Runtime configuration is generated for you. Otherwise, follow [Connect your runtime to Intelligence](/premium/connect-your-runtime) for the full constructor, then return here to add the headless UI. Thread names are automatically generated by the LLM after the first message — you can disable this with `generateThreadNames: false`.
+ Your `CopilotRuntime` must be connected to CopilotKit Intelligence before the thread UI can list and resume conversations. That connection is the `intelligence` option below — a `CopilotKitIntelligence` instance. If your app came from a CLI starter, this Runtime configuration is generated for you. Otherwise, follow [Connect your runtime to Intelligence](/intelligence/connect-your-runtime) for the full constructor, then return here to add the headless UI. Thread names are automatically generated by the LLM after the first message — you can disable this with `generateThreadNames: false`.
- apiKey: process.env.INTELLIGENCE_API_KEY!,
+ apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
- CLI-created starters write the cloud-hosted platform URLs and project-scoped `INTELLIGENCE_API_KEY` to `.env`; keep that key server-side. Existing Intelligence-enabled apps should keep their current server-side Runtime configuration. Production self-hosting uses the same React APIs and is deployed with CopilotKit Engineering through [Self-host CopilotKit Intelligence](/premium/self-hosting).
+ CLI `init` and its `create` alias write the cloud-hosted platform URLs,
+ `SL_ENABLED`, project-scoped `CPK_INTELLIGENCE_API_KEY`, and optional
+ `CPK_TELEMETRY_ID` to `.env`.
````

**High — Introduction**

`/quickstart` · routes `/`, `/quickstart`, `/doc-sync` · under “Setup Copilot Runtime” · in a `ts` block

4 code lines, 4 prose lines changed.

````diff
- apiKey: process.env.INTELLIGENCE_API_KEY!,
+ apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
- The runtime reads the license key from step 1. Add it to the app that serves
+ The runtime reads the project API key from step 1. Add it to the app that serves
- INTELLIGENCE_API_KEY=your_license_key
+ CPK_INTELLIGENCE_API_KEY=cpk-...
- [Connect your runtime to Intelligence](/premium/connect-your-runtime) for the
+ [Connect your runtime to Intelligence](/intelligence/connect-your-runtime) for the
````

**High — Thread & History Lifecycle**

`/threads-lifecycle` · route `/threads-lifecycle` · under “The lifecycle at a glance”

2 code lines, 8 prose lines changed.

````diff
- 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/premium/threads-explained) for the full server-side model.
+ 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/intelligence/threads-explained) for the full server-side model.
- Replay requires a **server-side store to replay from**: CopilotKit Intelligence, or a persisting `AgentRunner` (e.g. the SQLite runner). A self-hosted runtime with no persistence layer has nothing to replay, so `connectAgent()` returns an empty stream and the conversation starts blank. If history isn't restoring, check that a store is configured, not the client code. The [Persistence Architecture](/premium/threads-explained) page covers how replay works server-side.
+ Replay requires a **server-side store to replay from**: CopilotKit Intelligence, or a persisting `AgentRunner` (e.g. the SQLite runner). A self-hosted runtime with no persistence layer has nothing to replay, so `connectAgent()` returns an empty stream and the conversation starts blank. If history isn't restoring, check that a store is configured, not the client code. The [Persistence Architecture](/intelligence/threads-explained) page covers how replay works server-side.
- apiKey: process.env.INTELLIGENCE_API_KEY!,
+ apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
- [Connect your runtime to Intelligence](/premium/connect-your-runtime) covers the
+ [Connect your runtime to Intelligence](/intelligence/connect-your-runtime) covers the
````

**Low — Agent Context**

`/agent-app-context` · route `/agent-app-context` · under “Agent Context”

9 prose lines changed.

````diff
- Share your application's state and context with the Built-in Agent using the `useAgentContext` hook. The agent automatically receives this context — no backend configuration needed.
+ Share your application's state and context with the Built-in Agent using the `useAgentContext` hook. The Built-in Agent receives this context automatically, with no backend configuration.
+ 
+ <Callout>
+ That last part is specific to the Built-in Agent. An agent you host yourself receives the same
+ entries on the AG-UI run input, and each framework decides what reaches the model from there —
+ see your framework's own Agent App Context page, such as [ADK](/adk/agent-app-context),
+ [LangGraph](/langgraph/agent-app-context) or [Mastra](/mastra/agent-app-context).
````

**Low — Authentication**

`/auth` · route `/auth` · under “CopilotKit Intelligence scopes most thread routes”

2 prose lines changed.

````diff
- The Intelligence runtime requires an `identifyUser` callback — construction throws without one (or without at least one Channel). It runs on the server, once per request, and the id it returns is the scope the runtime hands to the platform. (`intelligence` below is a `CopilotKitIntelligence` instance; [Connect your runtime to Intelligence](/premium/connect-your-runtime) covers building it.)
+ The Intelligence runtime requires an `identifyUser` callback — construction throws without one (or without at least one Channel). It runs on the server, once per request, and the id it returns is the scope the runtime hands to the platform. (`intelligence` below is a `CopilotKitIntelligence` instance; [Connect your runtime to Intelligence](/intelligence/connect-your-runtime) covers building it.)
````

**Low — AgentRunner and persistence**

`/backend/agent-runner` · route `/backend/agent-runner` · under “Related”

2 prose lines changed.

````diff
- - [Self-host CopilotKit Intelligence](/premium/self-hosting): the durable, multi-instance `IntelligenceAgentRunner` backend.
+ - [Self-host CopilotKit Intelligence](/intelligence/self-hosting): the durable, multi-instance `IntelligenceAgentRunner` backend.
````

**Low — Inspector**

`/inspector` · route `/inspector` · under “Showing or hiding the Inspector”

2 prose lines changed.

````diff
- a **different credential** from the server-side `INTELLIGENCE_API_KEY` that
+ a **different credential** from the server-side `CPK_INTELLIGENCE_API_KEY` that
````

**Low — Model Selection**

`/model-selection` · route `/model-selection` · under “OpenRouter, proxies, and bring-your-own LLM”

8 prose lines changed.

````diff
- [Groq](https://groq.com), or your own fine-tuned endpoint, works through the same
+ [Groq](https://groq.com), [Novita](https://novita.ai), or your own fine-tuned endpoint, works through the same
+ 
+ <Callout type="warn" title="Novita: use provider.chat(model)">
+ Novita only implements the Chat Completions endpoint, not Responses. Call it as
+ `provider.chat("model")` (not `provider("model")`) — the bare call form used in
+ the example below routes through Responses and returns an error on Novita.
+ </Callout>
````

---

---
