// The Components and surfaces page's runtime ("Add the runtime and an agent"),
// as published. One harness change: `basePath` — the doc mounts this at
// `/api/copilotkit`, which in this repo already serves the Quickstart agent
// under `default`. Every Components and surfaces demo points its own provider
// here instead.
//
// Note on `chat({...})`: @tanstack/ai 1.0 types `threadId` as required on
// `chat()`; the published call does not pass one, so this line fails
// `tsc` (left as published — README §9).

import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import {
  BuiltInAgent,
  convertInputToTanStackAI,
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

const agent = new BuiltInAgent({
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

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

// Harness glue: the doc's basePath is "/api/copilotkit".
const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit-genui" });

export const GET = handler;
export const POST = handler;
