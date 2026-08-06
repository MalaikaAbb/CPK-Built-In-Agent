import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import type { NextRequest } from "next/server";

import { agents } from "@/copilotkit/agents";
import { MyRunner } from "@/copilotkit/runner";

/**
 * The one runtime this app talks to. Every route in the harness posts here.
 *
 * Two things about the shape of this file are worth knowing before diffing it
 * against the Quickstart:
 *
 * 1. **It is the v2 handler, on a catch-all segment.** The Quickstart builds a
 *    v1 `CopilotRuntime` and `copilotRuntimeNextJSAppRouterEndpoint` at
 *    `app/api/copilotkit/route.ts`. This file follows the Authentication page
 *    instead — `createCopilotRuntimeHandler` at
 *    `app/api/copilotkit/[[...slug]]/route.ts` — because a single fixed segment
 *    cannot serve `GET /info`, `POST /agent/:agentId/run`, and the rest of the
 *    multi-route surface that the Runtime HTTP endpoints page documents and that
 *    the `/backend/runtime-endpoints` route probes live.
 * 2. **It takes a `runner`.** `runner` is a v2 runtime option, which is the
 *    other reason for the v2 handler. `MyRunner` is the AgentRunner page's own
 *    subclass of `InMemoryAgentRunner`.
 *
 * `agents` maps ids to instances. `default` is the one a component with no
 * `agentId` resolves to.
 */
const runtime = new CopilotRuntime({
  agents,
  runner: new MyRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const POST = (req: NextRequest) => handler(req);
export const GET = (req: NextRequest) => handler(req);
