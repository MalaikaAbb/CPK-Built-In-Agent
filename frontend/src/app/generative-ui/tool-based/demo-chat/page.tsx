"use client";

import {
  CopilotChat,
  CopilotKit,
  useComponent,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import { BarChart, barChartPropsSchema } from "./bar-chart";
import ControlledGenUiDemo from "./gen-ui-tool-based";

/**
 * Two backends for the same `useComponent` registration.
 *
 * - **Config mode** is the page's demo (`gen-ui-tool-based.tsx`, from its Code
 *   tab) against the config-mode agent and prompt the page prints.
 * - **Factory mode** is harness-authored wiring: the same `render_bar_chart`
 *   registration pointed at the page's AI SDK factory sample, which forwards
 *   `input.tools` itself but carries no system prompt.
 */

type Mode = "config" | "factory";

// Harness-authored: the page shows the factory only as a backend file, with no
// page of its own. This mirrors the demo's Chat with the agent id swapped.
function FactoryChat() {
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
  });

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="h-full w-full max-w-4xl">
        <CopilotChat
          agentId="gen-ui-tool-based-factory"
          className="h-full rounded-2xl"
        />
      </div>
    </div>
  );
}

export default function Page() {
  const [mode, setMode] = useState<Mode>("config");

  return (
    <DemoFrame
      parentPath="/generative-ui/tool-based"
      subtitle={`useComponent · render_bar_chart · ${mode} mode`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 gap-2 border-b border-slate-200 p-2 dark:border-slate-800">
          {(["config", "factory"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md border px-3 py-1 text-xs font-medium ${
                mode === m
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {m === "config" ? "Config mode (page demo)" : "Factory mode"}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 [&_.h-screen]:h-full">
          {mode === "config" ? (
            <ControlledGenUiDemo />
          ) : (
            <CopilotKit
              runtimeUrl="/api/copilotkit"
              agent="gen-ui-tool-based-factory"
            >
              <FactoryChat />
            </CopilotKit>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
