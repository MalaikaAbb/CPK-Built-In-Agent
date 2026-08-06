"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Every agent the runtime registers, addressable by id.
 *
 * Switching ids switches conversations: each agent keeps its own message list,
 * so this is the cheapest way to see that `agents: { … }` is a routing table and
 * `agentId` is the key into it. An id that is not in the table fails the run
 * rather than falling back to `default`.
 */

const AGENT_IDS = [
  "default",
  "serverToolsAgent",
  "renderingAgent",
  "advancedAgent",
  "sharedStateAgent",
  "openAiAgent",
  "googleAgent",
  "anthropicAgent",
  "aiSdkAgent",
  "tanStackAgent",
];

export default function Page() {
  const [agentId, setAgentId] = useState("default");

  return (
    <DemoFrame parentPath="/backend/copilot-runtime" subtitle={`agentId = ${agentId}`}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {AGENT_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setAgentId(id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                agentId === id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {id}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          <CopilotChat
            // Deliberately no `key`: remounting on a change of agent id throws
            // the transcript away, and the point of this switcher is that each
            // agent keeps its own.
            agentId={agentId}
            labels={{
              welcomeMessageText: `This is ${agentId}. Say hello, then switch ids and come back — the transcript is still here.`,
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
