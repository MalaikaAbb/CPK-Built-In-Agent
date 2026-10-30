import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_MIDDLEWARE = `import { A2UIMiddleware } from "@ag-ui/a2ui-middleware";

agent.use(new A2UIMiddleware({ injectA2UITool: false }));`;

const DOC_PY_TOOL = `from ag_ui_langgraph import get_a2ui_tools
from langchain_openai import ChatOpenAI

generate_a2ui = get_a2ui_tools({
    "model": ChatOpenAI(model="gpt-4o"),
    "default_catalog_id": "copilotkit://app-dashboard-catalog",
})

tools = [my_other_tool, generate_a2ui]`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Nothing about the UI is decided ahead of time. The page registers a
          dashboard catalog — Card, StatusBadge, Metric, InfoRow, DataTable,
          PrimaryButton, PieChart, BarChart, plus overridden Row/Column/Text —
          and the A2UI middleware describes it to the agent. The runtime runs
          with <code>a2ui: {"{ injectA2UITool: true }"}</code>, so the
          middleware injects the A2UI tool itself; when a visual answer helps,
          the agent calls it and the result renders as a surface built from
          those components.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me a sales dashboard: revenue, pipeline, win rate, and revenue by region as a pie chart",
              "Compare quarterly revenue for the last four quarters as a bar chart",
            ]}
            expect="A composed surface in the chat — KPI tiles, cards, and a Recharts pie or bar chart — built from the registered components. The agent's text reply is one short sentence."
            fail="Plain text only (the tool was not injected, or the agent never called it), or a 'Catalog not found' render error (the catalog id was not pinned)."
          />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Cards and tiles may render without their background and border
          colours: the published renderers style themselves with{" "}
          <code>var(--card)</code>, <code>var(--border)</code> and{" "}
          <code>var(--muted-foreground)</code>, theme variables the page never
          defines and this app does not set. Layout and data are unaffected.
        </p>
      </Panel>

      <Panel
        title="The demo page"
        description="The Code tab's page.tsx, unchanged. Its provider takes the catalog through a2ui={{ catalog }}."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/a2ui/dynamic-schema/demo.tsx" },
            { file: "frontend/src/a2ui/dynamic-schema/chat.tsx" },
          ]}
          note={
            <>
              <code>chat.tsx</code> is a repo-authored stand-in — the Code tab
              imports <code>./chat</code> without publishing it.
            </>
          }
        />
      </Panel>

      <Panel
        title="The 3-file catalog"
        description="definitions.ts, renderers.tsx and catalog.ts from the Code tab, unchanged."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/a2ui/dynamic-schema/a2ui/definitions.ts" },
            { file: "frontend/src/a2ui/dynamic-schema/a2ui/catalog.ts" },
            { file: "frontend/src/a2ui/dynamic-schema/a2ui/renderers.tsx" },
          ]}
        />
      </Panel>

      <Panel
        title="The runtime"
        description="injectA2UITool: true — the middleware owns the A2UI tool; the agent is the Quickstart's BuiltInAgent."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-declarative-gen-ui/[[...slug]]/route.ts" },
            { file: "frontend/src/copilotkit/agents.ts", region: "default-agent" },
          ]}
        />
      </Panel>

      <Panel
        title="Published on the page, not run here"
        description="The opt-out section's two snippets, verbatim."
      >
        <div className="space-y-4">
          <CodeBlock code={DOC_MIDDLEWARE} filename="The A2UIMiddleware — as published" language="ts" />
          <CodeBlock code={DOC_PY_TOOL} filename="agent.py — as published on the Built-in Agent page" language="python" />
        </div>
      </Panel>

      <Callout tone="warn" title="Where this route departs from the page">
        <ul className="space-y-1.5">
          <li>
            · <strong>The prose and the demo take opposite paths.</strong> The
            prose says a catalog on the provider auto-injects{" "}
            <code>generate_a2ui</code> (or, with no catalog,{" "}
            <code>a2ui: {"{ injectA2UITool: true }"}</code> on the runtime).
            The Code tab opts out with <code>injectA2UITool: false</code> and
            has a TanStack agent own <code>generate_a2ui</code> via an{" "}
            <code>a2ui-factory.ts</code>. This route runs the prose path with{" "}
            <code>injectA2UITool: true</code>; the Code tab&apos;s factory is not
            used.
          </li>
          <li>
            · <strong>The opt-out tool is Python.</strong> &quot;The A2UI agent
            tool&quot; is shown, even on the Built-in Agent page, as LangGraph{" "}
            <code>get_a2ui_tools</code>.
          </li>
          <li>
            · <strong>The prose&apos;s mechanics are LangGraph&apos;s.</strong>{" "}
            &quot;Streams through LangGraph as <code>TOOL_CALL_ARGS</code>&quot;
            and the progressive per-item streaming describe the LangGraph
            backend; the page has no Built-in Agent version of that section.
          </li>
          <li>
            · <strong>Showcase infrastructure dropped.</strong>{" "}
            The route&apos;s <code>withForwardedHeaders</code> wrapper (aimock
            header forwarding, never published) is omitted;{" "}
            <code>withProbeCompat</code> is kept as the Code tab has it.
          </li>
          <li>
            · <strong>Leaf UI stand-ins.</strong>{" "}
            <code>../_components/badge</code> and <code>button</code> are
            imported by the renderers but not published; minimal versions live
            in <code>src/a2ui/dynamic-schema/_components/</code>.
          </li>
          <li>
            · <strong>Zod.</strong> As on Fixed Schema, the catalog lives under{" "}
            <code>src/a2ui/</code> so its verbatim{" "}
            <code>import {"{ z }"} from &quot;zod&quot;</code> resolves to the
            renderer&apos;s zod 3.
          </li>
        </ul>
      </Callout>
    </>
  );
}
