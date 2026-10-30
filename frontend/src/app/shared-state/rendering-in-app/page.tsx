import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/shared-state/rendering-in-app/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/rendering-in-app" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>agent.state</code> rendered in the main view rather than the
          chat. The Canvas calls <code>useAgent()</code>, seeds any missing
          fields once the agent is ready, and re-renders whenever the state
          changes — from the agent or from the page. The sidebar is just a second
          consumer of the same agent.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Rename the project to 'Spring release' and add an item 'Write launch post'.",
              "Mark the prototype item as done.",
            ]}
            expect="On load the canvas shows 'Project launch' with two items (the first struck through). After a prompt the canvas title and list change in place. In 'With write-back', clicking an item's button flips it immediately, and the agent sees the new value on its next turn. The default agent has maxSteps 1, so a state write may end the run without a text reply — the canvas changing is the pass signal."
            fail="The canvas stays on 'Untitled' with no items — useAgent never became ready. The agent replies that it changed the list but the canvas does not move — its state write never reached the client."
          />
        </div>
      </Panel>

      <Panel title="As published">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/components/Canvas.tsx` },
            { file: `${DIR}/app/app-page.tsx` },
          ]}
        />
      </Panel>

      <Panel
        title="Writing back from the main view"
        description="The page's toggleItem fragment, in repo-authored scaffolding that supplies agent and a button per item."
      >
        <SourceCode file={`${DIR}/components/CanvasWriteBack.tsx`} />
      </Panel>

      <Panel title="Harness wrapper">
        <SourceCode file={`${DIR}/page.tsx`} />
      </Panel>

      <Callout tone="warn" title="Deviations">
        <ul className="space-y-1.5">
          <li>
            · <code>app/page.tsx</code> lives at <code>demo-chat/app/app-page.tsx</code>{" "}
            so Next.js does not mount it as its own route; its{" "}
            <code>../components/Canvas</code> import resolves unchanged.
          </li>
          <li>
            · The page&apos;s <code>canvas</code> and <code>app-shell</code>{" "}
            classes have no CSS on the page; the wrapper adds minimal list
            styling so done items are visible.
          </li>
          <li>
            · No agent is named, so both views hit the runtime&apos;s{" "}
            <code>default</code> agent (the Quickstart agent). Its writes go
            through <code>BuiltInAgent</code>&apos;s own state tools; the page
            publishes no backend.
          </li>
        </ul>
      </Callout>
    </>
  );
}
