import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_ROUTE = `import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { NextRequest } from "next/server";

const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
});

const runtime = new CopilotRuntime({
  agents: { default: builtInAgent },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The shortest path to a working agent. There is no agent process and no
          agent framework: <code>BuiltInAgent</code> is constructed with a model
          id, registered on the runtime under the key <code>default</code>, and
          driven by a <code>CopilotSidebar</code>. Four files, one port.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What can you do?", "What do you think about React?"]}
            expect="Tokens stream in a word at a time and the reply renders as markdown."
            fail="An error banner — check that OPENAI_API_KEY is set and that the dev server was restarted after setting it."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The files that make it work"
        description="Read from this repo at render time, so they can be diffed against the doc's samples directly."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts" },
            { file: "frontend/src/copilotkit/agents.ts", region: "default-agent" },
            { file: "frontend/src/components/providers.tsx" },
          ]}
        />
      </Panel>

      <Panel
        title="The doc's runtime route, verbatim"
        description="For comparison against the file above."
      >
        <CodeBlock
          code={DOC_ROUTE}
          filename="app/api/copilotkit/route.ts — as published"
          language="ts"
        />
      </Panel>
    </>
  );
}
