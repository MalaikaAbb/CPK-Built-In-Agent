import "server-only";

//#region user-managed
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { LOCAL_MCP_HTTP_URL } from "../mcp-local";

// Create a persistent client at startup
const transport = new StreamableHTTPClientTransport(
  new URL(LOCAL_MCP_HTTP_URL), // published: "https://my-mcp-server.example.com/mcp"
);
const client = await createMCPClient({ transport });

const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpClients: [client],
});
//#endregion

/**
 * The page's "User-managed MCP clients" sample. The connection opens when this
 * module is first imported (top-level `await`) and is never closed by the
 * agent — the page's point. If the MCP server is not running at that moment,
 * the import rejects and every agent on `/api/copilotkit-mcp-clients` fails
 * with it.
 *
 * `client` is also exported as the `persistentClient` the "Combining with
 * mcpServers" sample names but never defines (see `combined.ts`).
 */
export { builtInAgent as userManagedAgent, client };
