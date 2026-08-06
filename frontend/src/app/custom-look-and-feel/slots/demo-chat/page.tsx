"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The four levels of slot customisation from the Slots page, switchable.
 *
 * ⚠️ `CustomMessageView` below is the doc's sample verbatim, which means it does
 * not typecheck: its props are implicitly `any`, and a plain function is not
 * assignable to `SlotValue<typeof CopilotChatMessageView>` because the real slot
 * type also carries a `Cursor` static. It renders correctly. See the notes page.
 */

type Level = "classes" | "props" | "component" | "children";

const LEVELS: { id: Level; label: string; blurb: string }[] = [
  {
    id: "classes",
    label: "1 · Tailwind classes",
    blurb: "A class string merges with the slot's own classes. Nothing is replaced.",
  },
  {
    id: "props",
    label: "2 · Props override",
    blurb: "An object sets props on the default component — className, autoFocus, data-*.",
  },
  {
    id: "component",
    label: "3 · Custom component",
    blurb: "Your own component replaces the slot entirely.",
  },
  {
    id: "children",
    label: "4 · Children render fn",
    blurb: "You lay out the slots yourself; anything you leave out is not rendered.",
  },
];

const CustomMessageView = ({ messages, isRunning }) => (
  <div className="space-y-4 p-6">
    {messages?.map((msg) => (
      <div
        key={msg.id}
        className={msg.role === "user" ? "text-right" : "text-left"}
      >
        {msg.content}
      </div>
    ))}
    {isRunning && <div className="animate-pulse">Thinking...</div>}
  </div>
);

export default function Page() {
  const [level, setLevel] = useState<Level>("classes");
  const active = LEVELS.find((l) => l.id === level)!;

  return (
    <DemoFrame parentPath="/custom-look-and-feel/slots" subtitle={active.blurb}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                level === l.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          {level === "classes" && (
            <CopilotChat
              key="classes"
              messageView="bg-gray-50 dark:bg-gray-900 p-4"
              input="border-2 border-blue-400 rounded-xl"
              labels={{
                chatInputPlaceholder: "Ask your agent anything...",
                welcomeMessageText: "How can I help you today?",
                chatDisclaimerText: "AI responses may be inaccurate.",
              }}
            />
          )}

          {level === "props" && (
            <CopilotChat
              key="props"
              messageView={{
                className: "my-custom-messages",
                "data-testid": "message-view",
              }}
              input={{ autoFocus: true }}
              labels={{
                welcomeMessageText:
                  "Level 2 — the input took focus on mount, via a prop override.",
              }}
            />
          )}

          {level === "component" && (
            <CopilotChat
              key="component"
              messageView={CustomMessageView}
              labels={{
                welcomeMessageText:
                  "Level 3 — every message below is rendered by our own component.",
              }}
            />
          )}

          {level === "children" && (
            <CopilotChat key="children">
              {({ messageView, input, scrollView, suggestionView }) => (
                <div className="flex flex-col h-full">
                  <header className="p-4 border-b font-semibold">My Agent</header>
                  {scrollView}
                  <div className="border-t p-4">{input}</div>
                </div>
              )}
            </CopilotChat>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
