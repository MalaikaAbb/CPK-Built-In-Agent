"use client";

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * MCP Servers — one chat, every sample on the page selectable.
 *
 * The page publishes agent configs only, so all of this is harness glue. The
 * samples sit on two runtimes: the `mcpServers` ones connect per run, the
 * `mcpClients` ones connect at import time and so live on a route of their own
 * (a stopped MCP server would otherwise take the first group down with them).
 * Switching remounts the provider, so each pick starts a fresh thread.
 */

const SERVERS_URL = "/api/copilotkit-mcp-servers";
const CLIENTS_URL = "/api/copilotkit-mcp-clients";

const SAMPLES = [
  { id: "mcp-http", runtimeUrl: SERVERS_URL, label: "HTTP transport" },
  { id: "mcp-sse", runtimeUrl: SERVERS_URL, label: "SSE transport" },
  { id: "mcp-sse-auth", runtimeUrl: SERVERS_URL, label: "SSE + authentication headers" },
  { id: "mcp-multiple", runtimeUrl: SERVERS_URL, label: "Multiple servers" },
  { id: "mcp-collisions", runtimeUrl: SERVERS_URL, label: "Tool name collisions (staging / production)" },
  { id: "mcp-with-server-tools", runtimeUrl: SERVERS_URL, label: "Combining with server tools (getUser)" },
  { id: "mcp-client", runtimeUrl: CLIENTS_URL, label: "mcpClients: user-managed client" },
  { id: "mcp-client-cached", runtimeUrl: CLIENTS_URL, label: "mcpClients: tool caching" },
  { id: "mcp-client-dynamic-auth", runtimeUrl: CLIENTS_URL, label: "mcpClients: dynamic authentication" },
  { id: "mcp-client-combined", runtimeUrl: CLIENTS_URL, label: "mcpClients + mcpServers" },
] as const;

export default function Page() {
  const [sample, setSample] = useState<(typeof SAMPLES)[number]>(SAMPLES[0]);

  return (
    <DemoFrame parentPath="/mcp-servers" subtitle={`${sample.runtimeUrl} · ${sample.id}`}>
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-slate-200 p-3 dark:border-slate-800">
          <label className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            Sample
            <select
              value={sample.id}
              onChange={(e) =>
                setSample(SAMPLES.find((s) => s.id === e.target.value) ?? SAMPLES[0])
              }
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
            >
              {SAMPLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="min-h-0 flex-1">
          <CopilotKitProvider key={sample.id} runtimeUrl={sample.runtimeUrl}>
            <CopilotChat
              agentId={sample.id}
              labels={{
                welcomeMessageText:
                  "Needs `npm run mcp:everything` (and `mcp:everything:sse` for the SSE samples). Try: use the echo tool to say hello.",
              }}
            />
          </CopilotKitProvider>
        </div>
      </div>
    </DemoFrame>
  );
}
