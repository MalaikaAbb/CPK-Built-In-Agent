"use client";

import {
  useAgent,
  useCopilotKit,
  useRenderToolCall,
} from "@copilotkit/react-core/v2";
import { randomUUID } from "@copilotkit/shared";
import type { AgentSubscriber } from "@ag-ui/client";
import { useEffect, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

function ThemeSelector() {
  const { agent } = useAgent({ agentId: "renderingAgent" });
  const state = agent.state as { user_theme?: string } | undefined;

  const updateTheme = (theme: string) => {
    agent.setState({
      ...agent.state,
      user_theme: theme,
    });
  };

  return (
    <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Toggle agent state
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => updateTheme("dark")}
          className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
            state?.user_theme === "dark"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
          }`}
        >
          Dark Mode
        </button>
        <button
          type="button"
          onClick={() => updateTheme("light")}
          className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
            state?.user_theme === "light"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
          }`}
        >
          Light Mode
        </button>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Current: <strong>{state?.user_theme || "default"}</strong>
        </p>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Writes straight into <code>agent.state</code> — watch the JSON above
        update. The value rides along with the next run. (You can check in inspector as well)
      </p>
    </div>
  );
}

/**
 * The Programmatic Control page's samples, running together on one screen:
 * the dashboard, the run trigger, the stop button, the event subscriber, and
 * the message list that renders tool calls.
 *
 * `agentId: "renderingAgent"` is the only addition — the page's own
 * `defineToolCallRenderer` targets `get_weather`, and that agent is the one
 * carrying it. The renderer itself is registered on the provider, exactly as the
 * page shows.
 *
 * The page's `EventLogger` writes to `console.log`. Here the same subscriber
 * pushes into React state as well, so the events are visible on the page rather
 * than only in devtools.
 */
export default function Page() {
  const { agent } = useAgent({ agentId: "renderingAgent" });
  const { copilotkit } = useCopilotKit();
  const renderToolCall = useRenderToolCall();
  const [events, setEvents] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("What's the weather in Tokyo?");

  useEffect(() => {
    const log = (line: string) =>
      setEvents((prev) => [`${new Date().toLocaleTimeString()}  ${line}`, ...prev].slice(0, 60));

    const subscriber: AgentSubscriber = {
      onCustomEvent: ({ event }) => {
        console.log("Custom event:", event.name, event.value);
        log(`onCustomEvent  ${event.name}`);
      },
      onRunStartedEvent: () => {
        console.log("Agent started running");
        log("onRunStartedEvent");
      },
      onRunFinalized: () => {
        console.log("Agent finished running");
        log("onRunFinalized");
      },
      onStateChanged: (state) => {
        console.log("State changed:", state);
        log("onStateChanged");
      },
    };

    const { unsubscribe } = agent.subscribe(subscriber);
    return () => unsubscribe();
  }, [agent]);

  const handleRun = async () => {
    agent.addMessage({
      id: randomUUID(),
      role: "user",
      content: prompt,
    });

    await copilotkit.runAgent({ agent });
  };

  const handleStop = () => {
    copilotkit.stopAgent({ agent });
  };

  return (
    <DemoFrame
      parentPath="/programmatic-control"
      subtitle="no chat component — useAgent + useCopilotKit only"
    >
      <div className="grid h-full grid-cols-1 overflow-y-auto lg:grid-cols-2">
        <div className="space-y-4 border-b border-slate-200 p-5 lg:border-b-0 lg:border-r dark:border-slate-800">
          {/* Status */}
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold">Agent Status</h2>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    agent.isRunning ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                  }`}
                />
                <span>{agent.isRunning ? "Running" : "Idle"}</span>
              </div>
              <div className="font-mono text-xs text-slate-500">
                Agent: {agent.agentId}
              </div>
              <div className="font-mono text-xs text-slate-500">
                Thread: {agent.threadId}
              </div>
              <div className="font-mono text-xs text-slate-500">
                Messages: {agent.messages.length}
              </div>
            </div>
          </div>

          {/* Trigger */}
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold">Run it</h2>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleRun}
                disabled={agent.isRunning}
                className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
              >
                Run Agent
              </button>
              <button
                type="button"
                onClick={handleStop}
                disabled={!agent.isRunning}
                className="rounded-md border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-600 disabled:opacity-40"
              >
                Stop
              </button>
            </div>
          </div>

          {/* State */}
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold">Agent State</h2>
            <pre className="mt-3 overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-200">
              {JSON.stringify(agent.state, null, 2)}
            </pre>
          </div>

          <ThemeSelector/>

          {/* Events */}
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold">Subscriber callbacks</h2>
            <ul className="mt-3 space-y-0.5 font-mono text-xs text-slate-600 dark:text-slate-400">
              {events.length === 0 && <li>nothing yet</li>}
              {events.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conversation + tool calls */}
        <div className="space-y-3 p-5">
          <h2 className="text-sm font-semibold">Conversation</h2>
          <div className="messages space-y-3">
            {agent.messages.map((message) => (
              <div key={message.id}>
                {message.content && (
                  <p
                    className={`rounded-lg p-3 text-sm ${
                      message.role === "user"
                        ? "ml-8 bg-blue-50 text-slate-900"
                        : "mr-8 bg-slate-100 text-slate-900"
                    }`}
                  >
                    {message.content}
                  </p>
                )}

                {message.role === "assistant" &&
                  message.toolCalls?.map((toolCall) => {
                    const toolMessage = agent.messages.find(
                      (m) => m.role === "tool" && m.toolCallId === toolCall.id,
                    );
                    return (
                      <div key={toolCall.id}>
                        {renderToolCall({ toolCall, toolMessage })}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
