import { NextResponse } from "next/server";

import { distinctThreadCount, recentRunnerCalls } from "@/copilotkit/runner";

/**
 * Harness instrumentation, not doc code.
 *
 * The AgentRunner page has nothing to click — a runner is a server-side
 * extension point, and the only way to show that the subclass on this repo's
 * runtime is actually being called is to read back what it recorded.
 *
 * `force-dynamic` because the answer changes on every run and a cached response
 * would always report an empty log.
 */
export const dynamic = "force-dynamic";

export const GET = async () =>
  NextResponse.json({
    calls: recentRunnerCalls(),
    threads: distinctThreadCount(),
  });
