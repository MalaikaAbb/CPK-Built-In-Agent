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
 * the Runtime HTTP endpoints page documents from the client side.
 */

const RUNTIME_URL = "/api/copilotkit";

const LICENSE_KEY = process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl={RUNTIME_URL}
      useSingleEndpoint={false}
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
