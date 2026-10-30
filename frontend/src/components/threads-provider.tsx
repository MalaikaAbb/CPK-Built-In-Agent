"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";

/**
 * The runtime with CopilotKit Intelligence on it. Only the Threads Drawer and
 * Headless Threads demos use it; every other route stays on the SSE-only
 * `/api/copilotkit`. See `app/api/copilotkit-threads/[[...slug]]/route.ts`.
 */
export const THREADS_RUNTIME_URL = "/api/copilotkit-threads";

/**
 * A provider pointed at the Threads runtime. Harness glue: the Threads pages
 * publish `<CopilotKitProvider runtimeUrl="/api/copilotkit">` because in their
 * app that one runtime has Intelligence; here Intelligence is scoped to its own
 * runtime, so the URL differs. Listed in `lib/inspector.ts`, so it owns the
 * page's Inspector.
 */
export function ThreadsProvider({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl={THREADS_RUNTIME_URL}>{children}</CopilotKitProvider>
  );
}
