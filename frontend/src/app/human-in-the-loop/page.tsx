import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The tool-based HITL pattern. The page registers <code>book_call</code>{" "}
          with <code>useHumanInTheLoop</code>; when the model decides to call it,
          the run stops on a time-picker card rendered in the chat. Whatever the
          user picks — a slot, or &ldquo;None of these work&rdquo; — goes back to
          the model as the tool result and the agent carries on from there.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Please book an intro call with the sales team to discuss pricing.",
              "Schedule a 1:1 with Alice next week to review Q2 goals.",
            ]}
            expect="A 'Book a call' card with the topic, the attendee, and four slot buttons. The chat waits. Click a slot: the card turns into 'Booked for …' and the agent replies confirming that time. Click 'None of these work': the card shows 'Cancelled' and the agent acknowledges it."
            fail="The agent answers in prose without a card — book_call never reached the model. Or the card renders but its buttons stay disabled — the tool call never entered the executing state."
          />
        </div>
      </Panel>

      <Panel title="The demo (from the page's Code tab)">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/human-in-the-loop/demo-chat/hitl-in-chat.tsx" },
            { file: "frontend/src/app/human-in-the-loop/demo-chat/time-picker-card.tsx" },
          ]}
        />
      </Panel>

      <Panel title="Harness wrapper">
        <SourceCode file="frontend/src/app/human-in-the-loop/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="info" title="Backend: a plain config-mode BuiltInAgent">
        The page publishes no backend for the built-in agent. Its Code tab maps{" "}
        <code>hitl-in-chat</code> to <code>createBuiltInAgent()</code>, a shared
        showcase factory whose imports (<code>server-tools</code>,{" "}
        <code>state-tools</code>, <code>demo-stream</code>,{" "}
        <code>header-forwarding</code>) are not published — and none of which
        this feature needs. The id is registered on this repo&apos;s Quickstart
        agent instead: a config-mode <code>BuiltInAgent</code> forwards the
        page&apos;s frontend tools to the model on its own.
      </Callout>

      <Callout tone="warn" title="Pattern 2 (useInterrupt) is not built">
        The page&apos;s second pattern is a graph-enforced pause — a server-side{" "}
        <code>interrupt()</code> call in a LangGraph node — and its embedded{" "}
        <code>gen-ui-interrupt</code> demo is not bundled for the built-in agent.
        <code> BuiltInAgent</code> has no interrupt primitive, so there is nothing
        here to wire it to.
      </Callout>
    </>
  );
}
