"use client";

import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import PublishedPage from "./app/app-page";
import { Canvas } from "./components/Canvas";
import { CanvasWriteBack } from "./components/CanvasWriteBack";

/**
 * Two views of the same pattern.
 *
 * - "As published" mounts the page's `app/page.tsx` unchanged.
 * - "With write-back" is the same composition (harness copy) with the page's
 *   `toggleItem` fragment wired to buttons, inside the same provider so it
 *   writes to the same agent the Canvas and the sidebar read.
 *
 * Both talk to the runtime's `default` agent, as the page's Canvas does.
 */
type View = "published" | "write-back";

export default function Page() {
  const [view, setView] = useState<View>("published");

  return (
    <DemoFrame
      parentPath="/shared-state/rendering-in-app"
      subtitle="useAgent · agent.state in a canvas"
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 gap-2 border-b border-slate-200 p-2 dark:border-slate-800">
          {(["published", "write-back"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-md border px-3 py-1 text-xs font-medium ${
                view === v
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {v === "published" ? "As published" : "With write-back"}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-6 [&_.canvas_h1]:text-xl [&_.canvas_h1]:font-semibold [&_.canvas_li[data-done=true]]:line-through [&_.canvas_ul]:mt-3 [&_.canvas_ul]:list-disc [&_.canvas_ul]:pl-6">
          {view === "published" ? (
            <PublishedPage />
          ) : (
            <CopilotKit runtimeUrl="/api/copilotkit">
              <div className="app-shell">
                <Canvas />
                <CanvasWriteBack />
                <CopilotSidebar />
              </div>
            </CopilotKit>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
