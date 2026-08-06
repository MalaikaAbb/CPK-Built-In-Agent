"use client";

import { CopilotChat, useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Frontend Tools page's `sayHello`, unchanged.
 *
 * The handler runs in the browser — `alert` is the proof, since nothing on a
 * server could raise one — and its return value goes back to the agent as the
 * tool result. Nothing is registered on the runtime side: the tool definition
 * travels with the run over AG-UI.
 */
export function Page() {
  // ...

  useFrontendTool({
    name: "sayHello",
    description: "Say hello to the user",
    parameters: z.object({
      name: z.string().describe("The name of the user to say hello to"),
    }),
    handler: async ({ name }) => {
      alert(`Hello, ${name}!`);
      return `Said hello to ${name}!`;
    },
  });

  // ...

  return (
    <CopilotChat
      labels={{
        welcomeMessageText: "Try: say hello to Damien.",
      }}
    />
  );
}

export default function DemoPage() {
  return (
    <DemoFrame parentPath="/frontend-tools" subtitle="useFrontendTool · sayHello">
      <Page />
    </DemoFrame>
  );
}
