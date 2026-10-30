"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useEffect, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import { OrderSearch } from "./OrderSearch";

/**
 * The page's React sample mounted under the root provider, beside a chat on
 * the default agent so the CopilotKit half of the path is exercisable too.
 *
 * The status line is harness-authored. CopilotKit silently skips WebMCP
 * registration when `document.modelContext` is absent, so without it there is
 * no way to tell "registered" from "browser does not support WebMCP".
 *
 * `webmcp.ts` (the page's no-agent `CopilotKitCore` sample) is deliberately not
 * imported: it registers a second `searchOrders`, and the page itself says only
 * the first of two same-named WebMCP tools is exposed.
 */
export default function Page() {
  const [hasModelContext, setHasModelContext] = useState<boolean | null>(null);

  useEffect(() => {
    setHasModelContext(
      typeof document !== "undefined" &&
        "modelContext" in (document as unknown as Record<string, unknown>),
    );
  }, []);

  return (
    <DemoFrame parentPath="/webmcp" subtitle="useFrontendTool · webmcp: { annotations }">
      <OrderSearch />
      <div className="flex h-full flex-col">
        <p className="shrink-0 border-b border-slate-200 px-4 py-2 text-xs dark:border-slate-800">
          document.modelContext:{" "}
          {hasModelContext === null ? (
            "checking…"
          ) : hasModelContext ? (
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              present — searchOrders should be listed in Chrome&apos;s Model
              Context Tool Inspector
            </span>
          ) : (
            <span className="font-medium text-amber-700 dark:text-amber-400">
              absent — WebMCP registration is a no-op in this browser (Chrome
              149+ with the WebMCP flag or origin trial is needed)
            </span>
          )}
        </p>
        <div className="min-h-0 flex-1">
          <CopilotChat
            labels={{ welcomeMessageText: "Try: show me my open orders." }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
