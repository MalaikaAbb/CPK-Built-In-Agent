"use client";

import { DemoFrame } from "@/components/demo-frame";

import ReadonlyStateAgentContextDemo from "./readonly-state-agent-context";

export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/agent-readonly"
      subtitle="useAgentContext · readonly-state-agent-context"
    >
      <div className="h-full overflow-auto">
        <ReadonlyStateAgentContextDemo />
      </div>
    </DemoFrame>
  );
}
