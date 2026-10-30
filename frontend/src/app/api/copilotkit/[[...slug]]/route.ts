import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { agents } from "@/copilotkit/agents";
import { MyRunner } from "@/copilotkit/runner";

/**
 * The shared runtime. Every route posts here except those with a runtime of
 * their own (the per-page `copilotkit-*` routes).
 *
 * This is the Quickstart's shape: `CopilotRuntime` from
 * `@copilotkit/runtime/v2`, `createCopilotRuntimeHandler`, a catch-all
 * `[[...slug]]` segment, and GET/POST/PATCH/DELETE — and, like the current
 * Quickstart, no Intelligence. Two harness differences:
 *
 *   - `agents` holds more than `default`, because what other pages teach is
 *     constructor config that cannot share one instance.
 *   - `runner: new MyRunner()` — the AgentRunner page's subclass, so that
 *     route's call log has something to show.
 *
 * Intelligence (persistent threads, realtime sync) is only needed by the
 * Threads Drawer and Headless Threads routes, so it lives on its own runtime
 * at `/api/copilotkit-threads`. Keeping it off this one means no other route
 * depends on the platform being reachable.
 */
const runtime = new CopilotRuntime({
  agents,
  runner: new MyRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
