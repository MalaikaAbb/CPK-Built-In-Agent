import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const D = "frontend/src/app/multi-agent/subagents/demo-chat";
const F = "frontend/src/copilotkit/subagents";

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent/subagents" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A supervisor agent whose tools are other agents. Each of{" "}
          <code>research_agent</code>, <code>writing_agent</code> and{" "}
          <code>critique_agent</code> is a TanStack server tool that runs a
          nested <code>chat()</code> with its own system prompt and returns{" "}
          <code>{"{ role, text }"}</code>. The supervisor only ever sees that
          return value. The factory&apos;s stream converter turns each sub-agent
          result into a <code>STATE_DELTA</code> on <code>/delegations</code>,
          which the published delegation log renders live, while{" "}
          <code>useRenderTool</code> draws each call inline in the chat.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Research the history of the bicycle, write a one-paragraph summary from that research, then have it critiqued.",
            ]}
            expect="Three inline sub-agent cards in the chat (research_agent, writing_agent, critique_agent) moving from inProgress to complete, and three entries appearing one by one in the delegation log with the Supervisor running pill on while it works. A final supervisor answer follows."
            fail="The model answers directly with no tool calls — likely without the unpublished supervisor prompt (see below); ask explicitly for each sub-agent. Cards in the chat but an empty log means the STATE_DELTA never applied. A 'Agent subagents not found' error means the agent is not registered on /api/copilotkit."
          />
        </div>
      </Panel>

      <Panel
        title="Sub-agents as tools"
        description="subagent-tools.ts as the page publishes it, minus the showcase's header-forwarding fetch."
      >
        <SourceCode file={`${F}/subagent-tools.ts`} />
      </Panel>

      <Panel
        title="The supervisor"
        description="The Code tab's TanStack factory, and the agent built from it. Lines the harness removed are commented out with [harness] in place, not deleted."
      >
        <SourceCodeGroup
          files={[
            { file: `${F}/index.ts`, region: "subagents-agent" },
            { file: `${F}/tanstack-factory.ts` },
          ]}
        />
      </Panel>

      <Panel title="The demo" description="The Code tab's page, its delegation log, and three stand-ins.">
        <SourceCodeGroup
          files={[
            { file: `${D}/subagents-demo.tsx` },
            { file: `${D}/delegation-log.tsx` },
            { file: `${D}/subagent-activity-card.tsx` },
            { file: `${D}/active-subagent.ts` },
            { file: `${D}/demo-layout.tsx` },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="What the page does not publish">
        <ul className="space-y-1.5">
          <li>
            · <strong>The supervisor prompt.</strong> The Code tab registers{" "}
            <code>createBuiltInAgent({"{ systemPrompt: SUBAGENTS_PROMPT }"})</code>,
            and <code>SUBAGENTS_PROMPT</code> comes from an unpublished{" "}
            <code>demo-prompts</code> module. The agent here runs without it, so
            delegation depends on the request and the tool descriptions alone.
          </li>
          <li>
            · <strong>Three UI modules</strong> —{" "}
            <code>./subagent-activity-card</code>, <code>./active-subagent</code>,{" "}
            <code>./demo-layout</code> — are imported but not shown. Each has a
            minimal, labelled stand-in.
          </li>
          <li>
            · <strong>Dropped as showcase infrastructure:</strong>{" "}
            <code>forwardingFetch</code> (header forwarding for the showcase&apos;s
            fixture server), <code>./demo-stream</code>&apos;s{" "}
            <code>throwOnRunError</code> and <code>DEMO_AGENT_LOOP_STRATEGY</code>{" "}
            (TanStack&apos;s default, five model turns, applies instead),{" "}
            <code>stateTools</code> / <code>baseServerTools</code> (tools for
            other showcase demos), and the suggestion chips.
          </li>
          <li>
            · The page&apos;s <code>.md</code> export carries LangGraph Python
            samples; the rendered page substitutes the TanStack code above for the
            built-in agent. This route follows the rendered page.
          </li>
        </ul>
      </Callout>

      <Callout tone="info" title="Type-check notes">
        <code>@tanstack/ai</code> 1.0 types <code>threadId</code> as required on{" "}
        <code>chat()</code>, and both published <code>chat()</code> calls omit it,
        so <code>npm run typecheck</code> reports them. They are left as
        published; <code>next build</code> ignores type errors in this repo.
      </Callout>
    </>
  );
}
