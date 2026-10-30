"use client";

import { DemoFrame } from "@/components/demo-frame";

import DocPage from "./doc-page";
import { Providers } from "./providers";

/**
 * Components and surfaces, steps 2–3 as published: the doc's provider (the
 * standard catalog) wrapping the doc's page (a bare `<CopilotChat />`).
 *
 * The doc wraps the whole layout in `Providers`; here it wraps only this demo,
 * because the harness's root provider serves every other route.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components" subtitle="standardUI · tool transport">
      <Providers>
        <DocPage />
      </Providers>
    </DemoFrame>
  );
}
