"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { rootInspectorEnabled } from "@/lib/inspector";

import { weatherToolRender } from "./weather-tool";

/**
 * One provider for the whole app, so a conversation survives navigation between
 * test routes.
 *
 * `<CopilotKitProvider>`, as the Quickstart's `app/providers.tsx` now
 * publishes it. It used to publish `<CopilotKit>` with
 * `useSingleEndpoint={false}`; the v2 provider detects the runtime's transport
 * from `/info` on its own, so that prop is gone from here too. In development
 * it mounts the Inspector by default, which the `/inspector` route relies on.
 *
 * The props beyond the Quickstart's `runtimeUrl` are the harness's, not the
 * doc's:
 *
 * - `renderToolCalls` is provider-level in the Programmatic Control page, so
 *   the `get_weather` card is registered here rather than on a page.
 * - No Intelligence here: the shared runtime is SSE-only. The two Threads
 *   routes use `ThreadsProvider` (`./threads-provider.tsx`) against their own
 *   Intelligence runtime.
 * - `enableInspector` is switched off on routes whose demo mounts its own
 *   provider (see `lib/inspector.ts`), so only one Inspector is on the page.
 */

const RUNTIME_URL = "/api/copilotkit";

const LICENSE_KEY = process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY;

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      {...(LICENSE_KEY ? { publicLicenseKey: LICENSE_KEY } : {})}
      enableInspector={rootInspectorEnabled(pathname)}
      renderToolCalls={[weatherToolRender]}
      onError={(event) => {
        console.error("[CopilotKit]", event);
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
