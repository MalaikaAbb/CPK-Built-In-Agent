import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_LAYOUT = `import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent answers with real React components instead of text. The
          provider sends a catalog (here the 69-component standard one) with
          every run; the runtime turns that into a <code>render_ui</code> tool
          and a guide, and the agent — a TanStack factory — has to pass both
          on to its model. Nothing is registered component by component.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Compare the Starter, Team, and Enterprise plans in a table",
              "add a column for support",
            ]}
            expect="A table component streams into the chat while the reply is written. The follow-up changes the same table in place rather than drawing a second one."
            fail="A markdown table or plain prose — the model never saw render_ui (tools not forwarded) or the guide (systemPrompts not forwarded). An error banner usually means OPENAI_API_KEY is missing or gpt-5.5 is not available to the key."
          />
        </div>
      </Panel>

      <Panel title="The demo" description="The page's provider and page files, mounted inside the demo route.">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/components/demo-chat/providers.tsx" },
            { file: "frontend/src/app/generative-ui/components/demo-chat/doc-page.tsx" },
            { file: "frontend/src/app/generative-ui/components/demo-chat/page.tsx" },
          ]}
        />
      </Panel>

      <Panel
        title="The runtime and agent"
        description="Step 2 as published, mounted at its own path. Shared by every Components and surfaces demo except Transports."
      >
        <SourceCode file="frontend/src/app/api/copilotkit-genui/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="Published but not mounted as-is" description="The doc's layout, which wraps the whole app.">
        <CodeBlock code={DOC_LAYOUT} filename="app/layout.tsx — as published" language="tsx" />
      </Panel>

      <Callout tone="warn" title="Where this differs from the page">
        <ul className="space-y-1.5">
          <li>
            · <strong>Mount point.</strong> The doc mounts the runtime at{" "}
            <code>/api/copilotkit</code> and wraps the root layout. This harness
            already owns both, so the runtime is at{" "}
            <code>/api/copilotkit-genui</code> and the provider wraps only the
            demo. Nothing else in either file changed.
          </li>
          <li>
            · <strong>
              <code>chat()</code> is called without <code>threadId</code>.
            </strong>{" "}
            <code>@tanstack/ai</code> 1.0 types it as required, so the published
            factory fails <code>tsc</code>. Left as published; whether it also
            fails at run time is what this route tests.
          </li>
          <li>
            · <strong>Experimental.</strong> The page labels the whole feature
            experimental, tied to an A2UI 1.0 candidate revision.
          </li>
        </ul>
      </Callout>
    </>
  );
}
