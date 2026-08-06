import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const SCOPED = `useComponent({
  name: "renderProfile",
  parameters: z.object({ userId: z.string() }),
  render: ProfileCard,
  agentId: "support-agent",
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/your-components/display-only" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A component the agent can put on screen. <code>useComponent</code>{" "}
          registers a name, a description, a parameters schema, and a renderer —
          and no handler, which is what makes it display-only: rendering the card{" "}
          <em>is</em> the whole effect. The schema doubles as the agent&apos;s
          instructions for what to fill in.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show the weather card for Tokyo: 77 degrees, clear",
              "Show a greeting that says welcome back",
            ]}
            expect="A bordered card renders inline in the transcript with the city, a large temperature, and the condition. The second prompt renders the blue greeting box instead."
            fail="The agent describes the weather in prose instead — it never called the component, usually because the name or description gave it nothing to match the request against."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/generative-ui/your-components/display-only/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Scoping a component to one agent"
        description="Without agentId, a registered component is offered to whichever agent the surrounding provider is driving."
      >
        <CodeBlock code={SCOPED} filename="app/page.tsx" language="tsx" />
      </Panel>

      <Callout tone="info" title="Nothing to declare on the runtime side">
        The built-in agent learns about this component through AG-UI when the run
        starts, the same way it learns about frontend tools. No{" "}
        <code>defineTool</code>, no entry in the <code>tools</code> array, no
        change to the runtime route.
      </Callout>
    </>
  );
}
