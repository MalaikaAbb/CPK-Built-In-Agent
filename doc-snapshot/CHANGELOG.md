# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-08-21

### 15:17 UTC — 7 pages, highest severity high

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

**High — Copilot Runtime**

`/backend/copilot-runtime` · route `/backend/copilot-runtime` · under “Setting up the runtime”

23 code lines, 1 heading, 28 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
+ <Callout type="warn" title="Switching to a v2 handler also switches the transport">
+ The legacy factories are single-route; the v2 handlers are multi-route by
+ default. The `<CopilotKit>` above sets no transport, so it detects the switch
+ on its own — but if you have pinned `useSingleEndpoint={true}` anywhere, drop
+ it or flip it to `{false}` when you move to a v2 handler. See
+ [Provider and handler pairs](/backend/runtime-endpoints#provider-and-handler-pairs).
+ </Callout>
````

**High — Use any model router**

`/backend/custom-agent` · route `/backend/custom-agent` · under “With forwardedProps” · in a `tsx` block

5 code lines, 7 prose lines changed.

````diff
- <CopilotKit properties={{ model: "anthropic/claude-sonnet-4", temperature: 0.3 }}>
+ <CopilotKit
+ properties={{ model: "anthropic/claude-sonnet-4", temperature: 0.3 }}
+ useSingleEndpoint={false}
+ >
+ 
+ <Callout type="info" title="About the explicit useSingleEndpoint">
+ `createCopilotEndpoint` serves multi-route, the default. Both `<CopilotKit>` and `<CopilotKitProvider>` negotiate the transport when the
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

11 code lines, 1 heading, 9 prose lines changed. The number of fenced code blocks changed.

````diff
- models from OpenAI, Anthropic, and Google, or pass any custom AI SDK model.
+ built-in model strings or pass any custom AI SDK model.
+ ### MiniMax
+ 
+ | Model        | Specifier              |
+ | ------------ | ---------------------- |
+ | MiniMax M3   | `minimax:MiniMax-M3`   |
+ | MiniMax M2.7 | `minimax:MiniMax-M2.7` |
````

**High — Introduction**

`/quickstart` · routes `/`, `/quickstart`, `/doc-sync` · under “Install CopilotKit packages” · in a `npm` block

2 code lines, 1 heading, 39 prose lines changed.

````diff
- npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
+ npm install @copilotkit/react-core @copilotkit/runtime
+ 
+ The components used below (`CopilotKit`, `CopilotSidebar`) and the
+ stylesheet all come from `@copilotkit/react-core/v2`, so
+ `@copilotkit/react-ui` is not needed for this setup.
+ <Callout type="warn" title="Already have an agent? Do not use BuiltInAgent">
+ `BuiltInAgent` is CopilotKit's *own* agent — it calls the model
````

**Low — Inspector**

`/inspector` · route `/inspector` · under “Showing or hiding the Inspector”

7 prose lines changed.

````diff
+ `NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY` is a browser-visible publishable key and is
+ a **different credential** from the server-side `INTELLIGENCE_API_KEY` that
+ `copilotkit project select` writes into your `.env`. The server-side key is
+ consumed by the `CopilotKitIntelligence` client described in
+ [Runtime endpoints](/backend/runtime-endpoints). Do not substitute one for the
+ other, and never expose the server-side key to the browser.
+ 
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
