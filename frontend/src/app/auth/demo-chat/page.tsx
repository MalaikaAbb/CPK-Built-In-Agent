"use client";

import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { AUTH_RUNTIME_URL, DEMO_TOKEN } from "@/copilotkit/auth-demo";

/**
 * The frontend half of the Authentication page: `headers` on the provider.
 *
 * A second, nested `<CopilotKit>` points at the gated endpoint rather than the
 * app-wide one, so the app keeps working while this page talks to a runtime that
 * rejects unauthenticated requests. Remounting on token change (`key`) is what
 * makes the failure observable — the client reads `/info` once on mount, and a
 * 401 there means no agents are discovered at all.
 *
 * `headers` also accepts a function, which is how you would refresh a token
 * without remounting.
 */

const TOKENS: { id: string; label: string; value: string | null }[] = [
  { id: "valid", label: "Valid token", value: DEMO_TOKEN },
  { id: "wrong", label: "Wrong token", value: "not-the-token" },
  { id: "none", label: "No header at all", value: null },
];

export default function Page() {
  const [choice, setChoice] = useState(TOKENS[0]);

  return (
    <DemoFrame parentPath="/auth" subtitle={`${AUTH_RUNTIME_URL} · ${choice.label}`}>
      <div className="flex h-full flex-col">
        <div className="shrink-0 space-y-2 border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {TOKENS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setChoice(t)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                  choice.id === t.id
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-slate-500">
            {choice.value
              ? `Authorization: Bearer ${choice.value}`
              : "(no Authorization header sent)"}
          </p>
        </div>

        <div className="min-h-0 flex-1">
          <CopilotKit
            key={choice.id}
            runtimeUrl={AUTH_RUNTIME_URL}
            // Same reason as the app-wide provider: the gated runtime is also
            // multi-route, and the default would POST to its bare path.
            useSingleEndpoint={false}
            {...(choice.value
              ? { headers: { Authorization: `Bearer ${choice.value}` } }
              : {})}
          >
            <CopilotChat
              labels={{
                welcomeMessageText:
                  "With a valid token this streams normally. With either of the other two, sending fails.",
              }}
            />
          </CopilotKit>
        </div>
      </div>
    </DemoFrame>
  );
}
