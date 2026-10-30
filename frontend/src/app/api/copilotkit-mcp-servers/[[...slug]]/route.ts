import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { mcpServersAgents } from "@/copilotkit/mcp-servers";

/**
 * Harness glue for `/mcp-servers`: the page publishes agent configs only, no
 * runtime of its own. A separate runtime keeps six MCP-dependent agents off the
 * app-wide `/api/copilotkit`, so a stopped MCP server never shows up on any
 * other route. Shape follows the Quickstart's runtime route.
 */
const runtime = new CopilotRuntime({ agents: mcpServersAgents });

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp-servers",
});

export const GET = handler;
export const POST = handler;
