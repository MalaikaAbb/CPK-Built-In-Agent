import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/shared-state/agent-readonly/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/agent-readonly" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Three UI values — a display name, a timezone, and a list of recent
          activity — published to the agent with one{" "}
          <code>useAgentContext</code> call each. The agent reads them on every
          turn and has no tool to change them: the channel only runs from the UI
          to the agent.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "What's my name and what time zone am I in?",
              "What have I been doing recently?",
              "Change my name to Sam.",
            ]}
            expect="The popup opens on load. The agent answers with 'Atai' and America/Los_Angeles, and lists the two checked activities. Edit the name or toggle an activity, ask again, and the answer follows the form. Asked to change a value, it says it cannot — the form does not change."
            fail="The agent says it does not know your name — the context entries never reached the run. Or a value changes in the form without you touching it — something other than useAgentContext is writing it."
          />
        </div>
      </Panel>

      <Panel title="The demo (from the page's Code tab)">
        <SourceCode file={`${DIR}/readonly-state-agent-context.tsx`} />
      </Panel>

      <Panel
        title="Repo-authored stand-in"
        description="demo-layout is imported by the Code tab but not published."
      >
        <SourceCodeGroup files={[{ file: `${DIR}/demo-layout.tsx` }, { file: `${DIR}/page.tsx` }]} />
      </Panel>

      <Callout tone="warn" title="Gaps between the page and what runs here">
        <ul className="space-y-1.5">
          <li>
            · <code>./demo-layout</code> (<code>DemoLayout</code> and{" "}
            <code>ACTIVITIES</code>) is unpublished. The stand-in is plain form
            controls and four placeholder activity strings; the feature — the
            three <code>useAgentContext</code> calls — is entirely the
            page&apos;s.
          </li>
          <li>
            · <code>./suggestions</code> is unpublished and commented out;
            suggestion chips are not part of this feature.
          </li>
          <li>
            · The page publishes no built-in-agent backend (its setup step is
            marked not bundled for this framework). The Code tab maps{" "}
            <code>readonly-state-agent-context</code> to the shared showcase{" "}
            <code>createBuiltInAgent()</code>, whose helper modules are
            unpublished; the id is registered on this repo&apos;s Quickstart
            agent, which receives context entries on every run without extra
            wiring. The page&apos;s prose credits a backend{" "}
            <code>CopilotKitMiddleware</code> with threading the context through
            — that is the LangGraph mechanism; nothing like it is needed here.
          </li>
        </ul>
      </Callout>
    </>
  );
}
