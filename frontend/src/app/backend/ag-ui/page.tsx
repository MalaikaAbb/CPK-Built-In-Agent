import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, KeyValue, Panel, TryIt } from "@/components/ui";

const USE_AGENT = `import { useAgent } from "@copilotkit/react-core/v2";

function AgentStatus() {
  const { agent } = useAgent({ agentId: "research-agent" });
  // agent.messages  — conversation history
  // agent.state     — current shared state
  // agent.isRunning — whether the agent is running
}`;

const SUBSCRIBE = `import { useEffect } from "react";
import { useAgent } from "@copilotkit/react-core/v2";

function EventLog() {
  const { agent } = useAgent({ agentId: "research-agent" });

  useEffect(() => {
    const subscription = agent.subscribe({
      onTextMessageContentEvent({ textMessageBuffer }) {
        console.log("Streaming text:", textMessageBuffer);
      },
      onToolCallEndEvent({ toolCallName, toolCallArgs }) {
        console.log("Tool called:", toolCallName, toolCallArgs);
      },
      onStateChanged({ agent }) {
        console.log("State changed:", agent.state);
      },
    });
    return () => subscription.unsubscribe();
  }, [agent]);
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/backend/ag-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The protocol under everything else in this harness. AG-UI is an
          event-based standard carried over Server-Sent Events, and the objects the
          React hooks hand you are proxies over it: the client discovers agents
          through the runtime&apos;s <code>/info</code> endpoint, receives a proxy
          implementing the same <code>AbstractAgent</code> interface the server
          uses, and the runtime encodes each agent&apos;s events as SSE on the way
          back.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Which is why the built-in agent needs no adapter. It already emits AG-UI
          events, so it is reachable by the same client code that would reach a
          Python agent on another host.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              ["Run lifecycle", "RUN_STARTED · RUN_FINISHED · RUN_ERROR"],
              ["Text", "TEXT_MESSAGE_START · TEXT_MESSAGE_CONTENT · TEXT_MESSAGE_END · TEXT_MESSAGE_CHUNK"],
              ["Tools", "TOOL_CALL_START · TOOL_CALL_ARGS · TOOL_CALL_END · TOOL_CALL_RESULT"],
              ["State", "STATE_SNAPSHOT · STATE_DELTA"],
            ]}
          />
        </div>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "What's the weather in Tokyo?"]}
            expect="RUN_STARTED, a burst of TEXT_MESSAGE_CONTENT lines carrying the buffer as it grows, then RUN_FINISHED. The weather prompt adds a TOOL_CALL_END line with get_weather and its arguments."
            fail="No events at all while text appears in the chat — the subscription is bound to a different agent than the chat is driving."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/backend/ag-ui/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The page's samples">
        <div className="space-y-4">
          <CodeBlock code={USE_AGENT} filename="Reading an agent" language="tsx" />
          <CodeBlock code={SUBSCRIBE} filename="Subscribing to its events" language="tsx" />
        </div>
      </Panel>

      <Callout tone="warn" title="Subscriber callbacks are not uniformly shaped">
        Some flatten their payload into convenience fields —{" "}
        <code>{"{ textMessageBuffer }"}</code>,{" "}
        <code>{"{ toolCallName, toolCallArgs }"}</code>,{" "}
        <code>{"{ agent }"}</code> — while others hand back only{" "}
        <code>{"{ event }"}</code> and expect you to read the raw AG-UI event, as{" "}
        <code>onRunErrorEvent</code> does. Destructuring the wrong shape gives{" "}
        <code>undefined</code> rather than an error, so a callback that logs
        nothing is usually this rather than a missing event.
      </Callout>

      <Callout tone="info" title="Agents are cloned per run">
        The runtime clones the registered instance for each run, so two concurrent
        conversations against the same agent id do not share mutable state. That is
        also why an agent&apos;s constructor config is fixed at startup — a run
        cannot mutate the registered instance, only override whitelisted properties.
      </Callout>
    </>
  );
}
