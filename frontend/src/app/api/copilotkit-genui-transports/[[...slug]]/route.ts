// The Transports page's runtime: `generativeUI: true` adds the `render_ui`
// tool to every run, whether or not the run carries a catalog.
//
// The page shows only the `CopilotRuntime` call; `agent` is the one the
// Components and surfaces page builds, copied here unchanged so this route
// stands alone. Harness glue: the `shop` agent id and the basePath — `shop` is
// the id the page's "Only some agents" sample lists in `agentIds`, so the demo
// has an agent that is in that list and one (`default`) that is not.

import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import {
  BuiltInAgent,
  convertInputToTanStackAI,
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

function createAgent() {
  return new BuiltInAgent({
    type: "tanstack",
    factory: ({ input, abortController }) => {
      const { messages, systemPrompts, tools } = convertInputToTanStackAI(input);
      return chat({
        adapter: openaiText("gpt-5.5"),
        messages,
        systemPrompts: [
          "You are a helpful assistant. When a visual answer helps, render it with generative UI.",
          ...systemPrompts,
        ],
        tools,
        abortController,
        threadId: input.threadId, // @tanstack/ai 1.0 types this as required; the published call does not pass one
      });
    },
  });
}

const agent = createAgent();

//#region transports-runtime
const runtime = new CopilotRuntime({
  agents: { default: agent, shop: createAgent() /* harness glue */ },
  generativeUI: true,
});
//#endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui-transports",
});

export const GET = handler;
export const POST = handler;
