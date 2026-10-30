import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { mcpClientsAgents } from "@/copilotkit/mcp-clients";

/**
 * Harness glue for `/mcp-servers`: the `mcpClients` samples open their MCP
 * connection when this module is imported (top-level `await`), so they get a
 * runtime of their own. If the MCP server is down on first request, this whole
 * route fails to load — the `mcpServers` agents on
 * `/api/copilotkit-mcp-servers` keep working. Restart `next dev` after starting
 * the server to retry the import.
 */
const runtime = new CopilotRuntime({ agents: mcpClientsAgents });

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp-clients",
});

export const GET = handler;
export const POST = handler;
