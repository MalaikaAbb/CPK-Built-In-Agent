import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/headless-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The floor below slots: no CopilotKit component renders at all. Two
          hooks supply everything — <code>useAgent</code> for the message list
          and the running flag, <code>useCopilotKit</code> for the verbs. Sending
          a message is two calls, and they are separate on purpose:{" "}
          <code>agent.addMessage</code> appends locally,{" "}
          <code>copilotkit.runAgent</code> starts the run.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              ["Read", "agent.messages · agent.isRunning · agent.state"],
              ["Write", "agent.addMessage · agent.setState"],
              ["Control", "copilotkit.runAgent · copilotkit.stopAgent"],
            ]}
          />
        </div>
        <div className="mt-4">
          <TryIt
            prompts={["Write a long paragraph about otters"]}
            expect="Text streams into a hand-written bubble; a Stop button appears while it runs and halts it mid-sentence when clicked."
            fail="Nothing streams (the run never started — addMessage alone does not run the agent), or the transcript only updates when it finishes."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/custom-look-and-feel/headless-ui/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
