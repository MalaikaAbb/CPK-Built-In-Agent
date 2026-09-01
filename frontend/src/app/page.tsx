import Link from "next/link";

import { IntelligenceStatus } from "@/components/intelligence-status";
import { RouteHeader } from "@/components/route-header";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";
import { DOCS_ROOT } from "@/lib/nav-config";
import { DocDriftPanel } from "@/components/doc-drift-panel";

/** Dynamic: the doc-sync readouts below read the snapshot off disk. */
export const dynamic = "force-dynamic";

const AGENTS: [string, string, string][] = [
  [
    "default",
    "model only",
    "Quickstart, Prebuilt Components, Slots, Headless UI, Display-only, Interactive, Frontend Tools, Agent Context, AgentRunner, Authentication",
  ],
  ["serverToolsAgent", "getWeather · maxSteps 2", "Server Tools"],
  [
    "renderingAgent",
    "get_weather · maxSteps 2",
    "Tool Rendering, Programmatic Control, Inspector, AG-UI, Runtime endpoints",
  ],
  [
    "advancedAgent",
    "prompt · sampling params · overridableProperties",
    "Advanced Configuration",
  ],
  ["sharedStateAgent", "maxSteps 5 · AG-UI state tools", "Shared State"],
  ["openAiAgent", "openai:… · OPENAI_API_KEY", "Model Selection — Agent A"],
  ["googleAgent", "google:… · GOOGLE_API_KEY", "Model Selection — Agent B"],
  [
    "anthropicAgent",
    "anthropic:… · ANTHROPIC_API_KEY",
    "Model Selection — Agent C",
  ],
  [
    "aiSdkAgent",
    "factory: streamText + openai('gpt-4o')",
    "Use any model router",
  ],
  [
    "tanStackAgent",
    "factory: chat + openaiText('gpt-4o')",
    "Use any model router",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/" />


      <DocDriftPanel />

      <Panel title="What this is">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A working test harness for CopilotKit&apos;s <strong>built-in
          agent</strong> — the agent that ships inside{" "}
          <code>@copilotkit/runtime/v2</code>, with no third-party agent
          framework anywhere in the stack. Each route implements one doc page
          against a real agent and shows the exact source that makes it work.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              [
                "Docs tracked",
                <a
                  key="d"
                  href={DOCS_ROOT}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  {DOCS_ROOT}
                </a>,
              ],
            ]}
          />
        </div>
      </Panel>

      <Panel
        title="Connection"
        description="Probed on the server during render, from /api/copilotkit/info — not from whether the env vars happen to be set."
      >
        <IntelligenceStatus />
      </Panel>

      <Panel
        title="The ten agents"
        description="One per doc page whose lesson is constructor configuration — tools, maxSteps, sampling params, factory mode. Those cannot share an instance without one page silently changing another page's behaviour."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Agent id</th>
                <th className="pb-2 pr-4 font-medium">Config that matters</th>
                <th className="pb-2 font-medium">Used by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {AGENTS.map(([id, config, used]) => (
                <tr key={id} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {id}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {config}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {used}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Agent ids are the keys of the record passed to{" "}
          <code>new CopilotRuntime({"{ agents }"})</code>. A component with no{" "}
          <code>agentId</code> resolves to <code>default</code>, which is the
          only agent the docs themselves register.
        </p>
      </Panel>

      <Panel title="Start here">
        <TryIt
          prompts={["What can you do?"]}
          expect={
            <>
              On{" "}
              <Link href="/quickstart" className="underline">
                /quickstart
              </Link>
              , a streamed reply rendered as markdown.
            </>
          }
          fail="An error banner — check that OPENAI_API_KEY is set and restart the dev server."
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The{" "}
          <Link
            href="/status"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            status overview
          </Link>{" "}
          lists every route in one table.
        </p>
      </Panel>
    </>
  );
}
