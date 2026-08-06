import "server-only";

import { InMemoryAgentRunner } from "@copilotkit/runtime/v2";

/**
 * The AgentRunner subclass from the AgentRunner and persistence page, wired
 * into the live runtime so the extension point is exercised rather than
 * described.
 *
 * The page's body is two comments marking where a real implementation would
 * persist and re-hydrate a thread; they are kept as written. The counters are
 * this repo's only addition — without them there is nothing on screen to prove
 * the override is on the hot path.
 */
//#region my-runner
export class MyRunner extends InMemoryAgentRunner {
  override run(request: Parameters<InMemoryAgentRunner["run"]>[0]) {
    // persist request.threadId / input here, then delegate
    record("run", request.threadId);
    return super.run(request);
  }

  override connect(request: Parameters<InMemoryAgentRunner["connect"]>[0]) {
    // re-hydrate the thread from your store before re-attaching
    record("connect", request.threadId);
    return super.connect(request);
  }
}
//#endregion

export interface RunnerCall {
  method: "run" | "connect";
  threadId: string;
}

/**
 * Module scope, so it dies with the process — exactly the property the doc page
 * warns about for `InMemoryAgentRunner` itself.
 */
const calls: RunnerCall[] = [];

function record(method: RunnerCall["method"], threadId: string | undefined) {
  calls.unshift({ method, threadId: threadId ?? "(none)" });
  calls.length = Math.min(calls.length, 50);
}

export function recentRunnerCalls(): RunnerCall[] {
  return [...calls];
}

export function distinctThreadCount(): number {
  return new Set(calls.map((c) => c.threadId)).size;
}
