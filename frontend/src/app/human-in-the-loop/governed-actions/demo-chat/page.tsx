"use client";

import { DemoFrame } from "@/components/demo-frame";

import GovernedActionsDemo from "./governed-action";

export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop/governed-actions"
      subtitle="useHumanInTheLoop · approve_governed_action"
    >
      <GovernedActionsDemo />
    </DemoFrame>
  );
}
