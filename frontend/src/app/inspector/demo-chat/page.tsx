"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * There is nothing to mount for this one.
 *
 * The Inspector is on because `<CopilotKit>` defaults `enableInspector` to
 * enabled in development — look for the CopilotKit button in the corner of the
 * viewport. This page only supplies traffic for it to show: `renderingAgent`,
 * which carries a server tool, so the Tools and Events tabs have content.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/inspector" subtitle="the overlay is already mounted — look bottom-right">
      <CopilotChat
        agentId="renderingAgent"
        labels={{
          welcomeMessageText:
            "Ask for the weather somewhere, then open the Inspector and read the event stream.",
        }}
      />
    </DemoFrame>
  );
}
