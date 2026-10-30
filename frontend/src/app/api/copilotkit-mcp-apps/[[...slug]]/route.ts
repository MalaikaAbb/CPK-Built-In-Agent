/**
 * The MCP Apps page's `app/api/copilotkit/[[...slug]]/route.ts`, verbatim
 * except for one line: `basePath`, because this file is mounted at
 * `/api/copilotkit-mcp-apps` rather than replacing the app-wide runtime. The
 * page's runtime is in SSE mode with `InMemoryAgentRunner`, and putting it on
 * the shared route would drop that route's Intelligence wiring.
 *
 * `http://localhost:3108/mcp` is the published URL, unchanged: `npm run
 * mcp:apps` starts the official ext-apps example server
 * (`@modelcontextprotocol/server-basic-react`) on that port.
 */
//#region route
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

const agent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  prompt: "You are a helpful assistant.",
}).use(
  new MCPAppsMiddleware({
    mcpServers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server",
      },
    ],
  }),
);

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp-apps", // published: "/api/copilotkit"
});

export const GET = handler;
export const POST = handler;
//#endregion
