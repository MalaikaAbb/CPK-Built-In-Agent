"use client";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
import "@copilotkit/react-core/v2/styles.css";

// The page's `app/providers.tsx`. Harness glue: `runtimeUrl` — the doc's is
// "/api/copilotkit"; this repo serves the doc's runtime at the path below.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit-genui" generativeUI={{ ui: standardUI }}>
      {children}
    </CopilotKitProvider>
  );
}
