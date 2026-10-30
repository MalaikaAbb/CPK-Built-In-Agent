"use client";

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { useMemo, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { MODEL_TABLE } from "@/copilotkit/model";

/**
 * A dropdown of every specifier in the page's tables, one agent, one chat.
 *
 * The chosen specifier goes out as `properties={{ model }}` on a provider of
 * this demo's own. CopilotKit merges provider properties into every run's
 * `forwardedProps`, and `modelSelectionAgent` lists `model` in
 * `overridableProperties`, so the next message runs on the new model. The
 * transcript is one conversation; switching mid-thread hands the earlier
 * replies to the newly chosen model as history.
 *
 * Its own provider rather than the root one, so the `model` property never
 * reaches another route's runs (Advanced Configuration's agent also accepts a
 * `model` override). Listed in `lib/inspector.ts`.
 */

const AGENT_ID = "modelSelectionAgent";
const DEFAULT_SPECIFIER = "openai:gpt-5.4-mini";

export function ModelPicker({
  configured,
}: {
  /** env var name → whether it is set on the server. Never the value. */
  configured: Record<string, boolean>;
}) {
  const [specifier, setSpecifier] = useState(DEFAULT_SPECIFIER);
  const group =
    MODEL_TABLE.find(({ models }) => models.some(([, s]) => s === specifier)) ??
    MODEL_TABLE[0];
  const label = group.models.find(([, s]) => s === specifier)?.[0] ?? specifier;
  const keySet = configured[group.envVar];
  const properties = useMemo(() => ({ model: specifier }), [specifier]);

  return (
    <DemoFrame parentPath="/model-selection" subtitle={`${label} · ${specifier}`}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 p-3 dark:border-slate-800">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Model
            <select
              value={specifier}
              onChange={(e) => setSpecifier(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 font-mono text-xs dark:border-slate-600 dark:bg-slate-900"
            >
              {MODEL_TABLE.map(({ provider, envVar, models }) => (
                <optgroup
                  key={provider}
                  label={`${provider}${configured[envVar] ? "" : ` — ${envVar} not set`}`}
                >
                  {models.map(([name, s]) => (
                    <option key={s} value={s}>
                      {name} · {s}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-slate-500">
            <span>agentId={AGENT_ID}</span>
            <span>forwardedProps.model={specifier}</span>
            <span
              className={
                keySet
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }
            >
              {group.envVar} {keySet ? "set" : "not set"}
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <CopilotKitProvider runtimeUrl="/api/copilotkit" properties={properties}>
            {keySet ? (
              <CopilotChat
                agentId={AGENT_ID}
                labels={{
                  welcomeMessageText:
                    "One agent; the dropdown picks the model for each message. Ask something, switch models, ask again.",
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <p className="max-w-sm text-sm text-slate-500">
                  <code>{group.envVar}</code> is not set, so a run on{" "}
                  <code>{specifier}</code> would fail. Add it to{" "}
                  <code>frontend/.env.local</code> and restart the dev server.
                </p>
              </div>
            )}
          </CopilotKitProvider>
        </div>
      </div>
    </DemoFrame>
  );
}
