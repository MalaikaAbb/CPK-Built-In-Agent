import {
  CopilotKitIntelligence,
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

import { agents } from "@/copilotkit/agents";
import { MyRunner } from "@/copilotkit/runner";

/**
 * The one runtime this app talks to. Every route in the harness posts here.
 *
 * This is the Quickstart's own shape now — same import path, same handler, same
 * catch-all segment, same `intelligence` + `identifyUser` pair. It did not used
 * to be: the Quickstart built a v1 `CopilotRuntime` with
 * `copilotRuntimeNextJSAppRouterEndpoint` at a single-segment `route.ts`. Three
 * things moved, and all three are load-bearing:
 *
 *   - The import is `@copilotkit/runtime/v2`. There is no `serviceAdapter` on
 *     this surface at all — `ExperimentalEmptyAdapter` belonged to the v1
 *     GraphQL runtime and has no counterpart here.
 *   - `createCopilotRuntimeHandler` returns a plain fetch handler rather than a
 *     `{ handleRequest }` wrapper, so the route is just the verb exports below.
 *   - The file lives at `[[...slug]]/route.ts`. The handler serves a subtree —
 *     `/info`, agent runs, thread list/rename/archive/delete — so a
 *     single-segment route would 404 everything except the bare URL while
 *     `/info` kept answering 200. The app looks connected and never replies.
 */

/**
 * Server-side only, and deliberately not `NEXT_PUBLIC_`. A project key prefixed
 * for the browser would ship in the bundle.
 */
const CPK_INTELLIGENCE_API_KEY = process.env.CPK_INTELLIGENCE_API_KEY;

/**
 * A SECOND, SEPARATE credential — and the one that unlocks the Threads Drawer.
 *
 * `CPK_INTELLIGENCE_API_KEY` authorizes the runtime against the platform: it is what
 * makes `/info` report `mode: "intelligence"` and what makes the thread REST
 * endpoints return real rows. It does NOT advertise a license.
 *
 * `licenseToken` is what does. The runtime builds a `licenseChecker` from it (or
 * from `COPILOTKIT_LICENSE_TOKEN`), and `/info` reports `licenseStatus` off that
 * checker — `"none"` when there is no checker at all. Client-side feature UIs
 * read that field: `<CopilotThreadsDrawer>` renders its locked "Threads are a
 * CopilotKit Intelligence feature" view unless the status is `valid` or
 * `expiring`, regardless of whether threads actually work.
 *
 * So a runtime can serve threads perfectly while every drawer in the app shows
 * an Upgrade button.
 *
 * It is the FALLBACK input, not the only one. `resolveCompatibilityLicenseStatus`
 * checks `runtimeEntitlements` first, and an active `managedOrgSubscription`
 * resolves to `"valid"` on its own. So a managed project — never issued this
 * token, per Headless Threads — still unlocks the drawer, through its
 * entitlement. The token covers offline and self-hosted licensing. README §9.17.
 *
 * `licenseStatus` is also emitted only by an Intelligence runtime, so the SSE
 * branch below reports none at all whatever this is set to.
 */
const LICENSE_TOKEN = process.env.COPILOTKIT_LICENSE_TOKEN;

/**
 * `CopilotRuntimeOptions` is a union, not one object with optional fields.
 * Intelligence mode requires both `intelligence` and `identifyUser`; SSE mode
 * permits neither and is the only one that accepts a `runner`. So the two shapes
 * are built separately rather than spread conditionally into one literal.
 *
 * Without a key the runtime falls back to SSE with `MyRunner`. Chat still works
 * on every route in this harness; the three Rich Threads routes degrade to
 * whatever the in-memory runner can serve, and nothing persists across a
 * restart.
 */
function buildRuntime(): CopilotRuntime {
  if (!CPK_INTELLIGENCE_API_KEY) {
    return new CopilotRuntime({
      agents,
      // SSE-mode only. `runner` is absent from the Intelligence options, which
      // is why the AgentRunner route's call log goes quiet once a key is set —
      // the platform's own runner takes over.
      runner: new MyRunner(),
      ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    });
  }

  return new CopilotRuntime({
    agents,
    ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    intelligence: new CopilotKitIntelligence({
      // apiUrl and wsUrl default to the managed platform — leave them unset.
      apiKey: CPK_INTELLIGENCE_API_KEY,
    }),
    // The thread lock. A run takes it on its thread so a second run cannot
    // start concurrently; these three tune it, and they are set here at their
    // own defaults so the option names stay typechecked against the installed
    // runtime rather than living only in a comment.
    //
    // They exist on the Intelligence branch ONLY — `CopilotRuntimeLike` types
    // all three as `undefined` in SSE mode, so there is nothing to tune on the
    // branch above. Both numbers are clamped with `Math.min` and no warning:
    // 3600s for the TTL, 3000s for the heartbeat. A value over the cap is
    // silently reduced, not rejected.
    lockTtlSeconds: 20,
    lockHeartbeatIntervalSeconds: 15,
    lockKeyPrefix: "cpk-harness",
    // Threads are per-user. Without this, every visitor shares one history.
    // `Providers` sends these headers so the harness has a stable identity to
    // key threads on; a real app would read them from a verified session, as
    // the Headless Threads page's `verifyAppSession` sample does.
    identifyUser: (request) => ({
      id: request.headers.get("x-user-id") ?? "anonymous",
      name: request.headers.get("x-user-name") ?? "Anonymous",
    }),
  });
}

const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime(),
  basePath: "/api/copilotkit",
});

/**
 * Four verbs, not the Quickstart's two. GET serves `/info` and the thread list,
 * POST runs agents, and PATCH/DELETE are how the Rich Threads routes rename,
 * archive, and delete. Without the last two, `renameThread` and `deleteThread`
 * fail with a 405 that surfaces as a silent no-op in the drawer.
 */
export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
