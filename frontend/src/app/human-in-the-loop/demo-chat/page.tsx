"use client";

import { DemoFrame } from "@/components/demo-frame";

import HitlInChatDemo from "./hitl-in-chat";

/**
 * The HITL page's demo, unchanged from its Code tab. It mounts its own
 * `<CopilotKit agent="hitl-in-chat">`, so this wrapper only adds the frame.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop"
      subtitle="useHumanInTheLoop · book_call"
    >
      <div className="h-full [&_.h-screen]:h-full">
        <HitlInChatDemo />
      </div>
    </DemoFrame>
  );
}
