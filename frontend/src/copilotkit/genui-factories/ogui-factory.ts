// Harness edit (not the doc's): the Code tab's `forwardingFetch` import from
// `../header-forwarding` and `DEMO_AGENT_LOOP_STRATEGY` from `./demo-stream`
// are showcase infrastructure the page never publishes (aimock header
// forwarding and a test-fixture loop cap). Both are removed below; `chat()`
// falls back to its default loop strategy, maxIterations(5). Everything else
// in this file is the Code tab's, byte for byte.
import { BuiltInAgent, convertInputToTanStackAI } from "@copilotkit/runtime/v2";
import { chat, toolDefinition } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import { jsonSchemaToZod } from "./tanstack-factory";

/**
 * Built-in agent for the Open Generative UI demo.
 *
 * The runtime's `openGenerativeUI` flag (see
 * `src/app/api/copilotkit-ogui/route.ts`) makes `OpenGenerativeUIMiddleware`
 * inject the `generateSandboxedUi` tool into `input.tools` at request time.
 * We MUST declare those tools to `chat()`, or the model never sees
 * `generateSandboxedUi` and emits the UI as a raw HTML code block instead of
 * a tool call — so the sandboxed iframe never renders.
 *
 * Tools are declared via `toolDefinition()` (same pattern as
 * `tanstack-factory.ts`) rather than reusing `convertInputToTanStackAI`'s
 * `tools`, because that field only exists in @copilotkit/runtime >= 1.61.0
 * and this app pins 1.60.2.
 */
export function createOguiAgent() {
  return new BuiltInAgent({
    type: "tanstack",
    factory: ({ input, abortController }) => {
      const { messages, systemPrompts } = convertInputToTanStackAI(input);
      // Declaration-only (no executor): the model calls the tool and the
      // OpenGenerativeUIMiddleware turns the tool-call stream into the
      // sandboxed-iframe activity.
      const tools = (input.tools ?? []).map((t) =>
        toolDefinition({
          name: t.name,
          description: t.description ?? "",
          inputSchema: jsonSchemaToZod(t.parameters),
        }),
      );
      return chat({
        adapter: openaiText("gpt-5.4"),
        messages,
        systemPrompts,
        tools,
        abortController,
        threadId: input.threadId, // @tanstack/ai 1.0 types this as required; the published call does not pass one
      });
    },
  });
}