"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Both live factory modes, one tab each.
 *
 * From the browser they are indistinguishable from each other and from any
 * classic-mode agent, and that is the result worth checking: one factory calls
 * `streamText` and returns a `fullStream`, the other calls TanStack's `chat()`
 * and returns an async iterable, and both come out of the runtime as the same
 * AG-UI event stream. Every client feature — streaming, frontend tools, the
 * Inspector — keeps working across both.
 *
 * Two things are missing from both by construction: no `tools` array and no
 * state tools, because in factory mode the built-in agent stops building the
 * prompt and stops managing tools. Anything like that is now the factory's job.
 *
 * Switching tabs swaps `agentId` on the same `CopilotChat` instance, so each
 * transcript survives: messages live on the agent in the CopilotKit core, keyed
 * by `agentId`. A `key` prop here would remount the chat and discard it.
 */

const MODES: {
  agentId: string;
  title: string;
  type: string;
  blurb: string;
}[] = [
  {
    agentId: "aiSdkAgent",
    title: "AI SDK",
    type: 'type: "aisdk"',
    blurb: "streamText() + openai('gpt-4o') — the factory returns a fullStream.",
  },
  {
    agentId: "tanStackAgent",
    title: "TanStack AI",
    type: 'type: "tanstack"',
    blurb: "chat() + openaiText('gpt-4o') — the factory returns an async iterable.",
  },
];

export default function Page() {
  const [activeId, setActiveId] = useState(MODES[0].agentId);
  const active = MODES.find((m) => m.agentId === activeId) ?? MODES[0];

  return (
    <DemoFrame parentPath="/backend/custom-agent" subtitle={active.blurb}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {MODES.map((mode) => (
            <button
              key={mode.agentId}
              type="button"
              onClick={() => setActiveId(mode.agentId)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                mode.agentId === active.agentId
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {mode.title}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-200 px-4 py-2 font-mono text-xs text-slate-500 dark:border-slate-800">
          <span>{active.type}</span>
          <span>agentId={active.agentId}</span>
        </div>

        <div className="min-h-0 flex-1">
          <CopilotChat
            agentId={active.agentId}
            labels={{
              welcomeMessageText: `This reply comes from our own ${active.title} call. Try: write two sentences about tide pools, then switch tabs and ask the same thing.`,
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
