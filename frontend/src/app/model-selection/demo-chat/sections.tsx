"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * One tab per provider, one chat per tab.
 *
 * Split out from the page because the page has to be a server component — it
 * reads `process.env` to report which keys are present — while `CopilotChat`
 * and the tab state need the client. Only booleans cross the boundary; no key
 * value is ever serialised into the payload.
 *
 * Switching tabs swaps `agentId` on the same `CopilotChat` instance rather than
 * remounting it, and each transcript survives: messages live on the agent in the
 * CopilotKit core, keyed by `agentId`, not in the component.
 *
 * No `key` prop, deliberately. Adding one forces a remount on every switch and
 * the transcript is thrown away — verified, not assumed.
 */

export interface ProviderSection {
  /** "A", "B", "C" — the label the route uses to talk about them. */
  letter: string;
  title: string;
  /** The agent id registered on the runtime. */
  agentId: string;
  /** The `provider:model` string that agent was constructed with. */
  model: string;
  envVar: string;
  /** Whether that env var is set on the server. Never the value. */
  configured: boolean;
}

export function ProviderSections({
  sections,
}: {
  sections: ProviderSection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.agentId);
  const active = sections.find((s) => s.agentId === activeId) ?? sections[0];

  return (
    <DemoFrame
      parentPath="/model-selection"
      subtitle={`${active.title} · ${active.model}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {sections.map((s) => (
            <button
              key={s.agentId}
              type="button"
              onClick={() => setActiveId(s.agentId)}
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                s.agentId === active.agentId
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  s.configured ? "bg-emerald-500" : "bg-amber-500"
                }`}
                aria-hidden
              />
              Agent {s.letter} · {s.title}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-200 px-4 py-2 font-mono text-xs text-slate-500 dark:border-slate-800">
          <span>model={active.model}</span>
          <span>agentId={active.agentId}</span>
          <span>{active.envVar}</span>
          <span
            className={
              active.configured
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }
          >
            {active.configured ? "key set" : "no key"}
          </span>
        </div>

        <div className="min-h-0 flex-1">
          {active.configured ? (
            <CopilotChat
              agentId={active.agentId}
              labels={{
                welcomeMessageText: `Agent ${active.letter} runs on ${active.model}. Ask it something, then switch tabs and ask the same thing.`,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <p className="max-w-sm text-sm text-slate-500">
                <code>{active.envVar}</code> is not set, so this agent would fail
                on its first run. Add it to <code>frontend/.env.local</code> and
                restart the dev server — Next reads env at startup.
              </p>
            </div>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
