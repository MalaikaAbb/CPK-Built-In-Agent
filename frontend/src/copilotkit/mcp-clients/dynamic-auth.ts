import "server-only";

import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { LOCAL_MCP_HTTP_URL } from "../mcp-local";

/**
 * Repo-authored stand-ins: the "Dynamic authentication" sample calls
 * `isTokenExpired()`, `getFreshToken()`, `makeTransport()`, and reassigns a
 * `currentClient` — none of which the page defines. They are your app's own
 * token plumbing, so this harness supplies the smallest version that makes the
 * reconnect path observable: a token that "expires" 60 seconds after it was
 * issued, sent as a bearer header the reference server ignores. Each reconnect
 * is logged to the dev-server terminal.
 */
const TOKEN_TTL_MS = 60_000;
let issuedAt = 0;

function getFreshToken(): string {
  issuedAt = Date.now();
  console.log("[mcp dynamic-auth] issuing a fresh token and reconnecting");
  return `demo-token-${issuedAt}`;
}

function isTokenExpired(): boolean {
  return Date.now() - issuedAt > TOKEN_TTL_MS;
}

function makeTransport(token: string) {
  return new StreamableHTTPClientTransport(new URL(LOCAL_MCP_HTTP_URL), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  });
}

let currentClient = await createMCPClient({
  transport: makeTransport(getFreshToken()),
});

//#region dynamic-auth
const provider = {
  async tools() {
    if (isTokenExpired()) {
      await currentClient.close();
      currentClient = await createMCPClient({
        transport: makeTransport(getFreshToken()),
      });
    }
    return currentClient.tools();
  },
};

const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  mcpClients: [provider],
});
//#endregion

export { builtInAgent as dynamicAuthAgent };
