"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";

import { weatherToolRender } from "./weather-tool";

/**
 * One provider for the whole app, so a conversation survives navigation between
 * test routes.
 *
 * `<CopilotKit>` rather than `<CopilotKitProvider>`: it is the component the
 * Quickstart, Copilot Runtime, Inspector, and Authentication pages all use, and
 * it is the one that defaults `enableInspector` to on in development — which is
 * what the `/inspector` route relies on. Never mount `<CopilotKitInspector />`
 * by hand; a bare instance forwards `core ?? null` and reports that core is not
 * attached.
 *
 * `renderToolCalls` is provider-level in the Programmatic Control page, so the
 * `get_weather` card is registered here rather than on a page.
 *
 * `useSingleEndpoint={false}` is not optional here, and it is the one prop on
 * this provider that no doc page sets. `<CopilotKit>` defaults it to **true**,
 * which makes the client POST `{ method: "info" }` to the bare runtime URL
 * instead of calling `GET /info` — the single-route protocol. This repo's
 * runtime runs in multi-route mode, so that POST 404s, and the client then
 * caches single-endpoint transport for the rest of the session: every agent
 * afterwards reports "Agent default not found".
 *
 * Passing `false` pins the transport to REST, which is the half of the pairing
 * the Runtime HTTP endpoints page documents from the client side. The Quickstart
 * now passes it too — it did not when this harness first hit the bug.
 *
 * `headers` carries the identity that `identifyUser` reads on the runtime.
 * Threads are per-user, so without it every visitor of a deployed copy would
 * share one history. A real app would derive this from a verified session; a
 * local harness has none, so it sends a fixed demo identity you can override
 * with NEXT_PUBLIC_DEMO_USER_ID to watch thread lists diverge.
 */

const RUNTIME_URL = "/api/copilotkit";

const LICENSE_KEY = process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY;

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "harness-local";
const DEMO_USER_NAME = process.env.NEXT_PUBLIC_DEMO_USER_NAME ?? "Harness User";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl={RUNTIME_URL}
      useSingleEndpoint={false}
      headers={{
        "x-user-id": DEMO_USER_ID,
        "x-user-name": DEMO_USER_NAME,
      }}
      {...(LICENSE_KEY ? { publicLicenseKey: LICENSE_KEY } : {})}
      renderToolCalls={[weatherToolRender]}
      onError={(event) => {
        console.error("[CopilotKit]", event);
      }}
    >
      {children}
    </CopilotKit>
  );
}
