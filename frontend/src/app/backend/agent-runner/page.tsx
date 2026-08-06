import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const ABSTRACT = `import type { Observable } from "rxjs";
import type { BaseEvent } from "@ag-ui/client";

abstract class AgentRunner {
  abstract run(request: AgentRunnerRunRequest): Observable<BaseEvent>;
  abstract connect(request: AgentRunnerConnectRequest): Observable<BaseEvent>;
  abstract isRunning(request: AgentRunnerIsRunningRequest): Promise<boolean>;
  abstract stop(request: AgentRunnerStopRequest): Promise<boolean | undefined>;
}`;

const CONFIG = `import { CopilotRuntime, BuiltInAgent, InMemoryAgentRunner } from "@copilotkit/runtime/v2";

const runtime = new CopilotRuntime({
  agents: { default: new BuiltInAgent({ model: "openai/gpt-4o-mini" }) },
  runner: new InMemoryAgentRunner(),
});`;

const RUNNERS: [string, string, string][] = [
  [
    "InMemoryAgentRunner",
    "@copilotkit/runtime/v2",
    "The v2 default. Thread runs live in process memory.",
  ],
  [
    "IntelligenceAgentRunner",
    "@copilotkit/runtime/v2",
    "Durable threads via the Enterprise Intelligence Platform.",
  ],
  [
    "TelemetryAgentRunner",
    "@copilotkit/runtime",
    "Legacy wrapper preserving v1 telemetry behaviour.",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/backend/agent-runner" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The layer between the HTTP endpoint and the agent. The runner owns the
          run: it starts one, lets a client re-attach to one already in flight,
          reports whether a thread is busy, and stops it. Four methods, and where
          you put persistence — because the default keeps everything in process
          memory, one runner instance applies to every agent on the runtime, and
          nothing survives a restart.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "then another message"]}
            expect="Each message adds a run line to the log on the left, all sharing one thread id — proof that the subclass on this repo's runtime is on the path of every run."
            fail="The log stays empty while the chat works: the runtime is using the default runner rather than MyRunner."
          />
        </div>
      </Panel>

      <Panel
        title="This repo's runner, and where it is installed"
        description="The page's subclass, with its two comments intact, plus the runtime that takes it."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/runner.ts", region: "my-runner" },
            { file: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts" },
          ]}
        />
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/backend/agent-runner/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The abstraction, and the runners that ship">
        <CodeBlock code={ABSTRACT} filename="The four methods" language="ts" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[38rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Runner</th>
                <th className="pb-2 pr-4 font-medium">Import</th>
                <th className="pb-2 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {RUNNERS.map(([name, from, what]) => (
                <tr key={name} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {name}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {from}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <CodeBlock code={CONFIG} filename="Setting it explicitly" language="ts" />
        </div>
      </Panel>

      <Callout tone="warn" title="The in-memory default is a deployment decision">
        History dies with the process and is not shared between instances, so two
        replicas behind a load balancer cannot re-attach to each other&apos;s runs.
        Horizontal scaling means either the Intelligence runner or a subclass that
        writes through to a store — which is what the two comments in{" "}
        <code>MyRunner</code> mark the spot for.
      </Callout>

      <Callout tone="info" title="The call log is this repo's, not the doc's">
        The page&apos;s <code>MyRunner</code> body is two comments. Counters were
        added around them so the override has something observable; nothing else
        about the subclass changed. The log itself is module-scoped server state —
        it vanishes on restart, which is the page&apos;s own warning demonstrating
        itself.
      </Callout>
    </>
  );
}
