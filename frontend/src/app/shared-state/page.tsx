import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          One object both sides can write. The app reads it as{" "}
          <code>agent.state</code> and writes it with{" "}
          <code>agent.setState</code>; the agent receives it in its system prompt
          and writes it through two tools the built-in agent gives itself. Neither
          side has to tell the other — reads are reactive, so a write from the
          agent re-renders the list and a write from the UI shows up in the
          agent&apos;s next turn.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              ["Frontend reads", "agent.state.todos — reactive, no subscription needed"],
              ["Frontend writes", "agent.setState({ ...agent.state, … }) — spread, or you drop keys"],
              ["Agent writes", "AGUISendStateSnapshot (replace) · AGUISendStateDelta (JSON Patch)"],
              ["Agent reads", "The state object, injected into its system prompt"],
            ]}
          />
        </div>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Add a task to buy groceries",
              "Mark the plants task as done",
              "then press Dark Mode and ask: what theme am I using?",
            ]}
            expect="The todo list on the left grows and gains a strikethrough without the page reloading, and after pressing Dark Mode the agent answers 'dark' — it read what the button wrote."
            fail="The list never changes (the agent replied in prose instead of calling a state tool), or the agent calls the tool and then says nothing at all — maxSteps is back at 1."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent side"
        description="The doc page shows no backend code. This is the whole of it."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/agents.ts", region: "shared-state-agent" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="Two things the page leaves out">
        <p>
          <strong>State has to be non-empty before the agent can write it.</strong>{" "}
          The built-in agent only injects the state section into its system prompt
          — and only then hands itself{" "}
          <code>AGUISendStateSnapshot</code>/<code>AGUISendStateDelta</code> —
          when the run arrives with a state object that has at least one key. With
          the default <code>{"{}"}</code> the agent has no idea state exists. The
          demo seeds the shape in an effect on mount.
        </p>
        <p className="mt-2">
          <strong>
            <code>maxSteps</code> has to be above 1.
          </strong>{" "}
          It defaults to 1, and a state write costs a step. At the default the run
          ends on the tool call: the list updates but the agent never replies. This
          repo&apos;s shared-state agent uses <code>maxSteps: 5</code>, the value
          the Advanced Configuration page uses.
        </p>
      </Callout>

      <Callout tone="info" title="Shared state vs. agent context">
        Both put app data in front of the agent. Shared state is read-write and
        lives on the agent; <code>useAgentContext</code> — the next route — is
        read-only and re-sent per run. Use context for things the agent should
        know, state for things it should change.
      </Callout>
    </>
  );
}
