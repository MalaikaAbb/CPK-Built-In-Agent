"use client";

/**
 * Repo-authored stand-in: ./subagent-activity-card is imported by the page's
 * Code tab but not published. Minimal: one line per sub-agent tool call, with
 * the task, the status `useRenderTool` passes, and the result once it lands.
 */
import type { SubAgentName } from "./delegation-log";

export type SubAgentToolStatus = "inProgress" | "executing" | "complete";

export function SubAgentActivityCard({
  subAgent,
  task,
  status,
  result,
}: {
  subAgent: SubAgentName;
  task?: string;
  status: SubAgentToolStatus;
  result?: string;
}) {
  return (
    <div className="my-2 rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold">{subAgent}</span>
        <span className="text-xs text-slate-500">{status}</span>
      </div>
      {task && <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Task: {task}</p>}
      {result && <p className="mt-2 whitespace-pre-wrap">{result}</p>}
    </div>
  );
}
