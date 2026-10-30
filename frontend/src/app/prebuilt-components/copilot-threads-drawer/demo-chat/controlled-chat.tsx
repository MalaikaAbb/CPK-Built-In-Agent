"use client";

// Repo-authored: the page prints `ControlledChat` without imports or a
// provider around it. The imports below are the ones it uses; the demo wraps
// it in `ThreadsProvider`.
import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

// Verbatim from the Threads Drawer page ("If you set the threadId prop …").
export function ControlledChat() {
  const [threadId, setThreadId] = useState(() => crypto.randomUUID());
  const startNew = () => setThreadId(crypto.randomUUID());

  return (
    <CopilotChatConfigurationProvider threadId={threadId}>
      <CopilotThreadsDrawer
        onThreadSelect={(id) => setThreadId(id)}
        onNewThread={startNew}
      />
      <button type="button" onClick={startNew}>
        New conversation
      </button>
      <CopilotChat />
    </CopilotChatConfigurationProvider>
  );
}
