import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const FILE = "frontend/src/app/human-in-the-loop/governed-actions/demo-chat/governed-action.tsx";

const DOC_INTERRUPT = `import { useEffect } from "react";
import { useInterrupt } from "@copilotkit/react-core/v2";

function GovernedActionApproval() {
  useInterrupt({
    render: ({ interrupt, resolve, cancel }) => {
      const action = interrupt?.metadata?.action as GovernedAction | undefined;

      if (!action) {
        return null;
      }

      return (
        <GovernedActionCard
          action={action}
          onApprove={() =>
            resolve({
              approved: true,
              actionId: action.id,
              reference: action.reference,
            })
          }
          onReject={() =>
            resolve({
              approved: false,
              actionId: action.id,
              reference: action.reference,
            })
          }
          onBlock={() => cancel()}
        />
      );
    },
  });

  return null;
}`;

const DOC_RESUME = `type ApprovalResponse = {
  approved: boolean;
  actionId: string;
  reference: string;
};

async function handleApproval(action: GovernedAction, response: ApprovalResponse) {
  if (
    response.approved &&
    response.actionId === action.id &&
    response.reference === action.reference
  ) {
    return executeSideEffect(action.tool, action.arguments);
  }

  return {
    skipped: true,
    reason: "The user did not approve this action.",
  };
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/governed-actions" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A small action envelope — summary, tool, policy reference, verdict,
          arguments — rendered as an approval card. The card handles each verdict
          on its own: <code>allow</code> answers immediately,{" "}
          <code>deny</code> blocks immediately, and only{" "}
          <code>require_approval</code> waits for a click. Here the envelope
          arrives through the <code>approve_governed_action</code> HITL tool, so
          the model writes it and the verdict.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Send a refund of $40 to customer 1182. It needs my approval first — call approve_governed_action with verdict require_approval.",
              "Propose deleting the staging database through approve_governed_action with verdict deny.",
            ]}
            expect="require_approval: a card headed 'User approval required' with the summary, tool, reference, and the arguments as JSON, plus 'Approve and run' / 'Reject'. Clicking one closes the card and the agent replies knowing whether it was approved. allow/deny: the card resolves itself on mount (approved: true / approved: false) with no buttons, and the agent continues."
            fail="Nothing renders and the agent answers in prose — the tool did not reach the model. A card that never resolves for allow/deny means the card's effect did not run."
          />
        </div>
      </Panel>

      <Panel title="What runs" description="The page's envelope, card, and HITL tool, then the harness composition that mounts them.">
        <SourceCodeGroup
          files={[
            { file: FILE, region: "envelope" },
            { file: FILE, region: "card" },
            { file: FILE, region: "hitl-tool" },
            { file: FILE, region: "harness" },
          ]}
        />
      </Panel>

      <Panel
        title="Skipped: inline approval with useInterrupt"
        description="Shown as published; not mounted."
      >
        <CodeBlock code={DOC_INTERRUPT} language="tsx" filename="as published" />
        <div className="mt-4">
          <CodeBlock code={DOC_RESUME} language="ts" filename="resume handler — as published" />
        </div>
      </Panel>

      <Callout tone="warn" title="Gaps and deviations">
        <ul className="space-y-1.5">
          <li>
            · <strong>The useInterrupt path is skipped by decision.</strong> It
            needs an agent that pauses a run with an interrupt;{" "}
            <code>BuiltInAgent</code> never emits one, so the hook would never
            fire. The card it renders is the same component the HITL path uses.
          </li>
          <li>
            · <strong>No backend policy check.</strong> The page recommends
            checking policy on the server before presenting the approval, but
            publishes no code for it, and its resume handler calls{" "}
            <code>executeSideEffect</code>, which it never defines. Nothing
            executes after approval here — the agent only receives the response.
          </li>
          <li>
            · <strong>The verdict comes from the model.</strong> With no policy
            engine, the LLM fills in <code>verdict</code> itself, which is why
            the prompts above name one.
          </li>
          <li>
            · The page shows the tool component but no page that mounts it; the
            harness region (tool + <code>&lt;CopilotChat /&gt;</code> on the
            default agent) is repo-authored. The card&apos;s{" "}
            <code>text-muted-foreground</code> / <code>bg-muted</code> classes
            are shadcn tokens this app does not define, so those render
            unstyled.
          </li>
        </ul>
      </Callout>
    </>
  );
}
