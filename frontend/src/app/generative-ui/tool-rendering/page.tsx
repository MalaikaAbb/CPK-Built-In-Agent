import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-rendering" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Rendering somebody else&apos;s tool call. <code>useRenderTool</code>{" "}
          binds to a tool by name and receives its parameters, typed by the schema
          you pass; <code>useDefaultRenderTool</code> is the wildcard that catches
          every tool without a dedicated renderer. Neither executes anything —{" "}
          <code>get_weather</code> runs on the server, and these hooks only decide
          what the call looks like while and after it happens.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              ["Named renderer receives", "status · parameters (typed by the schema) · result"],
              ["Wildcard receives", "name · args · status · result"],
              ["status values", "\"inProgress\" → \"executing\" → \"complete\""],
            ]}
          />
        </div>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Tokyo?"]}
            expect="A grey line reading 'Calling weather API...' appears while the call is in flight, then becomes 'Called the weather API for Tokyo.' — and the agent's own reply follows."
            fail="The tool call renders as the wildcard row (a ⏳/✓ line plus JSON) instead — the named renderer's name no longer matches the tool exactly."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/generative-ui/tool-rendering/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The tool being rendered"
        description="Server-side, in the runtime — the browser never executes it."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/tools.ts", region: "get-weather-snake" },
            { file: "frontend/src/copilotkit/agents.ts", region: "rendering-agent" },
          ]}
        />
      </Panel>

      {/* <Callout tone="warn" title="Two names for one tool">
        The Server Tools page calls its weather tool <code>getWeather</code>; this
        page and Programmatic Control render <code>get_weather</code>. A renderer
        binds only on an exact name match, so no single tool satisfies both. This
        repo defines the sample twice under both names and puts each on a
        different agent — <code>serverToolsAgent</code> and{" "}
        <code>renderingAgent</code> — so neither page has to be adjusted.
      </Callout>

      <Callout tone="warn" title="The wildcard sample destructures a prop that does not exist">
        <p>
          <code>useDefaultRenderTool</code>&apos;s render prop is typed{" "}
          <code>DefaultRenderProps</code>, which carries{" "}
          <code>name</code>, <code>status</code>, and <code>result</code> — but
          not <code>args</code>. The page&apos;s sample destructures{" "}
          <code>args</code> anyway, so it does not compile. It is kept as
          published; <code>args</code> is simply <code>undefined</code> at
          runtime, and the sample never reads it.
        </p>
        <p className="mt-2">
          The named renderer is fine by comparison:{" "}
          <code>useRenderTool</code> does infer <code>parameters</code> from the
          schema, which is why the same information is called{" "}
          <code>parameters</code> there and typed correctly.
        </p>
      </Callout>

      <Callout tone="info" title="Wildcard and named renderers coexist">
        With both hooks mounted, the named renderer wins for{" "}
        <code>get_weather</code> and the wildcard handles anything else the agent
        calls. Registering a wildcard is the quickest way to see a tool call you
        did not expect.
      </Callout> */}
    </>
  );
}
