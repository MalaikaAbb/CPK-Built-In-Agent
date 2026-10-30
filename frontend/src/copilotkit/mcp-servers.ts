import "server-only";

import { BuiltInAgent, defineTool } from "@copilotkit/runtime/v2";
import { z } from "zod";

import { LOCAL_MCP_HTTP_URL, LOCAL_MCP_SSE_URL } from "./mcp-local";

/**
 * MCP Servers — the `mcpServers` samples, one agent each.
 *
 * Every sample on the page is a `const builtInAgent = new BuiltInAgent(...)`;
 * they cannot share that name in one module, so each is renamed after what it
 * demonstrates. The config inside each is the page's, with two substitutions:
 *
 *   - Example hosts become the local reference server (`mcp-local.ts`). The
 *     published URL is kept as a trailing comment on the same line.
 *   - Nothing else. The model literal stays `openai:gpt-5.4-mini`.
 *
 * `mcpServers` connects per run: a server that is down fails that run only,
 * never module load. The `mcpClients` samples connect at import time, which is
 * why they live behind a separate runtime route (`mcp-clients.ts`).
 *
 * Served by `/api/copilotkit-mcp-servers`, not the app-wide runtime.
 */

//#region sse
const sseAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpServers: [
    {
      type: "sse",
      url: LOCAL_MCP_SSE_URL, // published: "https://my-mcp-server.example.com/sse"
    },
  ],
});
//#endregion

//#region sse-auth
const sseAuthAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpServers: [
    {
      type: "sse",
      url: LOCAL_MCP_SSE_URL, // published: "https://my-mcp-server.example.com/sse"
      headers: {
        Authorization: `Bearer ${process.env.MCP_API_KEY}`,
      },
    },
  ],
});
//#endregion

//#region http
const httpAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpServers: [
    {
      type: "http",
      url: LOCAL_MCP_HTTP_URL, // published: "https://my-mcp-server.example.com/mcp"
    },
  ],
});
//#endregion

//#region multiple
const multipleAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpServers: [
    {
      type: "sse",
      url: LOCAL_MCP_SSE_URL, // published: "https://search-mcp.example.com/sse"
    },
    {
      type: "sse",
      url: LOCAL_MCP_SSE_URL, // published: "https://db-mcp.example.com/sse"
      headers: { Authorization: `Bearer ${process.env.DB_MCP_KEY}` },
    },
    {
      type: "http",
      url: LOCAL_MCP_HTTP_URL, // published: "https://analytics-mcp.example.com/mcp"
    },
  ],
});
//#endregion

//#region collisions
const collisionsAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpServers: [
    { type: "http", url: LOCAL_MCP_HTTP_URL, name: "staging" }, // published: "https://staging.example.com/mcp"
    { type: "http", url: LOCAL_MCP_HTTP_URL, name: "production" }, // published: "https://prod.example.com/mcp"
  ],
});
// Both servers expose `search`, so the model sees `staging_search` and `production_search`.
//#endregion

//#region with-server-tools
const customTool = defineTool({
  name: "getUser",
  description: "Get the current user",
  parameters: z.object({}),
  execute: async () => {
    return { name: "Jane", role: "Admin" };
  },
});

const withServerToolsAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  tools: [customTool], // Your custom tools
  mcpServers: [        // Plus tools from MCP servers
    { type: "sse", url: LOCAL_MCP_SSE_URL }, // published: "https://search-mcp.example.com/sse"
  ],
});
//#endregion

/** Keys are the agent ids the `/mcp-servers` demo picks between. */
export const mcpServersAgents = {
  "mcp-sse": sseAgent,
  "mcp-sse-auth": sseAuthAgent,
  "mcp-http": httpAgent,
  "mcp-multiple": multipleAgent,
  "mcp-collisions": collisionsAgent,
  "mcp-with-server-tools": withServerToolsAgent,
};
