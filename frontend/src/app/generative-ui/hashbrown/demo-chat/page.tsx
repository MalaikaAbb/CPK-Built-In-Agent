"use client";

import { DemoFrame } from "@/components/demo-frame";

import ByocHashbrownDemoPage from "./demo-page";

/**
 * The Hashbrown page's demo, unchanged: `demo-page.tsx` and everything it
 * imports in this folder are the page's Code-tab files, byte for byte.
 *
 * It mounts its own `<CopilotKit>` against the dedicated runtime at
 * `/api/copilotkit-declarative-hashbrown`, as the page does, so the root
 * provider's Inspector is switched off on this path.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/hashbrown"
      subtitle="declarative-hashbrown-demo · useUiKit + useJsonParser in the assistant-message slot"
    >
      <ByocHashbrownDemoPage />
    </DemoFrame>
  );
}
