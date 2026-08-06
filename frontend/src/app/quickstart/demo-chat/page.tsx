"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Quickstart's own UI, unchanged: `<CopilotSidebar />` beside your app
 * content.
 *
 * No `agentId` — a component that names none resolves to the agent registered
 * under `default`, which is the only agent the Quickstart creates.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/quickstart" subtitle="CopilotSidebar · default agent">
      <main className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Your App
        </h1>
        <p className="max-w-md text-sm text-slate-500">
          The sidebar is docked at the right edge of the window. Ask it
          something to confirm the whole stack is connected.
        </p>
      </main>

      <CopilotSidebar />
    </DemoFrame>
  );
}
