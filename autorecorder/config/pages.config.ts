/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ADAPT THIS FILE — 3 of 3
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * One entry per doc page, in the order the doc nav lists them.
 *
 * Entries are deliberately short. `docUrl`, `demoUrl` and the output filename
 * are derived from `project.config.ts` plus the fields below, so no entry can
 * point at the wrong framework's docs and filenames stay in nav order without
 * anyone numbering them by hand.
 *
 * ── Where this list came from ──────────────────────────────────────────────
 * Generated from `frontend/src/lib/nav-config.ts`, which is this app's single
 * source of truth for route -> doc-page mapping. Every route carrying
 * `hasDemo: true` is registered here, in nav order; routes without a
 * `demo-chat` page are reference material and are deliberately absent, because
 * `demoUrl` is always `route + demoSuffix` and the doctor errors on any that
 * is not 200.
 *
 * Re-derive rather than hand-edit when the nav changes, then re-check the line
 * ranges below.
 *
 * ── The line ranges ────────────────────────────────────────────────────────
 * `startLine`/`endLine` are what the simulated IDE highlights, and they drift
 * the moment someone edits a demo page. `npm run doctor` checks each range
 * points at real code; where a file carries `[!code highlight]` or `#region`
 * markers it also checks the range still covers one.
 */

import { definePages } from '../core/types';

export const PAGES = definePages([
  {
    id: "quickstart",
    name: "Getting Started - Quickstart",
    videoName: "Quickstart",
    docPath: "quickstart",
    route: "quickstart",
    ideFile: "frontend/package.json",
    startLine: 12,
    endLine: 28,
    extraTabs: [
      { filePath: "frontend/src/app/quickstart/demo-chat/page.tsx", startLine: 14, endLine: 31 },
      { filePath: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts", startLine: 1, endLine: 35 },
    ],
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "prebuilt-components",
    name: "Basics - Prebuilt Components",
    videoName: "PrebuiltComponents",
    docPath: "prebuilt-components",
    route: "prebuilt-components",
    ideFile: "frontend/src/app/prebuilt-components/demo-chat/page.tsx",
    startLine: 28,
    endLine: 62,
    // One per tab: CopilotChat, then CopilotSidebar, then CopilotPopup. The
    // three share the provider, so asking something different in each also
    // shows the conversation carrying across the swap.
    prompt: "Can you tell me a joke?",
    prompts: [
      "Can you tell me a joke?",
      "Now give me one fun fact about the ocean.",
      "And one short travel tip, please.",
    ],
    waitAfterPromptMs: 2500,
  },
  {
    id: "custom-look-and-feel-slots",
    name: "Custom Look and Feel - Slots",
    videoName: "Slots",
    docPath: "custom-look-and-feel/slots",
    route: "custom-look-and-feel/slots",
    ideFile: "frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx",
    startLine: 56,
    endLine: 90,
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "custom-look-and-feel-headless-ui",
    name: "Custom Look and Feel - Headless UI",
    videoName: "HeadlessUI",
    docPath: "custom-look-and-feel/headless-ui",
    route: "custom-look-and-feel/headless-ui",
    ideFile: "frontend/src/app/custom-look-and-feel/headless-ui/demo-chat/page.tsx",
    startLine: 18,
    endLine: 22,
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "programmatic-control",
    name: "Custom Look and Feel - Programmatic Control",
    videoName: "ProgrammaticControl",
    docPath: "programmatic-control",
    route: "programmatic-control",
    ideFile: "frontend/src/app/programmatic-control/demo-chat/page.tsx",
    startLine: 15,
    endLine: 81,
    // Sent by clicking "Run Agent", not by a chat submit. `renderingAgent`
    // carries `get_weather`, so this also exercises the page's tool renderer.
    prompt: "What's the weather in Tokyo?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "inspector",
    name: "Custom Look and Feel - Inspector",
    videoName: "Inspector",
    docPath: "inspector",
    route: "inspector",
    ideFile: "frontend/src/app/inspector/demo-chat/page.tsx",
    startLine: 15,
    endLine: 28,
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "generative-ui-your-components-display-only",
    name: "Generative UI - Your Components · Display-only",
    videoName: "YourComponentsDisplayonly",
    docPath: "generative-ui/your-components/display-only",
    route: "generative-ui/your-components/display-only",
    ideFile: "frontend/src/app/generative-ui/your-components/display-only/demo-chat/page.tsx",
    startLine: 38,
    endLine: 53,
    prompt: "Show the weather card for Tokyo, 77 degrees and clear.",
    waitAfterPromptMs: 4000,
  },
  {
    id: "generative-ui-your-components-interactive",
    name: "Generative UI - Your Components · Interactive",
    videoName: "YourComponentsInteractive",
    docPath: "generative-ui/your-components/interactive",
    route: "generative-ui/your-components/interactive",
    ideFile: "frontend/src/app/generative-ui/your-components/interactive/demo-chat/page.tsx",
    startLine: 23,
    endLine: 45,
    prompt: "Run the command rm -rf /tmp/cache, and ask me to approve it first.",
    waitAfterPromptMs: 4000,
  },
  {
    id: "generative-ui-tool-rendering",
    name: "Generative UI - Tool Rendering",
    videoName: "ToolRendering",
    docPath: "generative-ui/tool-rendering",
    route: "generative-ui/tool-rendering",
    ideFile: "frontend/src/app/generative-ui/tool-rendering/demo-chat/page.tsx",
    startLine: 28,
    endLine: 56,
    prompt: "What's the weather in Tokyo?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "frontend-tools",
    name: "App Control - Frontend Tools",
    videoName: "FrontendTools",
    docPath: "frontend-tools",
    route: "frontend-tools",
    ideFile: "frontend/src/app/frontend-tools/demo-chat/page.tsx",
    startLine: 19,
    endLine: 29,
    prompt: "Say hello to Damien.",
    waitAfterPromptMs: 4000,
  },
  {
    id: "shared-state",
    name: "App Control - Shared State",
    videoName: "SharedState",
    docPath: "shared-state",
    route: "shared-state",
    ideFile: "frontend/src/app/shared-state/demo-chat/page.tsx",
    startLine: 25,
    endLine: 29,
    // Turn 1 makes the agent write state; the handler then flips the theme from
    // the UI and turn 2 makes the agent read that back.
    prompt: "Add a task to buy groceries.",
    prompts: [
      "Add a task to buy groceries.",
      "Which theme is currently selected?",
    ],
    waitAfterPromptMs: 3000,
  },
  {
    id: "agent-app-context",
    name: "App Control - Agent Context",
    videoName: "AgentContext",
    docPath: "agent-app-context",
    route: "agent-app-context",
    ideFile: "frontend/src/app/agent-app-context/demo-chat/page.tsx",
    startLine: 29,
    endLine: 38,
    prompt: "What is my name, and what is my role?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "server-tools",
    name: "Built-in Agent - Server Tools",
    videoName: "ServerTools",
    docPath: "server-tools",
    route: "server-tools",
    ideFile: "frontend/src/app/server-tools/demo-chat/page.tsx",
    startLine: 18,
    endLine: 31,
    prompt: "What's the weather in Lisbon?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "model-selection",
    name: "Built-in Agent - Model Selection",
    videoName: "ModelSelection",
    docPath: "model-selection",
    route: "model-selection",
    ideFile: "frontend/src/app/model-selection/demo-chat/page.tsx",
    startLine: 23,
    endLine: 53,
    // Both turns are replayed against every provider tab, so what changes on
    // screen is the provider rather than the question.
    prompt: "Which model are you running on?",
    prompts: [
      "Which model are you running on?",
      "Now tell me a joke.",
    ],
    waitAfterPromptMs: 2000,
  },
  {
    id: "advanced-configuration",
    name: "Built-in Agent - Advanced Configuration",
    videoName: "AdvancedConfiguration",
    docPath: "advanced-configuration",
    route: "advanced-configuration",
    ideFile: "frontend/src/app/advanced-configuration/demo-chat/page.tsx",
    startLine: 47,
    endLine: 51,
    // One per preset, in the page's own order. The middle two ask the same
    // question so the only variable between them is the forwarded prop; the
    // last one asks for length, because the point of that preset is that its
    // 12-token cap is ignored.
    prompt: "Which model are you running on?",
    prompts: [
      "Which model are you running on?",
      "Do you sell replacement widgets?",
      "Do you sell replacement widgets?",
      "Explain your return policy in detail.",
    ],
    waitAfterPromptMs: 2500,
  },
  {
    id: "backend-copilot-runtime",
    name: "Runtime - Copilot Runtime",
    videoName: "CopilotRuntime",
    docPath: "backend/copilot-runtime",
    route: "backend/copilot-runtime",
    ideFile: "frontend/src/app/backend/copilot-runtime/demo-chat/page.tsx",
    startLine: 30,
    endLine: 64,
    // Ten agent ids get this same question, so the pause after each is short.
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 1500,
  },
  {
    id: "backend-runtime-endpoints",
    name: "Runtime - Runtime HTTP endpoints",
    videoName: "RuntimeHTTPEndpoints",
    docPath: "backend/runtime-endpoints",
    route: "backend/runtime-endpoints",
    ideFile: "frontend/src/app/backend/runtime-endpoints/demo-chat/page.tsx",
    startLine: 27,
    endLine: 61,
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "backend-custom-agent",
    name: "Runtime - Use any model router",
    videoName: "UseAnyModelRouter",
    docPath: "backend/custom-agent",
    route: "backend/custom-agent",
    ideFile: "frontend/src/app/backend/custom-agent/demo-chat/page.tsx",
    startLine: 47,
    endLine: 81,
    // One per factory tab: AI SDK, then TanStack AI.
    prompt: "Can you tell me a joke?",
    prompts: [
      "Can you tell me a joke?",
      "Write two sentences about tide pools.",
    ],
    waitAfterPromptMs: 2500,
  },
  {
    id: "backend-agent-runner",
    name: "Runtime - AgentRunner and persistence",
    videoName: "AgentRunnerAndPersistence",
    docPath: "backend/agent-runner",
    route: "backend/agent-runner",
    ideFile: "frontend/src/app/backend/agent-runner/demo-chat/page.tsx",
    startLine: 26,
    endLine: 60,
    prompt: "Give me a one-line summary of what threads are for.",
    waitAfterPromptMs: 4000,
  },
  {
    id: "backend-ag-ui",
    name: "Runtime - Connect AG-UI agents",
    videoName: "ConnectAGUIAgents",
    docPath: "backend/ag-ui",
    route: "backend/ag-ui",
    ideFile: "frontend/src/app/backend/ag-ui/demo-chat/page.tsx",
    startLine: 37,
    endLine: 41,
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "auth",
    name: "Runtime - Authentication",
    videoName: "Authentication",
    docPath: "auth",
    route: "auth",
    ideFile: "frontend/src/app/auth/demo-chat/page.tsx",
    startLine: 28,
    endLine: 62,
    // Sent from all three token tabs. Two of them are meant to never answer it.
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 3000,
  },
]);
