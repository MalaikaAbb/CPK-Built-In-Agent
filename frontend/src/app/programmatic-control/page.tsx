import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/programmatic-control" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent as an object you hold rather than a chat you embed. The same{" "}
          <code>useAgent</code> handle exposes the thread id, the message list,
          the running flag, and the state; <code>useCopilotKit</code> starts and
          stops runs; <code>agent.subscribe</code> reports lifecycle events; and{" "}
          <code>useRenderToolCall</code> renders a tool call inside your own
          message list instead of CopilotKit&apos;s.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              ["Read", "agent.agentId · agent.threadId · agent.messages · agent.isRunning · agent.state"],
              ["Write", "agent.addMessage · agent.setState"],
              ["Run", "copilotkit.runAgent · copilotkit.stopAgent"],
              ["Observe", "agent.subscribe(subscriber)"],
              ["Render", "useRenderToolCall · defineToolCallRenderer"],
            ]}
          />
        </div>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Tokyo?  (pre-filled — press Run Agent)"]}
            expect="Status flips to Running, the subscriber list fills with onRunStartedEvent → onRunFinalized, a weather card renders inside the conversation column, and Stop halts a run mid-flight."
            fail="Nothing happens on Run (the message was appended but no run started), or the tool call renders as raw JSON instead of a card — the renderer's name no longer matches the tool."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/programmatic-control/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The tool-call renderer, and where it is registered"
        description="defineToolCallRenderer produces the renderer; the provider is what makes it apply."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/components/weather-tool.tsx", region: "renderer" },
            { file: "frontend/src/components/providers.tsx" },
          ]}
        />
      </Panel>

      {/* <Callout tone="warn" title="Two things the samples leave open">
        <p>
          <strong>
            <code>defineToolCallRenderer</code> needs an <code>args</code> schema.
          </strong>{" "}
          The page calls it with only <code>name</code> and <code>render</code>.
          The shipped function has two overloads — a wildcard, where{" "}
          <code>name</code> must be the literal <code>&quot;*&quot;</code>, and a
          named one that requires <code>args</code> — so the sample matches
          neither and does not compile. Without the schema{" "}
          <code>args</code> is <code>unknown</code> and{" "}
          <code>args.location</code> is unusable. This repo passes the{" "}
          <code>get_weather</code> tool&apos;s own schema.
        </p>
        <p className="mt-2">
          <strong>The event log is console-only in the doc.</strong>{" "}
          <code>EventLogger</code> returns <code>null</code> and logs to the
          console. The subscriber here is the doc&apos;s, with a second line per
          callback that also pushes to React state, because a QA harness needs the
          events on screen.
        </p>
      </Callout>

      <Callout tone="warn" title="Two samples kept as published, and not compiling">
        <p>
          <strong>
            <code>{"{msg.content}"}</code> in the dashboard.
          </strong>{" "}
          A message&apos;s <code>content</code> is a union — string, a record, or
          an array of typed content parts — and only the string branch is a valid
          React child. The page renders it unconditionally.
        </p>
        <p className="mt-2">
          <strong>The tool-message lookup in <code>MessageList</code>.</strong>{" "}
          <code>{"agent.messages.find((m) => m.role === \"tool\" && …)"}</code>{" "}
          returns the full message union rather than the tool variant —{" "}
          the predicate is not a type guard — so it is not assignable to{" "}
          <code>renderToolCall</code>&apos;s <code>toolMessage</code> parameter.
          Both are compile-time only; the demo renders correctly.
        </p>
      </Callout> */}
    </>
  );
}
