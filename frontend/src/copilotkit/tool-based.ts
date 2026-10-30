import "server-only";

import { openai } from "@ai-sdk/openai";
import {
  BuiltInAgent,
  convertMessagesToVercelAISDKMessages,
  convertToolsToVercelAITools,
} from "@copilotkit/runtime/v2";
import { streamText } from "ai";

/**
 * Components as Tools — the three backend samples from that page, as published.
 *
 * The page's demo Code tab wires `gen-ui-tool-based` to a shared showcase
 * factory (`createBuiltInAgent({ systemPrompt: GEN_UI_TOOL_BASED_PROMPT })`)
 * whose prompt module and helper modules are not published. The page's own
 * prose, though, prints a complete config-mode agent and its prompt, so that is
 * what runs under the demo's agent id. Nothing essential is missing from it.
 */

//#region prompts
// app/api/copilotkit/prompts.ts
export const SYSTEM_PROMPT = `You are a data visualization assistant.

When the user asks for a chart, call \`render_bar_chart\` with a concise
title and a \`data\` array of \`{label, value}\` items.

If the user names a subject but supplies no numbers, invent plausible
sample values and render the chart on the first turn. Never reply with a
clarifying question asking for the data.`;
//#endregion

//#region config-mode
// app/api/copilotkit/[[...slug]]/route.ts
const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  prompt: SYSTEM_PROMPT,
});
//#endregion

//#region factory-mode
// app/api/copilotkit/factory.ts
const agent = new BuiltInAgent({
  type: "aisdk",
  factory: ({ input, abortSignal }) =>
    streamText({
      model: openai("gpt-4o"),
      messages: convertMessagesToVercelAISDKMessages(input.messages),
      tools: convertToolsToVercelAITools(input.tools),
      abortSignal,
    }),
});
//#endregion

/** Registered as `gen-ui-tool-based` — the agent id the demo page names. */
export const genUiToolBasedAgent = builtInAgent;

/**
 * Registered as `gen-ui-tool-based-factory`. Harness-only id: the page shows
 * factory mode as an alternative, never under its own agent id. Note the
 * published factory passes no system prompt, so the model has nothing telling
 * it when to call `render_bar_chart`.
 */
export const genUiToolBasedFactoryAgent = agent;
