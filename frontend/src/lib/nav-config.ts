/**
 * The nav, the route headers, and the README status table all read from here,
 * so a doc page and its implementation status are described exactly once.
 *
 * Route paths mirror the doc URLs under docs.copilotkit.ai. The built-in agent
 * is CopilotKit's own agent, so its docs sit at the root of the site rather than
 * under a framework slug — `docPath` values are therefore top-level paths.
 *
 * `offNav: true` marks pages that resolve fine but are absent from that sidebar
 * as of DOC_SYNC_DATE.
 */

/**
 * There is exactly one doc-sync date in this repo, and it is not here: it is
 * `syncedAt` in `doc-snapshot/manifest.json`, written every time the sync
 * button runs. A hand-maintained date alongside it only ever drifted out of
 * agreement with the machine one, so it was removed — `/doc-sync` is the
 * single place that answers "how current are these docs".
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/quickstart";

export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export interface RouteMeta {
  path: string;
  title: string;
  docPath: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  offNav?: boolean;
  /** The doc sidebar folder the page sits in, under its group's separator. */
  folder?: string;
  /** Owns a live surface at `<path>/demo-chat`. */
  hasDemo?: boolean;
}

export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/quickstart",
        summary: "What this harness covers and how the pieces fit together.",
        status: "reference",
        statusNote: "Landing page — orientation and the live agent roster.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        title: "Quickstart",
        docPath: "/quickstart",
        summary:
          "A BuiltInAgent registered on the runtime and driven by a CopilotSidebar — the whole stack in four files.",
        status: "working",
      },
    ],
  },
  {
    title: "Basics",
    routes: [
      {
        path: "/prebuilt-components",
        hasDemo: true,
        folder: "Chat",
        title: "Prebuilt Components",
        docPath: "/prebuilt-components",
        summary:
          "CopilotChat, CopilotSidebar, and CopilotPopup side by side, each driving the same agent.",
        status: "working",
      },
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Slots",
        docPath: "/custom-look-and-feel/slots",
        summary:
          "Replacing chat sub-components at four levels: class strings, prop overrides, whole components, and a children render function.",
        status: "working",
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Headless UI",
        docPath: "/custom-look-and-feel/headless-ui",
        summary:
          "A chat interface built from scratch on useAgent and useCopilotKit, with no CopilotKit chrome.",
        status: "working",
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        folder: "Chat › Custom Look and Feel",
        title: "Programmatic Control",
        docPath: "/programmatic-control",
        summary:
          "Driving the agent with no chat UI: read state and messages, run it, stop it, and log its events.",
        status: "working",
      },
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        hasDemo: true,
        folder: "Chat › Threads",
        title: "Threads Drawer",
        docPath: "/prebuilt-components/copilot-threads-drawer",
        summary:
          "The prebuilt conversation sidebar: list, switch, start, archive, delete — with no thread state of your own.",
        status: "working",
        statusNote:
          "Runs on /api/copilotkit-threads, the only runtime with Intelligence. Needs CPK_INTELLIGENCE_API_KEY for persisted rows and an active entitlement (cloud subscription or COPILOTKIT_LICENSE_TOKEN) to unlock the list.",
      },
      {
        path: "/headless-threads",
        hasDemo: true,
        folder: "Chat › Threads",
        title: "Headless Threads",
        docPath: "/headless-threads",
        summary:
          "The same thread data through useThreads, with a hand-built list — including rename, which the drawer omits.",
        status: "working",
        statusNote:
          "Runs on /api/copilotkit-threads, the only runtime with Intelligence. Not license-gated; rows persist only when CPK_INTELLIGENCE_API_KEY is set.",
      },
      {
        path: "/frontend-tools",
        hasDemo: true,
        title: "Frontend Tools",
        docPath: "/frontend-tools",
        summary:
          "A tool the agent calls that executes in the browser, forwarded automatically over AG-UI.",
        status: "working",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/tool-based",
        hasDemo: true,
        folder: "Controlled",
        title: "Components as Tools",
        docPath: "/generative-ui/tool-based",
        summary:
          "A React component registered with useComponent becomes a tool the agent calls to paint a bar chart in the chat.",
        status: "working",
        statusNote:
          "The bar-chart path runs end to end with the page's config-mode agent and prompt. The Code tab's pie chart and suggestions are unpublished and commented out. The factory-mode variant also runs but carries no system prompt.",
      },
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        folder: "Controlled",
        title: "Tool Call Rendering",
        docPath: "/generative-ui/tool-rendering",
        summary:
          "The get_weather server tool rendered by a named renderer, plus a wildcard fallback for everything else.",
        status: "working",
      },
      {
        path: "/generative-ui/components",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "Components and surfaces",
        docPath: "/generative-ui/components",
        summary:
          "The standard catalog on the provider and a TanStack factory agent that forwards render_ui and its guide to the model.",
        status: "partial",
        statusNote:
          "Runs the published TanStack factory at /api/copilotkit-genui. Its chat() call omits threadId, which @tanstack/ai 1.0 types as required (type error, kept as published); the runtime effect is unverified.",
      },
      {
        path: "/generative-ui/components/surfaces",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "Surfaces",
        docPath: "/generative-ui/components/surfaces",
        summary: "GenerativeUISurface targets on the page that the agent renders into from the chat.",
        status: "partial",
        statusNote:
          "All published surface targets are mounted. Product, ProductRow and the product list are labelled scaffolding; ./catalog is the Catalogs page's shopUI.",
      },
      {
        path: "/generative-ui/components/catalogs",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "Catalogs",
        docPath: "/generative-ui/components/catalogs",
        summary: "A custom catalog built with createGenerativeUI, typed props, and combined catalogs.",
        status: "partial",
        statusNote:
          "Every published catalog runs. cartUI, Hero, Panel and missing imports are scaffolding. The export sample runs in the browser and shows the JSON, since fs.writeFileSync needs Node.",
      },
      {
        path: "/generative-ui/components/standard-catalog",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "Standard catalog",
        docPath: "/generative-ui/components/standard-catalog",
        summary: "standardUI extended, trimmed, and with a component replaced.",
        status: "partial",
        statusNote:
          "standardUI, extending it, dropping components and replacing one all run. ProductCard and productSchema are scaffolding; maplibre-gl is installed for Map.",
      },
      {
        path: "/generative-ui/components/state-and-actions",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "State and actions",
        docPath: "/generative-ui/components/state-and-actions",
        summary: "Catalog state bound from the app, functions run on click, events sent to the agent, writable props.",
        status: "partial",
        statusNote:
          "State binding, a function on click, an event to the agent and writable props all run. Cart, the state catalog's ProductCard and the fragment catalogs are scaffolding.",
      },
      {
        path: "/generative-ui/components/theming",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "Theming",
        docPath: "/generative-ui/components/theming",
        summary: "Theme variables, per-mode colors, and dark mode for generated components.",
        status: "partial",
        statusNote:
          "All five theme samples run. The colour-scheme script renders in the body rather than <head>; the page's mapStyle URLs are placeholders.",
      },
      {
        path: "/generative-ui/components/transports",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "Transports",
        docPath: "/generative-ui/components/transports",
        summary: "The tool transport against the markdown transport, and limiting generative UI to some agents.",
        status: "partial",
        statusNote:
          "Tool, markdown and agentIds variants run against a runtime with generativeUI: true. The page's runtime snippet references an undefined agent; the shop agent is glue.",
      },
      {
        path: "/generative-ui/components/markdown-mode",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "Markdown mode",
        docPath: "/generative-ui/components/markdown-mode",
        summary: "The agent writes UI inside its markdown reply instead of calling a tool.",
        status: "partial",
        statusNote:
          "The markdown transport runs. The sendContext: false variant shows no UI by design: the page's only backend for it is Python.",
      },
      {
        path: "/generative-ui/components/from-a2ui",
        hasDemo: true,
        folder: "Declarative › Components and surfaces",
        title: "Adopt from A2UI",
        docPath: "/generative-ui/components/from-a2ui",
        summary: "A catalog moved from the a2ui renderer to createGenerativeUI.",
        status: "partial",
        statusNote:
          "The 'After' catalog runs (Airport and Arrow are scaffolding); the 'Before' snippets are reference only.",
      },
      {
        path: "/generative-ui/a2ui/dynamic-schema",
        hasDemo: true,
        folder: "Declarative › A2UI",
        title: "Dynamic Schema A2UI",
        docPath: "/generative-ui/a2ui/dynamic-schema",
        summary: "A bring-your-own catalog the agent composes freely, schema and data both generated.",
        status: "working",
        statusNote:
          "Runs the prose path: the runtime injects the A2UI tool (injectA2UITool: true) for the Quickstart agent. The Code tab's opt-out factory is not used. Card colours depend on theme CSS variables the page never defines.",
      },
      {
        path: "/generative-ui/a2ui/fixed-schema",
        hasDemo: true,
        folder: "Declarative › A2UI",
        title: "Fixed Schema A2UI",
        docPath: "/generative-ui/a2ui/fixed-schema",
        summary: "A pre-built flight-card schema the agent fills with data from a tool call.",
        status: "working",
        statusNote:
          "Bindings resolve because the catalog's zod resolves to the renderer's zod 3 under src/a2ui/. Book flight is inert by the published renderer's design.",
      },
      {
        path: "/generative-ui/json-render",
        hasDemo: true,
        folder: "Declarative",
        title: "JSON Render",
        docPath: "/generative-ui/json-render",
        summary: "The agent emits a json-render spec that a registry of React components renders in the chat.",
        status: "working",
        statusNote:
          "The agent's JSON reply renders as a MetricCard plus charts through @json-render/react. Three unpublished test-plumbing imports are commented out.",
      },
      {
        path: "/generative-ui/hashbrown",
        hasDemo: true,
        folder: "Declarative",
        title: "Hashbrown",
        docPath: "/generative-ui/hashbrown",
        summary: "The agent streams a Hashbrown UI kit response that renders charts and metric cards.",
        status: "working",
        statusNote:
          "Hashbrown pinned to 0.7.0, the last release that exports prompt and accepts useUiKit({ examples }), which the published renderer uses; 0.8.x removed both. The page names no version. Not yet run in a browser.",
      },
      {
        path: "/generative-ui/mcp-apps",
        hasDemo: true,
        folder: "Open-ended",
        title: "MCP Apps",
        docPath: "/generative-ui/mcp-apps",
        summary: "MCPAppsMiddleware on the agent renders an MCP server's UI resource in a sandboxed iframe.",
        status: "working",
        statusNote:
          "Needs `npm run mcp:apps` (the official ext-apps example server, @modelcontextprotocol/server-basic-react, on the doc's port 3108). The runtime is the page's route on its own basePath; the Intelligence mcpApps variant has no sample and is not wired.",
      },
      {
        path: "/generative-ui/open-generative-ui",
        hasDemo: true,
        folder: "Open-ended",
        title: "Open Generative UI",
        docPath: "/generative-ui/open-generative-ui",
        summary: "The agent writes sandboxed HTML/JS UI, optionally calling host functions you expose.",
        status: "working",
        statusNote:
          "The minimal demo runs without the page's unpublished VISUALIZATION_DESIGN_SKILL (commented out); the advanced demo with sandbox functions is at demo-chat/advanced.",
      },
      {
        path: "/generative-ui/your-components/display-only",
        hasDemo: true,
        title: "Your Components · Display-only",
        docPath: "/generative-ui/your-components/display-only",
        summary:
          "Registering a React component with useComponent as something the agent can render, with no handler.",
        status: "working",
        offNav: true,
      },
      {
        path: "/generative-ui/your-components/interactive",
        hasDemo: true,
        title: "Your Components · Interactive",
        docPath: "/generative-ui/your-components/interactive",
        summary:
          "An approval gate built with useHumanInTheLoop — the run suspends until the user authorises the command.",
        status: "working",
        offNav: true,
      },
    ],
  },
  {
    title: "Interactivity",
    routes: [
      {
        path: "/shared-state",
        hasDemo: true,
        folder: "Shared state",
        title: "Shared State",
        docPath: "/shared-state",
        summary:
          "One state object both sides can write: the app through agent.setState, the agent through its AG-UI state tools.",
        status: "working",
        statusNote:
          "The doc page shows frontend code only; the agent half is BuiltInAgent's own state tooling, which needs maxSteps above 1.",
      },
      {
        path: "/shared-state/rendering-in-app",
        hasDemo: true,
        folder: "Shared state",
        title: "Render agent state in your app",
        docPath: "/shared-state/rendering-in-app",
        summary: "A Canvas outside the chat that renders agent state and writes back to it.",
        status: "working",
        statusNote:
          "Canvas and app/page.tsx are verbatim; the toggleItem fragment is wired to buttons in a second view.",
      },
      {
        path: "/shared-state/agent-readonly",
        hasDemo: true,
        folder: "Shared state",
        title: "Agent Read-Only Context",
        docPath: "/shared-state/agent-readonly",
        summary: "App state handed to the agent with useAgentContext, readable but not writable by it.",
        status: "working",
        statusNote:
          "The three useAgentContext calls are verbatim. demo-layout is an unpublished stand-in; suggestions are commented out.",
      },
      {
        path: "/human-in-the-loop",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "HITL Overview",
        docPath: "/human-in-the-loop/index",
        summary: "useHumanInTheLoop: the agent calls book_call and the run waits on a time-picker card.",
        status: "working",
        statusNote:
          "Pattern 1 (useHumanInTheLoop) runs from the Code tab unchanged. Pattern 2 (useInterrupt) has no built-in-agent demo on the page and BuiltInAgent never interrupts, so it is not built.",
      },
      {
        path: "/human-in-the-loop/governed-actions",
        hasDemo: true,
        folder: "Human-in-the-loop",
        title: "Governed Action Approval UI",
        docPath: "/human-in-the-loop/governed-actions",
        summary:
          "The approve_governed_action HITL tool renders a policy approval card that resolves allow/deny itself and waits on require_approval.",
        status: "working",
        statusNote:
          "The useInterrupt path is skipped (BuiltInAgent never interrupts) and shown as reference. No server policy check or executeSideEffect is published.",
      },
      {
        path: "/webmcp",
        hasDemo: true,
        title: "WebMCP",
        docPath: "/webmcp",
        summary: "A frontend tool mirrored onto document.modelContext for browser agents.",
        status: "partial",
        statusNote:
          "Registration onto document.modelContext is verbatim, but both samples call searchOrders(), which the page never defines, so every call throws. Needs Chrome 149+ with WebMCP enabled.",
      },
      {
        path: "/agent-app-context",
        hasDemo: true,
        title: "Agent Context",
        docPath: "/agent-app-context",
        summary:
          "Sharing app state with the agent as read-only context via useAgentContext.",
        status: "working",
        offNav: true,
      },
    ],
  },
  {
    title: "Agent capabilities",
    routes: [
      {
        path: "/server-tools",
        hasDemo: true,
        folder: "Built-in Agent",
        title: "Server Tools",
        docPath: "/server-tools",
        summary:
          "defineTool: a tool that executes on the server inside the runtime, never in the browser.",
        status: "working",
        statusNote:
          "getWeather runs end to end. The page's other samples call helpers the docs never define, so they stay as reference code rather than being wired up.",
      },
      {
        path: "/mcp-servers",
        hasDemo: true,
        folder: "Built-in Agent",
        title: "MCP Servers",
        docPath: "/mcp-servers",
        summary: "mcpServers on BuiltInAgent, plus a user-managed MCP client, against a local MCP server.",
        status: "working",
        statusNote:
          "Needs `npm run mcp:everything` (and `mcp:everything:sse` for the SSE samples). The page's example hosts point at the local reference server; the dynamic-auth helpers and persistentClient are labelled stand-ins; ToolSet is used without an import, as published.",
      },
      {
        path: "/model-selection",
        hasDemo: true,
        folder: "Built-in Agent",
        title: "Model Selection",
        docPath: "/model-selection",
        summary:
          "Every specifier on the page, selectable per run on one agent through overridableProperties: [\"model\"].",
        status: "working",
        statusNote:
          "One agent, model chosen per message from a dropdown of all 22 specifiers. A provider runs only if its key is set.",
      },
      {
        path: "/advanced-configuration",
        hasDemo: true,
        folder: "Built-in Agent",
        title: "Advanced Configuration",
        docPath: "/advanced-configuration",
        summary:
          "Every BuiltInAgent knob on one agent: system prompt, maxSteps, toolChoice, sampling params, and per-run overrides.",
        status: "working",
      },
      {
        path: "/multi-agent/subagents",
        hasDemo: true,
        title: "Sub-agents",
        docPath: "/multi-agent/subagents",
        summary: "A supervisor delegates to research, writing, and critique sub-agents exposed as tools.",
        status: "partial",
        statusNote:
          "Tools, factory and delegations state are published and wired. The supervisor prompt (SUBAGENTS_PROMPT, from unpublished demo-prompts) is not, so delegation relies on the request and the tool descriptions. Three UI modules are stand-ins.",
      },
    ],
  },
  {
    title: "Intelligence",
    routes: [
      {
        path: "/threads-lifecycle",
        hasDemo: true,
        folder: "AG-UI Streams",
        title: "Thread & History Lifecycle",
        docPath: "/threads-lifecycle",
        summary:
          "Where a threadId comes from, and what setActiveThreadId's explicit flag changes about replay.",
        status: "working",
        statusNote:
          "Runs on the shared SSE runtime (Intelligence is scoped to the two Threads routes), so history lasts only as long as the dev server.",
      },
    ],
  },
  {
    title: "Backend",
    routes: [
      {
        path: "/backend/copilot-runtime",
        hasDemo: true,
        folder: "Runtime",
        title: "Copilot Runtime",
        docPath: "/backend/copilot-runtime",
        summary:
          "This repo's live runtime config, routing across all six agents, and the options the page documents.",
        status: "working",
      },
      {
        path: "/backend/runtime-endpoints",
        hasDemo: true,
        folder: "Runtime",
        title: "Runtime HTTP endpoints",
        docPath: "/backend/runtime-endpoints",
        summary:
          "The multi-route HTTP surface underneath the client, probed live against this app's own runtime.",
        status: "working",
      },
      {
        path: "/backend/custom-agent",
        hasDemo: true,
        folder: "Runtime",
        title: "Use any model router",
        docPath: "/backend/custom-agent",
        summary:
          "Factory mode: your own streamText or TanStack chat call owns the model, BuiltInAgent owns only the run lifecycle.",
        status: "partial",
        statusNote:
          "The AI SDK and TanStack AI factories both run. The raw-event variant is shown as code — it posts to an LLM endpoint that has to be yours.",
      },
      {
        path: "/backend/agent-runner",
        hasDemo: true,
        folder: "Runtime",
        title: "AgentRunner and persistence",
        docPath: "/backend/agent-runner",
        summary:
          "The runner that owns thread runs, subclassed and wired into this app's runtime.",
        status: "working",
      },
      {
        path: "/backend/ag-ui",
        hasDemo: true,
        folder: "Runtime",
        title: "Connect AG-UI agents",
        docPath: "/backend/ag-ui",
        summary:
          "A live capture of the raw AG-UI event stream flowing between the runtime and this page.",
        status: "working",
      },
      {
        path: "/auth",
        hasDemo: true,
        folder: "Runtime",
        title: "Authentication",
        docPath: "/auth",
        summary:
          "A bearer token forwarded from the provider and checked by an onRequest hook on a second, gated runtime.",
        status: "working",
      },
      {
        path: "/inspector",
        hasDemo: true,
        folder: "Debugging",
        title: "Inspector",
        docPath: "/inspector",
        summary:
          "The built-in debugging overlay showing AG-UI events, agents, state, and registered tools.",
        status: "working",
      },
    ],
  },
  {
    title: "Doc Sync",
    routes: [
      {
        path: "/doc-sync",
        title: "Doc drift",
        docPath: "/quickstart",
        summary:
          "Re-fetches the markdown behind every tracked doc page and diffs it against the stored snapshot, flagging changes inside code blocks.",
        status: "reference",
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};
