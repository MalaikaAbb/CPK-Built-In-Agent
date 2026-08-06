import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DISABLE = `<CopilotKit
  publicLicenseKey={process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY}
  enableInspector={false}
>
  {children}
</CopilotKit>`;

const TABS: [string, string][] = [
  ["Events", "The AG-UI event stream, in order, as the run produces it."],
  ["Agents", "Every agent the runtime advertises over GET /info."],
  ["State", "The current shared state object for the selected agent."],
  ["Tools", "Frontend tool definitions and their parameter schemas."],
  ["Context", "Readables and document context contributed by useAgentContext."],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/inspector" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The debugging overlay that ships with the provider. It is on by default
          in development and off in production regardless of configuration, so
          there is nothing to add to a page to get it — the interesting
          configuration is how to turn it <em>off</em>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Tokyo?"]}
            expect="A CopilotKit button sits in the corner of the viewport. Opening it shows the run's AG-UI events in order, the ten agents this runtime registers, and get_weather under Tools."
            fail="No button at all — the provider is CopilotKitProvider rather than CopilotKit, which defaults the inspector off, or an inspector was mounted by hand and reports that core is not attached."
          />
        </div>
      </Panel>

      <Panel title="What each tab shows">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TABS.map(([tab, what]) => (
                <tr key={tab} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {tab}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {what}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Turning it off">
        <CodeBlock code={DISABLE} filename="layout.tsx" language="tsx" />
      </Panel>

      <Panel
        title="This repo's provider"
        description="No inspector prop is passed, so the default applies."
      >
        <SourceCode file="frontend/src/components/providers.tsx" />
      </Panel>
    </>
  );
}
