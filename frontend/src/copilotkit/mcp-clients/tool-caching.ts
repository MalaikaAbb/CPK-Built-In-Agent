import "server-only";

import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { LOCAL_MCP_HTTP_URL } from "../mcp-local";

/**
 * Harness glue, not on the page: the "Tool caching" sample uses a `transport`
 * defined by the previous sample. A transport carries one connection and can
 * only be started once, so this module builds its own the same way.
 */
const transport = new StreamableHTTPClientTransport(new URL(LOCAL_MCP_HTTP_URL));

// The page uses `ToolSet` without importing it (it comes from `ai`). Left as
// published: a type-only gap, erased at runtime, reported by `npm run typecheck`.

//#region tool-caching
const client = await createMCPClient({ transport });

let cachedTools: ToolSet | null = null;
const warmupPromise = client.tools().then(tools => { cachedTools = tools; });

const provider = {
  async tools() {
    if (cachedTools) return cachedTools;
    await warmupPromise;
    return cachedTools!;
  },
};

const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpClients: [provider],
});
//#endregion

export { builtInAgent as toolCachingAgent };
