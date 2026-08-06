import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const COMPARISON: [string, string, string][] = [
  ["Where the handler runs", "In the browser", "In the runtime process"],
  ["Declared with", "useFrontendTool (a hook, in a component)", "defineTool (passed to BuiltInAgent)"],
  ["Can touch", "React state, DOM, browser APIs", "Databases, secrets, internal services"],
  ["Reaches the agent via", "The AG-UI run input, per run", "The agent's own tools array"],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/frontend-tools" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A tool the agent calls whose body executes in the user&apos;s browser.
          The handler can reach React state and browser APIs, and its return value
          is what the model reads as the tool result — so the agent finds out what
          happened from the string you return.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Say hello to Damien"]}
            expect="A native browser alert reading 'Hello, Damien!'. Dismiss it and the agent confirms it said hello — it read the handler's return value."
            fail="The agent replies in text with no alert — the tool definition never reached the run."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/frontend-tools/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Frontend tools vs. server tools"
        description="Same agent, two places a tool body can live."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium" />
                <th className="pb-2 pr-4 font-medium">Frontend tool</th>
                <th className="pb-2 font-medium">Server tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COMPARISON.map(([label, fe, be]) => (
                <tr key={label} className="align-top">
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {label}
                  </td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                    {fe}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {be}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Callout tone="info" title="Nothing to register on the runtime side">
        The tool is defined in the component that owns it and nowhere else. The
        agent never has a permanent record of it — the definition is part of each
        run&apos;s input, which is why a tool registered on one page is invisible
        on another.
      </Callout>
    </>
  );
}
