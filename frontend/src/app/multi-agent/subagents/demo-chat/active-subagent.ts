/**
 * Repo-authored stand-in: ./active-subagent is imported by the page's Code tab
 * but not published. Minimal: the sub-agent tool call that has started but has
 * no delegation entry yet — the one still running.
 */
import type { Message } from "@ag-ui/client";

import type { Delegation, SubAgentName } from "./delegation-log";

const SUB_AGENTS = new Set<string>(["research_agent", "writing_agent", "critique_agent"]);

export function inferActiveSubAgent(
  delegations: Delegation[],
  messages: Message[],
): SubAgentName | null {
  const done = new Set(delegations.map((d) => d.id));
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "assistant" || !m.toolCalls) continue;
    const pending = m.toolCalls.find(
      (c) => SUB_AGENTS.has(c.function.name) && !done.has(c.id),
    );
    if (pending) return pending.function.name as SubAgentName;
  }
  return null;
}
