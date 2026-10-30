import "server-only";

import { BuiltInAgent } from "@copilotkit/runtime/v2";

import { LOCAL_MCP_SSE_URL } from "../mcp-local";
import { client } from "./user-managed";

/**
 * Harness glue, not on the page: the "Combining with mcpServers" sample names a
 * `persistentClient` it never defines. It is the user-managed client from the
 * sample before it, which is what the page's comment describes.
 */
const persistentClient = client;

//#region combined
const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpClients: [persistentClient],  // User-managed, persistent
  mcpServers: [                     // Agent-managed, per-request
    { type: "sse", url: LOCAL_MCP_SSE_URL }, // published: "https://other-mcp.example.com/sse"
  ],
});
//#endregion

export { builtInAgent as combinedAgent };
