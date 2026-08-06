"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useCallback, useEffect, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * A chat, plus a read-back of what this app's runner recorded.
 *
 * The runner is `MyRunner` — the doc page's subclass of
 * `InMemoryAgentRunner` — installed on the live runtime. Its `run` and `connect`
 * overrides are exactly where a real implementation would persist and re-hydrate
 * a thread, and the log on the left is the evidence that those overrides sit on
 * the hot path of every message sent on the right.
 *
 * The log lives in module scope on the server, so it demonstrates the page's main
 * warning by disappearing whenever the dev server restarts.
 */

interface RunnerCall {
  method: string;
  threadId: string;
}

export default function Page() {
  const [calls, setCalls] = useState<RunnerCall[]>([]);
  const [threads, setThreads] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/runner-log");
      const data = await res.json();
      setCalls(data.calls ?? []);
      setThreads(data.threads ?? 0);
    } catch {
      // The panel is diagnostic; a failed poll should not break the chat.
    }
  }, []);

  useEffect(() => {
    // Both calls are deferred: polling an external endpoint from an effect body
    // synchronously would set state during the same commit.
    const first = setTimeout(refresh, 100);
    const id = setInterval(refresh, 2000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [refresh]);

  return (
    <DemoFrame
      parentPath="/backend/agent-runner"
      subtitle="MyRunner extends InMemoryAgentRunner — live call log"
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col border-b border-slate-200 lg:border-b-0 lg:border-r dark:border-slate-800">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              {calls.length} calls · {threads} distinct threads
            </p>
            <button
              type="button"
              onClick={refresh}
              className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium dark:border-slate-600"
            >
              Refresh
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-950 p-3 font-mono text-xs">
            {calls.length === 0 ? (
              <p className="text-slate-500">
                Nothing yet. Send a message — every run passes through
                MyRunner.run().
              </p>
            ) : (
              <ul className="space-y-1">
                {calls.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 font-semibold text-violet-400">
                      {c.method}
                    </span>
                    <span className="min-w-0 break-all text-slate-400">
                      {c.threadId}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="min-h-0">
          <CopilotChat
            labels={{
              welcomeMessageText:
                "Send anything. Each run should add a MyRunner.run() line on the left.",
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
