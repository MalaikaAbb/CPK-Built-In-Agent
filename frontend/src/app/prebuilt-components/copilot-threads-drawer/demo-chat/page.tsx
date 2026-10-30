"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";

import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { ThreadsProvider } from "@/components/threads-provider";

import { ControlledChat } from "./controlled-chat";
import { HIDE_NEW_THREAD_CSS } from "./hide-new-thread";
import NewConversationSample from "./new-conversation";
import SidebarHostSample from "./sidebar-host";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "default";

/**
 * The doc's whole integration: a drawer and a chat inside one shared
 * `CopilotChatConfigurationProvider`.
 *
 * The shared configuration is the point. It holds the active thread, so
 * selecting a row connects the chat to that thread and replays its history, and
 * the "New Conversation" row resets the chat to a fresh welcome screen — with no
 * `threadId` state, no selection handler, and no props passed between the two
 * components.
 *
 * Every variant talks to `/api/copilotkit-threads`, the only runtime with
 * Intelligence. Variants 2 and 3 are the page's later samples copied whole,
 * with their published `runtimeUrl` pointed there (labelled in each file).
 * Variants 1 and 4 print no provider, so the demo wraps them in
 * `ThreadsProvider`. The route is listed in `lib/inspector.ts`.
 *
 * One departure, and it is presentational only. The doc's wrapper is
 * `<div style={{ display: "flex", height: "100dvh" }}>` with the two components
 * as bare children. In a flex row `CopilotChat` has no flex basis of its own, so
 * it collapses to min-content — the chat renders one word per line beside a
 * full-width drawer. `flex: 1` plus `minWidth: 0` gives it the remaining space;
 * `minWidth` matters because a flex item's default `min-width: auto` refuses to
 * shrink below its content and would push the layout wider than the viewport.
 */
function MainSample() {
  return (
    <CopilotChatConfigurationProvider agentId={AGENT_ID}>
      <div style={{ display: "flex", height: "100%" }}>
        <CopilotThreadsDrawer />
        <div style={{ flex: 1, minWidth: 0 }}>
          <CopilotChat />
        </div>
      </div>
    </CopilotChatConfigurationProvider>
  );
}

type Variant = "chat" | "sidebar" | "button" | "controlled";

const VARIANTS: { id: Variant; label: string; blurb: string }[] = [
  { id: "chat", label: "1 · Drawer + chat", blurb: "CopilotThreadsDrawer + CopilotChat" },
  { id: "sidebar", label: "2 · Sidebar host", blurb: "Drawer beside CopilotSidebar (verbatim, own provider)" },
  { id: "button", label: "3 · Own New-conversation button", blurb: "useCopilotChatConfiguration().startNewThread() (verbatim, own provider)" },
  { id: "controlled", label: "4 · Controlled threadId", blurb: "threadId prop + onThreadSelect / onNewThread" },
];

export default function Page() {
  const [variant, setVariant] = useState<Variant>("chat");
  const [hideBuiltIn, setHideBuiltIn] = useState(false);
  const active = VARIANTS.find((v) => v.id === variant)!;

  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${AGENT_ID} · ${active.blurb}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                variant === v.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {v.label}
            </button>
          ))}
          <label className="ml-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={hideBuiltIn}
              onChange={(e) => setHideBuiltIn(e.target.checked)}
            />
            Hide the Drawer&apos;s own new-conversation controls (CSS parts)
          </label>
        </div>
        {hideBuiltIn && <style>{HIDE_NEW_THREAD_CSS}</style>}

        <div className="min-h-0 flex-1 overflow-hidden">
          {/* Variants 1 and 4 have no provider of their own as published, so
              they get one pointed at the Threads runtime. */}
          {variant === "chat" && (
            <ThreadsProvider>
              <MainSample />
            </ThreadsProvider>
          )}
          {variant === "sidebar" && <SidebarHostSample />}
          {variant === "button" && <NewConversationSample />}
          {variant === "controlled" && (
            <ThreadsProvider>
              <ControlledChat />
            </ThreadsProvider>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
