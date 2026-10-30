import "server-only";

/**
 * Where the MCP Servers page's placeholder URLs point in this harness.
 *
 * Every URL that page prints is an example host (`my-mcp-server.example.com`,
 * `search-mcp.example.com`, …) — nothing answers there. The harness runs the
 * official reference server, `@modelcontextprotocol/server-everything`, twice:
 *
 *   npm run mcp:everything      Streamable HTTP  → http://localhost:3001/mcp
 *   npm run mcp:everything:sse  SSE              → http://localhost:3002/sse
 *
 * Each agent keeps the published URL beside the substitution as a comment, so
 * the route page still shows what the doc says. Override with MCP_HTTP_URL /
 * MCP_SSE_URL to point at a server of your own.
 */
export const LOCAL_MCP_HTTP_URL =
  process.env.MCP_HTTP_URL ?? "http://localhost:3001/mcp";

export const LOCAL_MCP_SSE_URL =
  process.env.MCP_SSE_URL ?? "http://localhost:3002/sse";
