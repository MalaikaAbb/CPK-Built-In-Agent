import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

import { builtInAgent } from "@/copilotkit/agents";

/**
 * The Dynamic Schema A2UI page's dedicated runtime, in the shape of its demo
 * Code tab — `mode: "single-route"`, `withProbeCompat` on POST, GET/POST/OPTIONS
 * as arrow handlers — with the page's prose path for the tool:
 * `a2ui: { injectA2UITool: true }`. The runtime's A2UI middleware injects
 * `generate_a2ui` itself, so the agent owns no A2UI tool and the Code tab's
 * `a2ui-factory.ts` (a TanStack agent with its own `generate_a2ui` and a
 * secondary model call) is not used.
 *
 * The page publishes no built-in agent for this demo, so the agent is the
 * Quickstart's `builtInAgent`, registered under the id the demo page names.
 *
 * Harness edit: the Code tab wraps each verb in `withForwardedHeaders` from the
 * unpublished `@/lib/header-forwarding`; omitted, each verb calls its handler.
 */
//#region runtime
const runtime = new CopilotRuntime({
  agents: { "declarative-gen-ui": builtInAgent },
  runner: new InMemoryAgentRunner(),
  a2ui: {
    injectA2UITool: true,
    // Models follow the tool-usage guide and omit `catalogId`, and the
    // middleware then falls back to the unregistered spec basic catalog
    // ("Catalog not found" render error). Pin the catalog the page registers.
    defaultCatalogId: "declarative-gen-ui-catalog",
  },
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-declarative-gen-ui",
  mode: "single-route",
});

async function withProbeCompat(req: Request): Promise<Response> {
  const res = await handler(req);
  if (res.status === 404) {
    const body = await res.text();
    return new Response(body, { status: 400, headers: res.headers });
  }
  return res;
}
//#endregion

export const GET = (req: Request) => handler(req);
export const POST = (req: Request) => withProbeCompat(req);
export const OPTIONS = (req: Request) => handler(req);
