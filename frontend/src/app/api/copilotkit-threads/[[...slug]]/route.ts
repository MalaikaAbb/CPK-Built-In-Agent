import {
  CopilotKitIntelligence,
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

import { builtInAgent } from "@/copilotkit/agents";

/**
 * The Threads runtime — used only by the Threads Drawer and Headless Threads
 * demos, which are the routes that need CopilotKit Intelligence.
 *
 * With `CPK_INTELLIGENCE_API_KEY` set it is the Headless Threads page's
 * server shape: `intelligence: new CopilotKitIntelligence({ apiKey })` plus
 * `identifyUser`. Without a key it falls back to SSE with an in-memory runner,
 * so both routes still list threads for the life of the dev server.
 *
 * `CopilotRuntimeOptions` is a union: Intelligence mode requires both
 * `intelligence` and `identifyUser`; SSE mode permits neither and is the only
 * one that accepts a `runner`. So the two shapes are built separately.
 */
const CPK_INTELLIGENCE_API_KEY = process.env.CPK_INTELLIGENCE_API_KEY;

/**
 * Self-hosted / offline licensing for the drawer (see the Threads Drawer
 * page's "Intelligence access"). Cloud-hosted projects unlock through their
 * subscription instead and do not need it.
 */
const LICENSE_TOKEN = process.env.COPILOTKIT_LICENSE_TOKEN;

/**
 * Threads are per-user. A real app derives the id from a verified session (the
 * Headless Threads page's `verifyAppSession` sample). The harness has none, so
 * it uses `x-user-id` if a client sends one and otherwise a fixed demo
 * identity — the same for every variant, including the drawer samples whose
 * published providers send no headers.
 */
const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "harness-local";
const DEMO_USER_NAME = process.env.NEXT_PUBLIC_DEMO_USER_NAME ?? "Harness User";

function buildRuntime(): CopilotRuntime {
  if (!CPK_INTELLIGENCE_API_KEY) {
    return new CopilotRuntime({
      agents: { default: builtInAgent },
      runner: new InMemoryAgentRunner(),
      ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    });
  }

  return new CopilotRuntime({
    agents: { default: builtInAgent },
    ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    intelligence: new CopilotKitIntelligence({
      // apiUrl and wsUrl default to the managed platform — leave them unset.
      apiKey: CPK_INTELLIGENCE_API_KEY,
    }),
    // The thread lock, at its defaults, so the option names stay typechecked.
    // Intelligence-only; both numbers are clamped silently (3600s / 3000s).
    lockTtlSeconds: 20,
    lockHeartbeatIntervalSeconds: 15,
    lockKeyPrefix: "cpk-harness",
    identifyUser: (request) => ({
      id: request.headers.get("x-user-id") ?? DEMO_USER_ID,
      name: request.headers.get("x-user-name") ?? DEMO_USER_NAME,
    }),
  });
}

const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime(),
  basePath: "/api/copilotkit-threads",
});

/**
 * GET serves `/info` and the thread list; PATCH/DELETE are rename, archive and
 * delete. Without the last two the drawer's row actions 405 silently.
 */
export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
