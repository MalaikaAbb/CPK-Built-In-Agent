"use client";

import { CopilotChat, useDefaultRenderTool } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * A chat against the agent that carries `getWeather`.
 *
 * There is nothing else to write on this page — that is the point of a server
 * tool. The tool is declared with `defineTool` and passed to the agent's
 * constructor, so the browser has no part in it beyond triggering the run.
 *
 * The wildcard renderer is here only so the call is visible; without it the tool
 * runs invisibly and only its effect on the reply shows.
 */
export default function Page() {
  useDefaultRenderTool({
    render: ({ name, status, result }) => (
      <div className="my-2 rounded-md border border-slate-300 p-2 font-mono text-xs dark:border-slate-700">
        <span>
          {status === "complete" ? "✓" : "⏳"} {name}
        </span>
        {status === "complete" && result && (
          <pre className="mt-1 overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    ),
  });

  return (
    <DemoFrame parentPath="/server-tools" subtitle="defineTool · getWeather · maxSteps 2">
      <CopilotChat
        agentId="serverToolsAgent"
        labels={{
          welcomeMessageText:
            "Try: what's the weather in Lisbon? The tool result appears before the reply.",
        }}
      />
    </DemoFrame>
  );
}
