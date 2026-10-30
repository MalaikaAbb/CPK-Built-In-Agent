"use client";

import { DemoFrame } from "@/components/demo-frame";

import SubagentsDemo from "./subagents-demo";

/**
 * The page's demo, `subagents-demo.tsx`, mounted unchanged inside the harness
 * frame. It brings its own `<CopilotKit agent="subagents">`, so the root
 * provider's Inspector is switched off here (`lib/inspector.ts`).
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/multi-agent/subagents" subtitle="supervisor · research / writing / critique">
      <SubagentsDemo />
    </DemoFrame>
  );
}
