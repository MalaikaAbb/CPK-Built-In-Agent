import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DEMO = "frontend/src/app/generative-ui/hashbrown/demo-chat";

const EXAMPLE_MESSAGE = `{
  "ui": [
    { "metric": { "props": { "label": "Total Revenue", "value": "$1.2M" } } },
    {
      "pieChart": {
        "props": {
          "title": "Revenue by Segment",
          "data": "[{\\"label\\":\\"Enterprise\\",\\"value\\":600000},{\\"label\\":\\"SMB\\",\\"value\\":400000},{\\"label\\":\\"Startup\\",\\"value\\":200000}]"
        }
      }
    }
  ]
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Streaming structured output rendered progressively. The agent replies
          with one <code>{"{ \"ui\": [...] }"}</code> envelope; a custom{" "}
          <code>assistantMessage</code> slot feeds the growing text to
          Hashbrown&apos;s <code>useJsonParser</code> against the schema of a{" "}
          <code>useUiKit</code> kit, and <code>kit.render</code> paints each
          component — metric, pie, bar, deal card, markdown — as soon as its
          part of the JSON has arrived.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me a Q4 sales dashboard. Include a total-revenue metric card, a pie chart of revenue by segment, and a bar chart of monthly revenue.",
            ]}
            expect={
              <>
                With the published code against the installed{" "}
                <code>@hashbrownai/core</code> 0.8.3, the demo does not get as
                far as a chat: the renderer imports <code>prompt</code>, which
                that version no longer exports. Expect Turbopack&apos;s{" "}
                <code>Export prompt doesn&apos;t exist in target module</code>{" "}
                overlay, or <code>prompt is not a function</code> at render.
                That error is the finding.
              </>
            }
            fail={
              <>
                Anything else. If the import were resolved, success would be a
                markdown heading, a metric card, and charts appearing one after
                another while the reply streams.
              </>
            }
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Broken by design: the renderer calls an API the package removed">
        <p>
          <code>hashbrown-renderer.tsx</code> does{" "}
          <code>import {"{ s, prompt }"} from &quot;@hashbrownai/core&quot;</code>{" "}
          and builds the kit with{" "}
          <code>useUiKit({"{ examples: prompt`...`, components }"})</code>.
          In 0.8.3 — the current release, installed here — <code>prompt</code>{" "}
          is gone from the package&apos;s exports and{" "}
          <code>UiKitOptions</code> has no <code>examples</code> field (only{" "}
          <code>components</code> and <code>selectable</code>). Both are kept
          exactly as published.
        </p>
        <p className="mt-2">
          Everything else the feature needs is on the page and in place: the
          system prompt and agent factory, the dedicated runtime, the kit&apos;s
          five exposed components, and the <code>useJsonParser</code> rendering
          path. <code>s</code>, <code>exposeComponent</code>,{" "}
          <code>exposeMarkdown</code>, <code>useUiKit</code> and{" "}
          <code>useJsonParser</code> all still exist in 0.8.3.
        </p>
      </Callout>

      <Panel
        title="The demo"
        description="The page's Code-tab files, copied byte for byte. The demo route wraps demo-page.tsx in the harness frame and nothing else."
      >
        <SourceCodeGroup
          files={[
            { file: `${DEMO}/demo-page.tsx` },
            { file: `${DEMO}/chat.tsx` },
            { file: `${DEMO}/hashbrown-renderer.tsx` },
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
        description="A dedicated runtime with one BuiltInAgent in custom-factory mode; the system prompt and stream converter are as published."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-declarative-hashbrown/[[...slug]]/route.ts" },
            { file: "frontend/src/lib/factory/byoc-hashbrown-factory.ts" },
          ]}
        />
      </Panel>

      <Panel
        title="What the agent emits"
        description="The page's own example. Chart data is a JSON string inside the JSON, which the wrappers in the renderer parse."
      >
        <CodeBlock code={EXAMPLE_MESSAGE} filename="example assistant message" language="json" />
      </Panel>

      <Callout tone="warn" title="Three unpublished modules, commented out rather than written">
        <p>
          The Code tab imports <code>forwardingFetch</code> from{" "}
          <code>../header-forwarding</code>,{" "}
          <code>DEMO_AGENT_LOOP_STRATEGY</code> and{" "}
          <code>throwOnRunError</code> from <code>./demo-stream</code>, and wraps
          the route&apos;s handlers in <code>withForwardedHeaders</code>. None of
          them is published, and all are showcase test plumbing, so each is
          commented out in place and labelled. An upstream OpenAI rejection now
          ends a run quietly instead of surfacing as an error.
        </p>
      </Callout>

      <Callout tone="info" title="Also as published, and not typechecking">
        <ul className="space-y-1.5">
          <li>
            · <code>openaiText(&quot;gpt-5.4&quot;)</code> is outside{" "}
            <code>@tanstack/ai-openai</code> 1.0&apos;s model union, and the{" "}
            <code>chat()</code> options omit the now-required{" "}
            <code>threadId</code>. Both type-only.
          </li>
          <li>
            · The factory&apos;s own comment says JSON mode was removed and the
            prompt alone enforces JSON. The JSON Render factory on its sibling
            page says the opposite — that prompt-only JSON reliably lost a
            closing brace and it restored <code>text.format</code>. This page
            ships without it.
          </li>
          <li>
            · The components read showcase theme variables (<code>--card</code>,{" "}
            <code>--border</code>, <code>--foreground</code>,{" "}
            <code>--muted-foreground</code>) that are not published and not
            defined here.
          </li>
        </ul>
      </Callout>

      <Panel title="Inspector">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          The demo mounts its own <code>&lt;CopilotKit&gt;</code>, so the
          app-wide provider&apos;s Inspector is switched off on the demo path.
        </p>
        <div className="mt-3">
          <SourceCode file="frontend/src/app/generative-ui/hashbrown/demo-chat/page.tsx" />
        </div>
      </Panel>
    </>
  );
}
