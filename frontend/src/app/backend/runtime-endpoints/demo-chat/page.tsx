"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * A live probe of this app's own runtime endpoints, beside a chat that produces
 * traffic on them.
 *
 * `GET /info` is the one endpoint safe to call by hand — it is what the client
 * itself calls on mount to discover agents, and it returns JSON rather than an
 * SSE stream. The run and stop endpoints are listed but not fired from here:
 * they expect a full AG-UI `RunAgentInput`, and the chat on the right is already
 * the honest way to exercise them.
 */

const ENDPOINTS: [string, string, string][] = [
  ["GET", "/api/copilotkit/info", "Runtime info and agent discovery"],
  ["POST", "/api/copilotkit/agent/:agentId/run", "Start a run — SSE stream"],
  ["POST", "/api/copilotkit/agent/:agentId/connect", "Re-attach to a thread — SSE stream"],
  ["POST", "/api/copilotkit/agent/:agentId/stop/:threadId", "Stop an in-progress run"],
  ["POST", "/api/copilotkit/transcribe", "Transcribe audio"],
];

export default function Page() {
  const [info, setInfo] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const probe = async () => {
    setStatus("fetching…");
    try {
      const res = await fetch("/api/copilotkit/info");
      const text = await res.text();
      setStatus(`${res.status} ${res.statusText}`);
      try {
        setInfo(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        setInfo(text);
      }
    } catch (error) {
      setStatus("network error");
      setInfo(String(error));
    }
  };

  return (
    <DemoFrame
      parentPath="/backend/runtime-endpoints"
      subtitle="multi-route mode · GET /info probed live"
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col border-b border-slate-200 lg:border-b-0 lg:border-r dark:border-slate-800">
          <div className="shrink-0 space-y-3 p-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[26rem] text-left text-xs">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ENDPOINTS.map(([method, path, what]) => (
                    <tr key={path} className="align-top">
                      <td className="py-1.5 pr-3 font-mono font-semibold text-[var(--accent)]">
                        {method}
                      </td>
                      <td className="py-1.5 pr-3 font-mono text-slate-700 dark:text-slate-300">
                        {path}
                      </td>
                      <td className="py-1.5 text-slate-500">{what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={probe}
                className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
              >
                GET /api/copilotkit/info
              </button>
              <span className="font-mono text-xs text-slate-500">{status}</span>
            </div>
          </div>

          <pre className="min-h-0 flex-1 overflow-auto bg-slate-950 p-3 text-xs text-slate-200">
            {info || "Press the button. Expect a JSON body listing all ten agents."}
          </pre>
        </div>

        <div className="min-h-0">
          <CopilotChat
            agentId="renderingAgent"
            labels={{
              welcomeMessageText:
                "Anything sent here goes through POST /agent/renderingAgent/run.",
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
