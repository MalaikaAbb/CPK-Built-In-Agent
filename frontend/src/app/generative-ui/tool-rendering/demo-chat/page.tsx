"use client";

import {
  CopilotChat,
  useDefaultRenderTool,
  useRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Both samples from the Tool Rendering page: a renderer bound to one tool by
 * name, and a wildcard that catches every tool without one.
 *
 * `get_weather` is a *server* tool here — it executes inside the runtime, and
 * the browser only decides how the call looks. That is the difference between
 * this page and the Frontend Tools route, where the browser also does the work.
 *
 * `agentId="renderingAgent"` is the agent carrying `get_weather`.
 */

const weatherParams = z.object({
  location: z.string().describe("The location to get weather for"),
});

const YourMainContent = () => {
  useRenderTool({
    name: "get_weather",
    parameters: weatherParams,
    render: ({ status, parameters }) => {
      return (
        <p className="text-gray-500 mt-2">
          {status !== "complete" && "Calling weather API..."}
          {status === "complete" &&
            `Called the weather API for ${parameters.location}.`}
        </p>
      );
    },
  });

  useDefaultRenderTool({
    render: ({ name, args, status, result }) => {
      return (
        <div style={{ color: "black" }}>
          <span>
            {status === "complete" ? "✓" : "⏳"}
            {name}
          </span>
          {status === "complete" && result && (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      );
    },
  });

  return (
    <CopilotChat
      agentId="renderingAgent"
      labels={{
        welcomeMessageText:
          "Ask for the weather somewhere — the named renderer handles get_weather.",
      }}
    />
  );
};

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/tool-rendering"
      subtitle="useRenderTool (get_weather) + useDefaultRenderTool (everything else)"
    >
      <YourMainContent />
    </DemoFrame>
  );
}
