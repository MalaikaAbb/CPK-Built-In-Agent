"use client";

import { useAgent } from "@copilotkit/react-core/v2";

/**
 * Repo-authored scaffolding around the page's "Writing back from the main
 * view" fragment. The page publishes `toggleItem` on its own, with `agent`
 * assumed in scope and no UI calling it; this supplies the `useAgent()` it
 * needs and one button per item. The function body is the page's.
 */
export function CanvasWriteBack() {
  const { agent } = useAgent();

  //#region toggle-item
  function toggleItem(id: string) {
    agent.setState({
      ...agent.state,
      items: (agent.state?.items ?? []).map((it) =>
        it.id === id ? { ...it, done: !it.done } : it,
      ),
    });
  }
  //#endregion

  const items = (agent.state?.items ?? []) as {
    id: string;
    label: string;
    done: boolean;
  }[];

  return (
    <div className="flex flex-wrap gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
      <span className="text-xs text-slate-500">Toggle from the main view:</span>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => toggleItem(item.id)}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
        >
          {item.done ? "☑" : "☐"} {item.label}
        </button>
      ))}
    </div>
  );
}
