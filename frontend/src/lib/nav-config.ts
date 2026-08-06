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

export const DOC_SYNC_DATE = "2026-08-05";
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
        title: "Prebuilt Components",
        docPath: "/prebuilt-components",
        summary:
          "CopilotChat, CopilotSidebar, and CopilotPopup side by side, each driving the same agent.",
        status: "working",
      },
    ],
  },
  {
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        title: "Slots",
        docPath: "/custom-look-and-feel/slots",
        summary:
          "Replacing chat sub-components at four levels: class strings, prop overrides, whole components, and a children render function.",
        status: "working",
        offNav: true,
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        title: "Headless UI",
        docPath: "/custom-look-and-feel/headless-ui",
        summary:
          "A chat interface built from scratch on useAgent and useCopilotKit, with no CopilotKit chrome.",
        status: "working",
        offNav: true,
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        title: "Programmatic Control",
        docPath: "/programmatic-control",
        summary:
          "Driving the agent with no chat UI: read state and messages, run it, stop it, and log its events.",
        status: "working",
      },
      {
        path: "/inspector",
        hasDemo: true,
        title: "Inspector",
        docPath: "/inspector",
        summary:
          "The built-in debugging overlay showing AG-UI events, agents, state, and registered tools.",
        status: "working",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
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
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        title: "Tool Rendering",
        docPath: "/generative-ui/tool-rendering",
        summary:
          "The get_weather server tool rendered by a named renderer, plus a wildcard fallback for everything else.",
        status: "working",
      },
    ],
  },
  {
    title: "App Control",
    routes: [
      {
        path: "/frontend-tools",
        hasDemo: true,
        title: "Frontend Tools",
        docPath: "/frontend-tools",
        summary:
          "A tool the agent calls that executes in the browser, forwarded automatically over AG-UI.",
        status: "working",
      },
      {
        path: "/shared-state",
        hasDemo: true,
        title: "Shared State",
        docPath: "/shared-state",
        summary:
          "One state object both sides can write: the app through agent.setState, the agent through its AG-UI state tools.",
        status: "working",
        statusNote:
          "The doc page shows frontend code only; the agent half is BuiltInAgent's own state tooling, which needs maxSteps above 1.",
      },
      {
        path: "/agent-app-context",
        hasDemo: true,
        title: "Agent Context",
        docPath: "/agent-app-context",
        summary:
          "Sharing app state with the agent as read-only context via useAgentContext.",
        status: "working",
      },
    ],
  },
  {
    title: "Built-in Agent",
    routes: [
      {
        path: "/server-tools",
        hasDemo: true,
        title: "Server Tools",
        docPath: "/server-tools",
        summary:
          "defineTool: a tool that executes on the server inside the runtime, never in the browser.",
        status: "working",
        statusNote:
          "getWeather runs end to end. The page's other samples call helpers the docs never define, so they stay as reference code rather than being wired up.",
      },
      {
        path: "/model-selection",
        hasDemo: true,
        title: "Model Selection",
        docPath: "/model-selection",
        summary:
          "Three agents, one per provider — OpenAI, Google, and Anthropic — differing only in the model prefix and the key they read.",
        status: "working",
        statusNote:
          "All three first-party providers are wired. A column runs only if its key is set; Azure needs a package this repo does not install.",
      },
      {
        path: "/advanced-configuration",
        hasDemo: true,
        title: "Advanced Configuration",
        docPath: "/advanced-configuration",
        summary:
          "Every BuiltInAgent knob on one agent: system prompt, maxSteps, toolChoice, sampling params, and per-run overrides.",
        status: "working",
      },
    ],
  },
  {
    title: "Runtime",
    routes: [
      {
        path: "/backend/copilot-runtime",
        hasDemo: true,
        title: "Copilot Runtime",
        docPath: "/backend/copilot-runtime",
        summary:
          "This repo's live runtime config, routing across all six agents, and the options the page documents.",
        status: "working",
      },
      {
        path: "/backend/runtime-endpoints",
        hasDemo: true,
        title: "Runtime HTTP endpoints",
        docPath: "/backend/runtime-endpoints",
        summary:
          "The multi-route HTTP surface underneath the client, probed live against this app's own runtime.",
        status: "working",
      },
      {
        path: "/backend/custom-agent",
        hasDemo: true,
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
        title: "AgentRunner and persistence",
        docPath: "/backend/agent-runner",
        summary:
          "The runner that owns thread runs, subclassed and wired into this app's runtime.",
        status: "working",
      },
      {
        path: "/backend/ag-ui",
        hasDemo: true,
        title: "Connect AG-UI agents",
        docPath: "/backend/ag-ui",
        summary:
          "A live capture of the raw AG-UI event stream flowing between the runtime and this page.",
        status: "working",
      },
      {
        path: "/auth",
        hasDemo: true,
        title: "Authentication",
        docPath: "/auth",
        summary:
          "A bearer token forwarded from the provider and checked by an onRequest hook on a second, gated runtime.",
        status: "working",
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
