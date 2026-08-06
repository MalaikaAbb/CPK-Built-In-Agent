"use client";

import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";
import { useEffect } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Shared State page's three samples on one screen: a list read out of
 * `agent.state`, a panel that writes to it, and the chat that lets the agent
 * write to it too.
 *
 * The one thing the page does not mention is the seeding effect below. The
 * built-in agent only offers itself the state tools when the run arrives with a
 * non-empty state object — an empty `{}` produces no state section in its system
 * prompt and no way to write one. Seeding the shape is what turns the feature on.
 */

interface Todo {
  text: string;
  done: boolean;
}

export default function Page() {
  const { agent } = useAgent({ agentId: "sharedStateAgent" });

  useEffect(() => {
    if (Object.keys(agent.state ?? {}).length > 0) return;
    agent.setState({
      todos: [{ text: "Water the plants", done: false }] as Todo[],
      userPreferences: { theme: "light" },
    });
  }, [agent]);

  // Read state set by the agent
  const todos = (agent.state.todos as Todo[]) ?? [];
  const theme = (agent.state.userPreferences as { theme?: string })?.theme;

  const handleThemeChange = (theme: string) => {
    agent.setState({
      ...agent.state,
      userPreferences: { theme },
    });
  };

  return (
    <DemoFrame parentPath="/shared-state" subtitle="agent.state read + written from both sides">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="space-y-5 overflow-y-auto border-b border-slate-200 p-5 lg:border-b-0 lg:border-r dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold">My Todos</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {todos.length === 0 && (
                <li className="text-slate-500">Nothing yet.</li>
              )}
              {todos.map((todo, i) => (
                <li
                  key={i}
                  style={{ textDecoration: todo.done ? "line-through" : "none" }}
                >
                  {todo.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Settings</h2>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
              >
                Dark Mode
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
              >
                Light Mode
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Current: {theme ?? "default"}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Raw state</h2>
            <pre className="mt-2 overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-200">
              {JSON.stringify(agent.state, null, 2)}
            </pre>
          </div>
        </div>

        <div className="min-h-0">
          <CopilotChat
            agentId="sharedStateAgent"
            labels={{
              welcomeMessageText:
                "I can help manage your todos. Try 'Add a task to buy groceries'.",
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
