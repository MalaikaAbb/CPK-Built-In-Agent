"use client";

import { DemoFrame } from "@/components/demo-frame";
import A2UIFixedSchemaDemo from "@/a2ui/fixed-schema/demo";

/**
 * The Fixed Schema A2UI page's demo, mounted as published. It brings its own
 * `<CopilotKit>` pointed at `/api/copilotkit-a2ui-fixed-schema`, so the root
 * provider's Inspector is switched off on this path.
 *
 * The demo lives under `src/a2ui/` rather than here only because that folder
 * resolves `zod` to the A2UI renderer's zod 3 (see scripts/link-a2ui-zod.mjs);
 * its own relative imports are unchanged.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui/fixed-schema"
      subtitle="display_flight · flight-fixed-catalog"
    >
      <A2UIFixedSchemaDemo />
    </DemoFrame>
  );
}
