"use client";

import {
  CopilotChat,
  CopilotPopup,
  CopilotSidebar,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * All three prebuilt components, one at a time, each with the `labels` the doc
 * page gives it.
 *
 * They share the provider, so the conversation carries across tabs — which is
 * the useful thing to observe here: the component is chrome, not the session.
 */

type Which = "chat" | "sidebar" | "popup";

const TABS: { id: Which; label: string; blurb: string }[] = [
  { id: "chat", label: "CopilotChat", blurb: "Inline — fills whatever box you put it in." },
  { id: "sidebar", label: "CopilotSidebar", blurb: "Docked to the right edge, pushes content." },
  { id: "popup", label: "CopilotPopup", blurb: "Floating bubble, bottom right." },
];

export default function Page() {
  const [which, setWhich] = useState<Which>("chat");
  const active = TABS.find((t) => t.id === which)!;

  return (
    <DemoFrame parentPath="/prebuilt-components" subtitle={active.blurb}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setWhich(t.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                which === t.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          {which === "chat" && (
            <CopilotChat
              labels={{
                welcomeMessageText: "Hi! How can I assist you today?",
              }}
            />
          )}

          {which === "sidebar" && (
            <>
              <main className="flex h-full flex-col items-center justify-center p-8 text-center">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Your App
                </h1>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  The sidebar opens itself — <code>defaultOpen</code> is set.
                </p>
              </main>
              <CopilotSidebar
                defaultOpen={true}
                labels={{
                  modalHeaderTitle: "Sidebar Assistant",
                  welcomeMessageText: "How can I help you today?",
                }}
              />
            </>
          )}

          {which === "popup" && (
            <>
              <main className="flex h-full flex-col items-center justify-center p-8 text-center">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Your App
                </h1>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  The bubble is in the bottom-right corner.
                </p>
              </main>
              <CopilotPopup
                labels={{
                  modalHeaderTitle: "Popup Assistant",
                  welcomeMessageText: "Need any help?",
                }}
              />
            </>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
