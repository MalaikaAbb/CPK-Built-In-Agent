"use client";

import { DemoFrame } from "@/components/demo-frame";

import ByocJsonRenderDemo from "./demo-page";

/**
 * The JSON Render page's demo, unchanged: `demo-page.tsx` and everything it
 * imports in this folder are the page's Code-tab files, byte for byte.
 *
 * It mounts its own `<CopilotKit>` against the dedicated runtime at
 * `/api/copilotkit-declarative-json-render`, as the page does, so the root
 * provider's Inspector is switched off on this path.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/json-render"
      subtitle="byoc_json_render · @json-render/react Renderer in the assistant-message slot"
    >
      <ByocJsonRenderDemo />
    </DemoFrame>
  );
}
