"use client";

// Verbatim from the Slots page, "Grouping messages into one row" (published as page.tsx).
import { useCallback } from "react";
import {
  CopilotChat,
  messageGroup,
  messageRow,
  type Message,
  type MessageGroupWrapperProps,
  type MessageRow,
} from "@copilotkit/react-core/v2";

// Define wrappers at module level. One created inside groupMessages is a new
// component on every call, so React would remount it each time.
function ToolActivity({
  messages,
  children,
  state,
  setState,
}: MessageGroupWrapperProps<boolean>) {
  const open = state ?? false;
  return (
    <div className="rounded-lg border">
      <button onClick={() => setState(!open)}>
        {messages.length} tool steps {open ? "▾" : "▸"}
      </button>
      {open && children}
    </div>
  );
}

// An assistant message that also carries text stays on its own row, so the
// text (or a card waiting on the user) is never folded into a closed group.
const isToolStep = (m: Message) =>
  m.role === "tool" ||
  (m.role === "assistant" && !!m.toolCalls?.length && !m.content);

export function Chat() {
  const groupMessages = useCallback((messages: Message[]): MessageRow[] => {
    const rows: MessageRow[] = [];
    let run: Message[] = [];
    const flush = () => {
      if (run.length > 0) {
        rows.push(
          messageGroup({ key: run[0].id, messages: run, wrapper: ToolActivity }),
        );
      }
      run = [];
    };
    for (const message of messages) {
      if (isToolStep(message)) run.push(message);
      else {
        flush();
        rows.push(messageRow(message));
      }
    }
    flush();
    return rows;
  }, []);

  return <CopilotChat messageView={{ groupMessages }} />;
}
