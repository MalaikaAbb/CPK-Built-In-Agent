"use client";

// Verbatim from the Slots page, "Reshaping the Message List" (published as page.tsx).
import { useCallback } from "react";
import { CopilotChat, type Message } from "@copilotkit/react-core/v2";

export function Chat() {
  const transformMessages = useCallback(
    (messages: Message[]) => messages.filter((m) => m.role !== "tool"),
    [],
  );

  return <CopilotChat messageView={{ transformMessages }} />;
}
