import "server-only";

import { combinedAgent } from "./combined";
import { dynamicAuthAgent } from "./dynamic-auth";
import { toolCachingAgent } from "./tool-caching";
import { userManagedAgent } from "./user-managed";

/**
 * The MCP Servers page's `mcpClients` samples, one agent each. Every module
 * here opens its MCP connection at import time, so the MCP server must be up
 * before the first request to `/api/copilotkit-mcp-clients`.
 */
export const mcpClientsAgents = {
  "mcp-client": userManagedAgent,
  "mcp-client-cached": toolCachingAgent,
  "mcp-client-dynamic-auth": dynamicAuthAgent,
  "mcp-client-combined": combinedAgent,
};
