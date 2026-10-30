"use client";

import { useAgent } from "@copilotkit/react-core/v2";

/**
 * "Driving one agent per thread": the page's `useAgent` call, unchanged, for
 * whichever thread the sidebar has selected.
 *
 * All three ids together register a private proxied agent pinned to that
 * thread, routed to the one runtime agent (`default`). The strip below only
 * reads it — the point is that this agent is a separate instance from the
 * chat's, addressing the same thread.
 */
export function ThreadAgentStrip({ threadId }: { threadId: string }) {
  const { agent } = useAgent({
    agentId: `chat-${threadId}`, // local id, unique per mounted thread
    runtimeAgentId: "default",   // the one runtime agent they all route to
    threadId,                    // the thread this instance is pinned to
  });

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-200 px-4 py-2 font-mono text-xs text-slate-500 dark:border-slate-800">
      <span>useAgent → agentId={agent.agentId}</span>
      <span>threadId={agent.threadId}</span>
      <span>messages={agent.messages.length}</span>
      <span>{agent.isRunning ? "running" : "idle"}</span>
    </div>
  );
}
