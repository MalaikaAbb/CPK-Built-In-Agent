import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_HEADLESS = `import { CopilotChatToolCallsView } from "@copilotkit/react-core/v2";

<CopilotChatToolCallsView message={assistantMessage} messages={allMessages} />;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A React component handed to <code>useComponent</code> is advertised to
          the agent as a frontend tool. When the model calls{" "}
          <code>render_bar_chart</code>, the chart paints inline in the chat
          with the tool arguments as its props — no handler, no server step. The
          demo has two backends: the config-mode agent (which merges forwarded
          tools on its own) and the AI SDK factory (which has to pass{" "}
          <code>input.tools</code> to the model itself).
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show me quarterly revenue as a bar chart", "Chart the population of the five largest US cities"]}
            expect="Config mode: a bar chart card with a title, a subtitle, and coloured bars appears inside the reply on the first turn, with invented values when you gave none. Factory mode: the same chart renders if the model chooses to call the tool — it has no prompt telling it to, so prose instead of a chart is the published sample's behaviour, not a wiring failure."
            fail="Config mode answers in prose or asks for data — the SYSTEM_PROMPT is not reaching the model. Either mode shows an empty card — the schema did not reach the model and it called the tool with no arguments."
          />
        </div>
      </Panel>

      <Panel title="The demo page (from the page's Code tab)">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/tool-based/demo-chat/gen-ui-tool-based.tsx" },
            { file: "frontend/src/app/generative-ui/tool-based/demo-chat/bar-chart.tsx" },
          ]}
        />
      </Panel>

      <Panel
        title="The backend (from the page's prose)"
        description="Prompt, config-mode agent, and factory-mode agent, as published."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/tool-based.ts", region: "prompts" },
            { file: "frontend/src/copilotkit/tool-based.ts", region: "config-mode" },
            { file: "frontend/src/copilotkit/tool-based.ts", region: "factory-mode" },
          ]}
        />
      </Panel>

      <Panel title="Harness wrapper" description="Mode switch plus the factory-mode chat. Not on the doc page.">
        <SourceCode file="frontend/src/app/generative-ui/tool-based/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Rendering in a headless chat"
        description="Published as a fragment — assistantMessage and allMessages come from a headless chat the page does not build. Shown, not run."
      >
        <CodeBlock code={DOC_HEADLESS} language="tsx" filename="as published" />
      </Panel>

      <Callout tone="warn" title="Gaps between the page and what runs here">
        <ul className="space-y-1.5">
          <li>
            · <strong>Pie chart and suggestions are commented out.</strong> The
            Code-tab page imports <code>./pie-chart</code> (component and{" "}
            <code>pieChartPropsSchema</code>) and <code>./suggestions</code>;
            neither file is published. The bar chart — the one component the
            prose walks through — is complete, so the feature itself runs.
          </li>
          <li>
            · <strong>The Code tab&apos;s backend is not run.</strong> Its
            route maps <code>gen-ui-tool-based</code> to{" "}
            <code>createBuiltInAgent(&#123; systemPrompt: GEN_UI_TOOL_BASED_PROMPT &#125;)</code>,
            a shared showcase factory that imports unpublished{" "}
            <code>demo-prompts</code>, <code>server-tools</code>,{" "}
            <code>state-tools</code>, <code>demo-stream</code> and{" "}
            <code>header-forwarding</code>. The page&apos;s prose prints a
            complete config-mode agent and prompt instead, and that is what is
            registered under <code>gen-ui-tool-based</code>.
          </li>
          <li>
            · Dropped as not needed for the feature: the showcase
            route&apos;s header forwarding, CVDIAG instrumentation, and 404→400
            probe wrapper.
          </li>
          <li>
            · The prose&apos;s config agent uses <code>openai:gpt-5.4-mini</code>{" "}
            and the factory uses <code>gpt-4o</code>; both literals are kept, not
            routed through <code>OPENAI_MODEL</code>.
          </li>
        </ul>
      </Callout>
    </>
  );
}
