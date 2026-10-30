import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

import { createOguiAgent } from "@/copilotkit/genui-factories/ogui-factory";

/**
 * The Open Generative UI page's dedicated runtime. The `runtime` literal is the
 * one the page prints under "Enable it in the runtime"; the handler around it
 * is from the demo Code tab.
 *
 * Harness edits: `withForwardedHeaders` / `withProbeCompat` wrappers removed —
 * showcase-only, never published, and not needed for the client's auto
 * transport detection.
 */
//#region runtime
const runtime = new CopilotRuntime({
  agents: {
    "open-gen-ui": createOguiAgent(),
    "open-gen-ui-advanced": createOguiAgent(),
  },
  runner: new InMemoryAgentRunner(),
  openGenerativeUI: {
    agents: ["open-gen-ui", "open-gen-ui-advanced"],
  },
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-ogui",
  mode: "single-route",
});
//#endregion

export { handler as GET, handler as POST, handler as OPTIONS };
