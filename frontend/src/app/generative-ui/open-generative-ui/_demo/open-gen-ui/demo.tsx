"use client";

/**
 * Open-Ended Generative UI — minimal setup.
 * -----------------------------------------
 * The simplest possible example. Enabling `openGenerativeUI` in the
 * runtime (see `src/app/api/copilotkit-ogui/route.ts`) is all that's
 * needed — the runtime middleware streams agent-authored HTML + CSS to
 * the built-in `OpenGenerativeUIActivityRenderer`, which mounts it
 * inside a sandboxed iframe. No custom sandbox functions, no custom
 * tools — just chat.
 *
 * This page customises the LLM's visual-authoring prompt via
 * `openGenerativeUI.designSkill` on the provider (see
 * `VISUALIZATION_DESIGN_SKILL` in `./design-skill.ts`) so the cell
 * showcases rich educational visualisations (3D axes, neural nets,
 * algorithms).
 *
 * Reference: https://docs.copilotkit.ai/generative-ui/open-generative-ui
 */

import React from "react";
import { CopilotKit } from "@copilotkit/react-core/v2";

// HARNESS GAP — commented out, not deleted: `./design-skill` is imported by the
// page's published code but its contents are never published, so there is no
// VISUALIZATION_DESIGN_SKILL to pass. Without it the provider uses its default
// design skill. See the "Gaps" callout on /generative-ui/open-generative-ui.
// import { VISUALIZATION_DESIGN_SKILL } from "./design-skill";
import { Chat } from "./chat";

export default function OpenGenUiDemo() {
  // Minimal Open Generative UI frontend: the built-in activity renderer is
  // registered by CopilotKitProvider, so a plain <CopilotChat /> is enough —
  // no custom tool renderers, no activity-renderer registration.
  // We DO pass `openGenerativeUI.designSkill` to swap in visualisation-tuned
  // guidance in place of the default shadcn design skill.
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit-ogui"
      agent="open-gen-ui"
      // HARNESS GAP — the published prop, commented out (see import above):
      // openGenerativeUI={{ designSkill: VISUALIZATION_DESIGN_SKILL }}
    >
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl flex flex-col p-3">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
}