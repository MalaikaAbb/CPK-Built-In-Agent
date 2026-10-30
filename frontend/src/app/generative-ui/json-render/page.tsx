import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DEMO = "frontend/src/app/generative-ui/json-render/demo-chat";

const EXAMPLE_OUTPUT = `{
  "root": "revenue-card",
  "elements": {
    "revenue-card": {
      "type": "MetricCard",
      "props": { "label": "Total revenue", "value": "$184,302", "trend": "+12%" },
      "children": ["by-region"]
    },
    "by-region": {
      "type": "BarChart",
      "props": {
        "title": "Revenue by region",
        "description": null,
        "data": [
          { "label": "North America", "value": 112000 },
          { "label": "EMEA", "value": 72302 }
        ]
      }
    }
  }
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Bring-your-own-catalog generative UI with no tool call at all. The
          agent replies with one JSON object — a flat <code>{"{ root, elements }"}</code>{" "}
          map — and a custom <code>assistantMessage</code> slot parses it and
          hands it to <code>@json-render/react</code>&apos;s{" "}
          <code>&lt;Renderer&gt;</code>, which looks each element&apos;s{" "}
          <code>type</code> up in a registry of three React components. Until
          the streamed text is a complete, valid spec, the slot falls back to the
          ordinary bubble.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me the sales dashboard with metrics and a revenue chart",
              "Break down revenue by category as a pie chart",
            ]}
            expect="While the reply streams you see raw JSON in a normal bubble; once the object closes it is replaced by a MetricCard with a Recharts bar or donut chart under it."
            fail="The raw JSON stays in the bubble after the run ends (the spec failed parseSpec — an unknown type, a dangling child id, or an unclosed brace), or the chat errors with a 400 from OpenAI."
          />
        </div>
      </Panel>

      <Panel
        title="The demo"
        description="The page's Code-tab files, copied byte for byte. The demo route wraps demo-page.tsx in the harness frame and nothing else."
      >
        <SourceCodeGroup
          files={[
            { file: `${DEMO}/demo-page.tsx` },
            { file: `${DEMO}/chat.tsx` },
            { file: `${DEMO}/json-render-renderer.tsx` },
            { file: `${DEMO}/catalog.ts` },
            { file: `${DEMO}/registry.tsx` },
            { file: `${DEMO}/types.ts` },
            { file: `${DEMO}/suggestions.ts` },
            { file: `${DEMO}/metric-card.tsx` },
            { file: `${DEMO}/charts/bar-chart.tsx` },
            { file: `${DEMO}/charts/pie-chart.tsx` },
            { file: `${DEMO}/charts/chart-config.ts` },
          ]}
        />
      </Panel>

      <Panel
        title="The backend"
        description="A dedicated runtime with one BuiltInAgent in custom-factory mode. The system prompt, the JSON-mode request option, and the stream converter are all as published."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-declarative-json-render/[[...slug]]/route.ts" },
            { file: "frontend/src/lib/factory/byoc-json-render-factory.ts" },
          ]}
        />
      </Panel>

      <Panel
        title="What the agent emits"
        description="The page's own example of a spec the renderer accepts."
      >
        <CodeBlock code={EXAMPLE_OUTPUT} filename="example agent output" language="json" />
      </Panel>

      <Callout tone="warn" title="Three unpublished modules, commented out rather than written">
        <p>
          The Code tab imports <code>forwardingFetch</code> from{" "}
          <code>../header-forwarding</code>,{" "}
          <code>DEMO_AGENT_LOOP_STRATEGY</code> and{" "}
          <code>throwOnRunError</code> from <code>./demo-stream</code>, and wraps
          the route&apos;s handlers in <code>withForwardedHeaders</code> from{" "}
          <code>@/lib/header-forwarding</code>. None of the three files is on
          the page. All of them are showcase test plumbing — forwarding aimock
          fixture headers, rethrowing upstream errors loudly, and a loop
          strategy for an agent with no tools — so each import and call site is
          commented out in place, labelled, and nothing replaces them.
        </p>
        <p className="mt-2">
          Side effect worth knowing: with <code>throwOnRunError</code> gone, an
          upstream rejection from OpenAI ends the run quietly instead of
          surfacing as an error event.
        </p>
      </Callout>

      <Callout tone="info" title="Published as-is, and not typechecking">
        <ul className="space-y-1.5">
          <li>
            · <code>openaiText(&quot;gpt-5.4&quot;)</code> — <code>gpt-5.4</code>{" "}
            is not in <code>@tanstack/ai-openai</code> 1.0&apos;s model union. A
            type error only; the adapter sends the id to OpenAI unchanged.
          </li>
          <li>
            · The <code>chat()</code> options object omits{" "}
            <code>threadId</code>, which <code>@tanstack/ai</code> 1.0 types as
            required. Also type-only.
          </li>
          <li>
            · The components read <code>--card</code>, <code>--border</code>,{" "}
            <code>--foreground</code> and <code>--muted-foreground</code>, which
            come from the showcase&apos;s theme and are not published. This app
            does not define them, so cards render without their border and
            background colour. Layout and data are unaffected.
          </li>
        </ul>
      </Callout>

      <Panel title="Inspector">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          The demo mounts its own <code>&lt;CopilotKit&gt;</code>, so the app-wide
          provider&apos;s Inspector is switched off on the demo path and the
          demo&apos;s own one is the only Inspector on the page.
        </p>
        <div className="mt-3">
          <SourceCode file="frontend/src/app/generative-ui/json-render/demo-chat/page.tsx" />
        </div>
      </Panel>
    </>
  );
}
