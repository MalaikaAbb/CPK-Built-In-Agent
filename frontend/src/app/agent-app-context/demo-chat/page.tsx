"use client";

import { CopilotChat, useAgentContext } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Agent Context page's `Dashboard`, unchanged, beside a chat.
 *
 * Two separate `useAgentContext` calls rather than one combined object: each has
 * its own description, and the description is what the agent actually reads —
 * it is prepended to the value in the system prompt. Nothing here is a tool, so
 * the agent cannot change any of it.
 */
export function Dashboard() {
  const [user] = useState({
    name: "Jane Smith",
    role: "Engineering Manager",
    team: "Platform",
  });

  const [projects] = useState([
    { id: 1, name: "Auth Redesign", status: "in-progress" },
    { id: 2, name: "API v2", status: "planning" },
  ]);

  // Share user info with the agent
  useAgentContext({
    description: "The currently logged-in user",
    value: user,
  });

  // Share project data with the agent
  useAgentContext({
    description: "The user's active projects",
    value: projects,
  });

  return (
    <div className="space-y-5 p-5 text-sm">
      <div>
        <h2 className="text-sm font-semibold">Logged-in user</h2>
        <dl className="mt-2 space-y-0.5 text-slate-600 dark:text-slate-400">
          <div>{user.name}</div>
          <div>{user.role}</div>
          <div>{user.team}</div>
        </dl>
      </div>

      <div>
        <h2 className="text-sm font-semibold">Active projects</h2>
        <ul className="mt-2 space-y-0.5 text-slate-600 dark:text-slate-400">
          {projects.map((p) => (
            <li key={p.id}>
              {p.name} — {p.status}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-slate-500">
        Neither block is a tool. The agent can read them and nothing else.
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <DemoFrame parentPath="/agent-app-context" subtitle="useAgentContext · user + projects">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="overflow-y-auto border-b border-slate-200 lg:border-b-0 lg:border-r dark:border-slate-800">
          <Dashboard />
        </div>
        <div className="min-h-0">
          <CopilotChat
            labels={{
              welcomeMessageText:
                "Try: who am I, and what am I working on?",
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
