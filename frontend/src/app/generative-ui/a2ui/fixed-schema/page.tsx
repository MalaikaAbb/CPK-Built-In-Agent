import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_REGISTER_PAGE = `<CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ catalog: myCatalog }}>
  {children}
</CopilotKit>`;

const DOC_REGISTER_RUNTIME = `const runtime = new CopilotRuntime({
  agents: { "a2ui-fixed-schema": agent },
  a2ui: { injectA2UITool: false, agents: ["a2ui-fixed-schema"] },
});`;

const DOC_ACTION_HANDLERS = `{
  "Button": {
    "label": "Book",
    "action": {
      "name": "book_flight",
      "context": [
        { "key": "flightNumber", "value": { "path": "/flightNumber" } },
        { "key": "price", "value": { "path": "/price" } }
      ]
    }
  }
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/fixed-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The component tree is decided ahead of time and lives in the agent
          factory; the model only supplies four values. One tool call,{" "}
          <code>display_flight</code>, returns an <code>a2ui_operations</code>{" "}
          container — create the surface, send the fixed tree, fill the data
          model — and the A2UI middleware on the runtime turns that tool result
          into a rendered card. Airport codes, airline and price reach the
          renderers through <code>{"{ path }"}</code> bindings, which is why
          those props are declared as a string-or-binding union.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Find me a flight from SFO to JFK on United for $289"]}
            expect="A flight card appears in the chat: 'Flight Details', SFO → JFK, a UNITED pill, Total $289, and a full-width 'Book flight' button. The agent adds at most one short sentence."
            fail="A card showing blank codes, or React error #31 ('object with keys {path}') — the bindings did not resolve, which is what happens when the definitions are built with zod 4 instead of the renderer's zod 3. Plain text with no card means the tool result never reached the A2UI middleware."
          />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Clicking <strong>Book flight</strong> does nothing, by the published
          renderer&apos;s own design: its <code>Button</code> override renders the
          label without wiring the action.
        </p>
      </Panel>

      <Panel
        title="The demo page"
        description="The Code tab's page.tsx, unchanged. It mounts its own <CopilotKit> against the dedicated runtime."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/a2ui/fixed-schema/demo.tsx" },
            { file: "frontend/src/a2ui/fixed-schema/chat.tsx" },
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
        title="The catalog: definitions, renderers, wiring"
        description="Definitions and renderers from the Code tab; catalog.ts from the page itself (the Code tab omits it)."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/a2ui/fixed-schema/a2ui/definitions.ts" },
            { file: "frontend/src/a2ui/fixed-schema/a2ui/renderers.tsx" },
            { file: "frontend/src/a2ui/fixed-schema/a2ui/catalog.ts" },
          ]}
        />
      </Panel>

      <Panel
        title="The agent and its runtime"
        description="The schema is inlined in the factory as a TS const; display_flight returns the three operations."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/genui-factories/a2ui-fixed-schema-factory.ts" },
            { file: "frontend/src/app/api/copilotkit-a2ui-fixed-schema/[[...slug]]/route.ts" },
          ]}
        />
      </Panel>

      <Panel
        title="Published on the page, not run here"
        description="The prose's generic registration snippets and the action-handler reference, verbatim."
      >
        <div className="space-y-4">
          <CodeBlock code={DOC_REGISTER_PAGE} filename="app/page.tsx — as published" language="tsx" />
          <CodeBlock code={DOC_REGISTER_RUNTIME} filename="app/api/copilotkit/route.ts — as published" language="ts" />
          <CodeBlock code={DOC_ACTION_HANDLERS} filename="Action handlers (reference) — as published" language="json" />
        </div>
      </Panel>

      <Callout tone="warn" title="Where this route departs from the page">
        <ul className="space-y-1.5">
          <li>
            · <strong>Two runtime configs.</strong> The prose&apos;s registration
            snippet scopes A2UI with <code>agents: [&quot;a2ui-fixed-schema&quot;]</code>;
            the Code tab&apos;s route file does not. The route runs the Code
            tab&apos;s, since it is the complete file.
          </li>
          <li>
            · <strong>Showcase infrastructure dropped.</strong>{" "}
            <code>forwardingFetch</code> (from <code>../header-forwarding</code>)
            and <code>DEMO_AGENT_LOOP_STRATEGY</code> (from{" "}
            <code>./demo-stream</code>) are imported by the factory but never
            published; they exist for the showcase&apos;s aimock fixtures.
            The route&apos;s <code>withForwardedHeaders</code> /{" "}
            <code>withProbeCompat</code> wrappers are dropped for the same
            reason. Nothing the feature needs is lost — <code>chat()</code> falls
            back to its default five-iteration loop.
          </li>
          <li>
            · <strong>Leaf UI stand-ins.</strong>{" "}
            <code>../_components/card</code>, <code>badge</code>,{" "}
            <code>button</code> and <code>separator</code> are imported by the
            renderers but not published. Each is a minimal repo-authored
            component under <code>src/a2ui/fixed-schema/_components/</code>.
          </li>
          <li>
            · <strong>The Python backend in the page&apos;s markdown.</strong>{" "}
            The <code>.md</code> export still carries LangGraph{" "}
            <code>a2ui_fixed.py</code> blocks; the rendered page for the Built-in
            Agent drops them and leaves only the snippets above plus the Code
            tab.
          </li>
          <li>
            · <strong>Zod.</strong> The page installs <code>zod</code>, which
            today means zod 4, but the A2UI binder still detects bindable props
            through zod 3 internals. This catalog lives under{" "}
            <code>src/a2ui/</code>, where <code>zod</code> resolves to the
            renderer&apos;s own zod 3 copy, so the doc&apos;s{" "}
            <code>import {"{ z }"} from &quot;zod&quot;</code> stays verbatim and
            the bindings resolve.
          </li>
        </ul>
      </Callout>

      <Panel title="The scoped zod link">
        <SourceCode file="frontend/scripts/link-a2ui-zod.mjs" />
      </Panel>
    </>
  );
}
