import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_ROUTE = `import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

const serviceAdapter = new ExperimentalEmptyAdapter();

const runtime = new CopilotRuntime({
  agents: {
    // your agents go here
  },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};`;

const DEFAULT_AGENT = `import { BuiltInAgent } from "@copilotkit/runtime/v2";

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({ model: "openai:gpt-4.1" }),
  },
});`;

const A2UI = `const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {}, // enables A2UI rendering for all agents
});

// Scoped to specific agents:
// a2ui: { agents: ["my-agent"] }`;

const MCP_APPS = `const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  mcpApps: {
    servers: [
      { type: "http", url: "http://localhost:3108/mcp" },
    ],
  },
});`;

const HEADERS = `const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  forwardHeaders: {
    deny: ["x-internal-debug"],
    denyPrefixes: ["x-acme-"],
  },
});

// Allowlist mode example:
// forwardHeaders: { allow: ["authorization", "x-tenant-id"] }`;

const DEV_ONLY = `import { HttpAgent } from "@ag-ui/client";
import { CopilotKit } from "@copilotkit/react-core/v2";

const myAgent = new HttpAgent({
  url: "https://my-agent.example.com",
});

<CopilotKit agents__unsafe_dev_only={{ "my-agent": myAgent }}>
  <YourApp />
</CopilotKit>;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/backend/copilot-runtime" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The runtime is a routing table plus a transport. It resolves an{" "}
          <code>agentId</code> to an agent instance, runs it, and encodes the
          agent&apos;s AG-UI events as Server-Sent Events for the browser. With the
          built-in agent there is nothing for it to connect <em>to</em> — the
          agents in the table live in this same process.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello  (then switch agent ids and come back)"]}
            expect="All ten ids stream a reply, and each keeps its own transcript — switching away and back does not merge conversations."
            fail="An id errors with an agent-not-found message: its key is missing from the record passed to new CopilotRuntime."
          />
        </div>
      </Panel>

      <Panel
        title="This repo's runtime"
        description="Read from disk — diff it against the samples below."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts" },
            { file: "frontend/src/copilotkit/agents.ts" },
          ]}
        />
      </Panel>

      <Panel title="The page's own samples">
        <div className="space-y-4">
          <CodeBlock
            code={DOC_ROUTE}
            filename="app/api/copilotkit/route.ts — the page's Next.js setup"
            language="ts"
          />
          <CodeBlock
            code={DEFAULT_AGENT}
            filename="Registering the built-in agent as default"
            language="ts"
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Two runtimes share the name CopilotRuntime">
        <p>
          The page&apos;s Next.js sample imports it from{" "}
          <code>@copilotkit/runtime</code> — the v1 runtime, which needs a{" "}
          <code>serviceAdapter</code> and is mounted with{" "}
          <code>copilotRuntimeNextJSAppRouterEndpoint</code>. The A2UI, MCP Apps,
          and <code>forwardHeaders</code> samples below, and the{" "}
          <code>runner</code> option on the AgentRunner page, belong to the{" "}
          <strong>v2</strong> runtime in <code>@copilotkit/runtime/v2</code>.
        </p>
        <p className="mt-2">
          This repo uses the v2 runtime and{" "}
          <code>createCopilotRuntimeHandler</code> throughout, which is why its
          route file has no <code>serviceAdapter</code> and lives on a catch-all
          segment.
        </p>
      </Callout>

      <Panel
        title="Options this repo does not set"
        description="Each belongs to a doc page outside this repo's scope, but they are configured on this same object."
      >
        <div className="space-y-4">
          <CodeBlock code={A2UI} filename="a2ui — agent-driven UI middleware" language="ts" />
          <CodeBlock code={MCP_APPS} filename="mcpApps — MCP servers at runtime level" language="ts" />
          <CodeBlock
            code={HEADERS}
            filename="forwardHeaders — which inbound headers reach the agent"
            language="ts"
          />
        </div>
      </Panel>

      <Panel
        title="Bypassing the runtime entirely"
        description="Development only. The agent URL and any credentials it needs end up in the browser bundle."
      >
        <CodeBlock code={DEV_ONLY} filename="agents__unsafe_dev_only" language="tsx" />
      </Panel>

      <Callout tone="info" title="forwardHeaders has a default denylist">
        Infrastructure headers — <code>x-forwarded-*</code>,{" "}
        <code>x-real-ip</code>, <code>x-vercel-*</code> — are stripped before the
        agent call, while <code>authorization</code> and custom{" "}
        <code>x-*</code> headers pass through. That default is what makes the
        Authentication route work without any header configuration at all.
      </Callout>
    </>
  );
}
