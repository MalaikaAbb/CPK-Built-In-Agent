"use client";

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * MCP Apps — the frontend half, which the page says does not exist: the MCP
 * Apps renderer is built into the provider, so nothing is registered here.
 *
 * Harness glue only: a provider of its own, pointed at the separate runtime
 * route that carries the page's `MCPAppsMiddleware` agent under the key
 * `default`. Same provider the Quickstart publishes.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/mcp-apps" subtitle="MCPAppsMiddleware · get-time">
      <CopilotKitProvider runtimeUrl="/api/copilotkit-mcp-apps">
        <CopilotChat
          labels={{
            welcomeMessageText:
              "Needs `npm run mcp:apps` running. Try: what time is it on the server?",
          }}
        />
      </CopilotKitProvider>
    </DemoFrame>
  );
}
