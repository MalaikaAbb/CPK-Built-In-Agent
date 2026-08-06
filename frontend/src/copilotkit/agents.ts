import "server-only";

import { openai } from "@ai-sdk/openai";
import {
  BuiltInAgent,
  convertInputToTanStackAI,
  convertMessagesToVercelAISDKMessages,
} from "@copilotkit/runtime/v2";
import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import { streamText } from "ai";

import {
  ANTHROPIC_MODEL_ID,
  GOOGLE_MODEL_ID,
  MODEL,
  OPENAI_MODEL_ID,
} from "./model";
import { getWeather, get_weather } from "./tools";

/**
 * Every agent this runtime serves.
 *
 * There is no separate agent framework here: `BuiltInAgent` from
 * `@copilotkit/runtime/v2` *is* the agent. It owns the model call, the tool
 * loop, MCP, and the AG-UI state tools, and it runs inside the Next.js process.
 *
 * The docs register a single agent under the key `default`. This harness needs
 * more than one, because the config a page teaches is constructor config —
 * `tools`, `maxSteps`, `temperature`, `prompt`, factory mode — and those cannot
 * co-exist on one instance without one page's settings changing another page's
 * behaviour. Route pages pass the id they need as `agentId`; the key in the
 * `agents` record is the id.
 */

//#region default-agent
/** Quickstart. Model and nothing else — the doc's whole configuration. */
export const builtInAgent = new BuiltInAgent({
  model: MODEL,
});
//#endregion

//#region server-tools-agent
/** Server Tools. `maxSteps: 2` is what lets the model speak after the tool returns. */
export const serverToolsAgent = new BuiltInAgent({
  model: MODEL,
  tools: [getWeather],
  maxSteps: 2,
});
//#endregion

//#region rendering-agent
/**
 * Tool Rendering, Programmatic Control, AG-UI.
 *
 * Carries `get_weather` so the renderers those pages define have a real tool
 * call to render.
 */
export const renderingAgent = new BuiltInAgent({
  model: MODEL,
  tools: [get_weather],
  maxSteps: 2,
});
//#endregion

//#region advanced-agent
/**
 * Advanced Configuration.
 *
 * Every field on this instance is from that page's samples, collected onto one
 * agent so the effect is observable in a chat. `overridableProperties` is what
 * allows the demo page to send a different `prompt`/`temperature`/`model` per
 * run through `forwardedProps`.
 */
export const advancedAgent = new BuiltInAgent({
  model: MODEL,
  prompt:
    "You are a customer support agent for Acme Corp. Be concise and helpful. Always check the knowledge base before answering.",
  maxSteps: 5,
  toolChoice: "auto",
  temperature: 0.7,
  topP: 0.9,
  maxOutputTokens: 4096,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1,
  seed: 42,
  maxRetries: 3,
  overridableProperties: ["model", "temperature", "prompt"],
  forwardSystemMessages: true,
  forwardDeveloperMessages: true,
});
//#endregion

//#region shared-state-agent
/**
 * Shared State.
 *
 * The Shared State page shows only frontend code. The agent side of it is
 * `BuiltInAgent`'s own behaviour: when a run arrives carrying non-empty state,
 * the agent is handed `AGUISendStateSnapshot` / `AGUISendStateDelta` and the
 * current state is injected into its system prompt.
 *
 * `maxSteps` has to be above the default of 1 or the run ends on the state-tool
 * call and the agent never gets to reply. The value is the one the Advanced
 * Configuration page uses.
 */
export const sharedStateAgent = new BuiltInAgent({
  model: MODEL,
  maxSteps: 5,
});
//#endregion

//#region model-selection-agents
/**
 * Model Selection — one agent per provider, so the page's central claim is
 * testable rather than described: the same `BuiltInAgent`, the same chat UI,
 * three different model providers, distinguished only by the `provider:model`
 * prefix and which key they read.
 *
 * `apiKey` is passed explicitly on each. It is optional — `resolveModel` falls
 * back to `OPENAI_API_KEY`, `GOOGLE_API_KEY`, and `ANTHROPIC_API_KEY`
 * respectively — but the page's "custom API key" sample passes it, and being
 * explicit is what makes the per-provider wiring visible here.
 *
 * No extra packages: `@ai-sdk/anthropic` and `@ai-sdk/google` ship as
 * dependencies of `@copilotkit/runtime`, and the runtime constructs the
 * provider from the prefix.
 */

/** Agent A — OpenAI. Reads OPENAI_API_KEY. */
export const openAiAgent = new BuiltInAgent({
  model: OPENAI_MODEL_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

/** Agent B — Google. Reads GOOGLE_API_KEY. */
export const googleAgent = new BuiltInAgent({
  model: GOOGLE_MODEL_ID,
  apiKey: process.env.GOOGLE_API_KEY,
});

/** Agent C — Anthropic. Reads ANTHROPIC_API_KEY. */
export const anthropicAgent = new BuiltInAgent({
  model: ANTHROPIC_MODEL_ID,
  apiKey: process.env.ANTHROPIC_API_KEY,
});
//#endregion

//#region aisdk-agent
/**
 * Use any model router — factory mode.
 *
 * In factory mode the built-in agent stops making the model call and only
 * manages the run lifecycle and the AG-UI event stream; `streamText` here is
 * ours. The model id is the doc's own `gpt-4o`, not `MODEL`, because this is
 * the sample's point: the router is yours to choose.
 */
export const aiSdkAgent = new BuiltInAgent({
  type: "aisdk",
  factory: ({ input, abortSignal }) =>
    streamText({
      model: openai("gpt-4o"),
      messages: convertMessagesToVercelAISDKMessages(input.messages),
      abortSignal,
    }),
});
//#endregion

//#region tanstack-agent
/**
 * Use any model router — the TanStack AI factory, the second of the page's
 * three modes.
 *
 * The difference from the AI SDK factory above is only in what the factory
 * returns: `streamText()` hands back an object with a `fullStream`, while
 * `chat()` is itself an async iterable of TanStack chunks. `type` is what tells
 * the agent which of the two it is about to receive.
 *
 * `convertInputToTanStackAI` splits the AG-UI run input into the two things
 * `chat()` wants separately — the message list and the system prompts — where
 * the AI SDK path folds both into one `messages` array.
 */
export const tanStackAgent = new BuiltInAgent({
  type: "tanstack",
  factory: ({ input, abortController }) => {
    const { messages, systemPrompts } = convertInputToTanStackAI(input);
    return chat({
      adapter: openaiText("gpt-4o"),
      messages,
      systemPrompts,
      abortController,
    });
  },
});
//#endregion

/** The record the runtime is constructed with. Keys are the agent ids. */
export const agents = {
  default: builtInAgent,
  serverToolsAgent,
  renderingAgent,
  advancedAgent,
  sharedStateAgent,
  openAiAgent,
  googleAgent,
  anthropicAgent,
  aiSdkAgent,
  tanStackAgent,
};
