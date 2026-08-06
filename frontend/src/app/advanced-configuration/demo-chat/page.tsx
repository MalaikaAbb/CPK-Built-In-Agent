"use client";

import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { randomUUID } from "@copilotkit/shared";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Advanced Configuration page is entirely constructor config, so there is
 * nothing to click in a plain chat. What is observable is the other half of it:
 * `overridableProperties`.
 *
 * The agent is built with `overridableProperties: ["model", "temperature",
 * "prompt"]` and a support-desk system prompt. Sending a different `prompt`
 * through `forwardedProps` on `runAgent` replaces it for that one run — and
 * anything not on the whitelist is ignored, which the third preset shows.
 */

const PRESETS: { id: string; label: string; props: Record<string, unknown> }[] = [
  {
    id: "none",
    label: "No overrides",
    props: {},
  },
  {
    id: "prompt",
    label: "Override prompt (whitelisted)",
    props: {
      prompt:
        "You are a pirate quartermaster. Answer in one short sentence, in pirate dialect.",
    },
  },
  {
    id: "temperature",
    label: "Override temperature (whitelisted)",
    props: { temperature: 0.1 },
  },
  {
    id: "maxOutputTokens",
    label: "Override maxOutputTokens (NOT whitelisted)",
    props: { maxOutputTokens: 12 },
  },
];

export default function Page() {
  const { agent } = useAgent({ agentId: "advancedAgent" });
  const { copilotkit } = useCopilotKit();
  const [preset, setPreset] = useState(PRESETS[0]);
  const [input, setInput] = useState("Do you sell replacement widgets?");

  const run = async () => {
    agent.addMessage({ id: randomUUID(), role: "user", content: input });
    await copilotkit.runAgent({ agent, forwardedProps: preset.props });
  };

  return (
    <DemoFrame
      parentPath="/advanced-configuration"
      subtitle="advancedAgent · forwardedProps vs. overridableProperties"
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col">
        <div className="shrink-0 space-y-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                  preset.id === p.id
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <pre className="overflow-x-auto rounded bg-slate-950 p-2 text-xs text-slate-200">
            forwardedProps = {JSON.stringify(preset.props)}
          </pre>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            />
            <button
              type="button"
              onClick={run}
              disabled={agent.isRunning}
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Run
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {agent.messages.length === 0 && (
            <p className="text-sm text-slate-500">
              Pick a preset and press Run. The pirate prompt should visibly take
              effect; the 12-token cap should not.
            </p>
          )}
          {agent.messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg p-3 text-sm ${
                msg.role === "user"
                  ? "ml-8 bg-blue-50 text-slate-900"
                  : "mr-8 bg-slate-100 text-slate-900"
              }`}
            >
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                {msg.role}
              </p>
              <p>{typeof msg.content === "string" ? msg.content : ""}</p>
            </div>
          ))}
          {agent.isRunning && (
            <p className="text-sm text-slate-400">Thinking...</p>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
