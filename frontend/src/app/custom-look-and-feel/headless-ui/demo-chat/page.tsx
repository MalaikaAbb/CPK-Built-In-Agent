"use client";

import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { randomUUID } from "@copilotkit/shared";
import { useCallback, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * A chat built entirely from the headless hooks — the Fully headless UI page's
 * four samples assembled into the one component they describe.
 *
 * Nothing from CopilotKit renders here. `useAgent` supplies the message list and
 * the running flag, `useCopilotKit` supplies the verbs (`runAgent`,
 * `stopAgent`), and every element on screen is written out below.
 */
export default function Page() {
  const { agent } = useAgent();
  const { copilotkit } = useCopilotKit();
  const [input, setInput] = useState("");

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    agent.addMessage({
      id: randomUUID(),
      role: "user",
      content: input,
    });

    setInput("");

    await copilotkit.runAgent({ agent });
  }, [input, agent, copilotkit]);

  const stopAgent = useCallback(() => {
    copilotkit.stopAgent({ agent });
  }, [agent, copilotkit]);

  return (
    <DemoFrame
      parentPath="/custom-look-and-feel/headless-ui"
      subtitle="hand-built chat over useAgent + useCopilotKit"
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {agent.messages.length === 0 && (
            <p className="text-sm text-slate-500">
              No messages yet. Try &ldquo;Tell me a joke&rdquo;.
            </p>
          )}

          {agent.messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "user"
                  ? "ml-auto bg-blue-100 rounded-lg p-3 max-w-md text-slate-900"
                  : "bg-gray-100 rounded-lg p-3 max-w-md text-slate-900"
              }
            >
              <p className="text-sm font-medium">{msg.role}</p>
              <p>{msg.content}</p>
            </div>
          ))}

          {agent.isRunning && <div className="text-gray-400">Thinking...</div>}
        </div>

        <form
          className="border-t p-4 flex gap-2 dark:border-slate-800"
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <button
            type="submit"
            disabled={agent.isRunning}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Send
          </button>
          {agent.isRunning && (
            <button type="button" onClick={stopAgent} className="text-red-500">
              Stop
            </button>
          )}
        </form>
      </div>
    </DemoFrame>
  );
}
