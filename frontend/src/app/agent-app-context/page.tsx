import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const PAGE_CONTEXT = `useAgentContext({
  description: "The page the user is currently viewing",
  value: { page: "settings", section: "notifications" },
});`;

const REACTIVE = `export function TaskList() {
  const [tasks, setTasks] = useState([]);

  // Context updates whenever tasks change
  useAgentContext({
    description: "The user's current task list",
    value: tasks,
  });

  return (
    <div>
      {/* When tasks are added/removed, the agent sees the updated list */}
    </div>
  );
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/agent-app-context" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Handing the agent things it should know without giving it a tool to ask.
          Each <code>useAgentContext</code> call contributes a described value that
          is folded into the agent&apos;s system prompt when a run starts — so the
          agent answers from it directly, with no round trip and no tool call. It
          re-reads the current value on every run, which makes ordinary React state
          a live context source.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Who am I?",
              "What am I working on, and what's the status of each?",
            ]}
            expect="The agent names Jane Smith, Engineering Manager on Platform, and lists Auth Redesign (in-progress) and API v2 (planning) — with no tool call in the transcript."
            fail="The agent says it has no information about you. The context never reached the run; check that the hook is inside a component under the provider."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/agent-app-context/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Other shapes from the page"
        description="Same hook, different granularity: what page the user is on, and a value that changes."
      >
        <div className="space-y-4">
          <CodeBlock
            code={PAGE_CONTEXT}
            filename="components/PageContext.tsx"
            language="tsx"
          />
          <CodeBlock
            code={REACTIVE}
            filename="components/TaskList.tsx"
            language="tsx"
          />
        </div>
      </Panel>

      <Callout
        tone="info"
        title="&ldquo;No backend configuration&rdquo; is a Built-in Agent guarantee, not a CopilotKit one"
      >
        <p>
          A callout added to this page on 2026-09-04 scopes the claim: the
          context reaching the model with nothing configured server-side is
          specific to the Built-in Agent. Every framework receives the same
          entries — each framework then decides what, if anything, it forwards
          to the model, and its own Agent App Context page is the authority.
        </p>
        <p className="mt-2">
          This repo is the Built-in Agent, so the guarantee holds on this route
          as written. What travels is visible in{" "}
          <code>@ag-ui/core</code>: <code>RunAgentInput</code> carries a{" "}
          <code>context</code> array, and the protocol types each entry as{" "}
          <code>{"{ description: string; value: string }"}</code> — note{" "}
          <code>value</code> is a <strong>string</strong>, while{" "}
          <code>useAgentContext</code> above is handed an object. It is
          serialized on the way out, which is worth knowing before reading the
          array on the{" "}
          <a
            href="/backend/ag-ui"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            AG-UI
          </a>{" "}
          route&apos;s event panel and wondering where the object went.
        </p>
      </Callout>

      <Callout tone="info" title="The description is not a comment">
        It is the label the agent sees above the value. &ldquo;The
        user&apos;s active projects&rdquo; and &ldquo;projects&rdquo; are not
        equally useful to a model reading a JSON blob, and the description is the
        cheapest thing to fix when the agent misreads context.
      </Callout>
    </>
  );
}
