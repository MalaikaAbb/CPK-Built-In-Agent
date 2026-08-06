import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/your-components/interactive" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A component that the run waits on. <code>useHumanInTheLoop</code>{" "}
          registers a tool whose result is supplied by a person: the agent calls
          it, the render function draws the approval card, and nothing further
          happens until <code>respond</code> is called. Whatever you pass to{" "}
          <code>respond</code> becomes the tool result the agent reads next.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              ["status", "\"inProgress\" while args stream · \"executing\" while awaiting respond · \"complete\" after"],
              ["respond", "Optional — absent unless status is \"executing\", hence respond?.()"],
              ["The guard", "if (status !== \"executing\") return <></> — keeps the card out of the transcript once answered"],
            ]}
          />
        </div>
        <div className="mt-4">
          <TryIt
            prompts={["Run the command rm -rf /tmp/cache"]}
            expect="The command appears in a code block with Approve and Deny buttons, and nothing further streams until you click one. The agent's next message reflects which you chose."
            fail="The agent replies in prose with no buttons, or it continues talking before you answer — the run was not suspended."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/generative-ui/your-components/interactive/demo-chat/page.tsx" />
      </Panel>

      {/* <Callout tone="success" title="This sample compiles as published">
        <p>
          Worth noting because several others on neighbouring routes do not.{" "}
          <code>useHumanInTheLoop</code> takes a generic that defaults to{" "}
          <code>Record&lt;string, unknown&gt;</code>, but{" "}
          <code>FrontendTool</code> declares{" "}
          <code>parameters?: StandardSchemaV1&lt;any, T&gt;</code>, so in 1.66.2
          the Zod schema infers <code>T</code> and <code>args.command</code> is a{" "}
          <code>string</code>. Nothing needs to be supplied by hand.
        </p>
      </Callout>

      <Callout tone="info" title="Interrupts have a server-side form too">
        This page&apos;s gate lives in the browser. The built-in agent also
        supports pausing from the server: <code>defineTool</code> accepts{" "}
        <code>interrupt: true</code>, which emits an AG-UI interrupt instead of
        executing, and requires the default <code>maxSteps: 1</code>. That option
        is in the package but not on this doc page, so no route here uses it.
      </Callout> */}
    </>
  );
}
