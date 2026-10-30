"use client";

/**
 * Repo-authored stand-in: ./demo-layout is imported by the page's Code tab but
 * not published. Minimal: the published delegation log beside a chat.
 */
import { CopilotChat } from "@copilotkit/react-core/v2";

import { DelegationLog, type Delegation, type SubAgentName } from "./delegation-log";

export function DemoLayout({
  delegations,
  isRunning,
  activeSubAgent,
}: {
  delegations: Delegation[];
  isRunning: boolean;
  activeSubAgent: SubAgentName | null;
}) {
  return (
    <div className="flex h-full gap-4 p-4">
      <div className="flex w-2/5 min-w-0 flex-col gap-2">
        <p className="text-xs text-slate-500">
          Active sub-agent: <span className="font-mono">{activeSubAgent ?? "none"}</span>
        </p>
        <div className="min-h-0 flex-1">
          <DelegationLog delegations={delegations} isRunning={isRunning} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <CopilotChat />
      </div>
    </div>
  );
}
