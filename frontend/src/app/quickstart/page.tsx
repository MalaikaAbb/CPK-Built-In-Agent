import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_ROUTE = `import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
});
const runtime = new CopilotRuntime({
  agents: { default: builtInAgent }, //,
});
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;`;

const DOC_PROVIDERS = `"use client";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit">
      {children}
    </CopilotKitProvider>
  );
}`;

const DOC_LAYOUT = `import { Providers } from "./providers";
import "@copilotkit/react-core/v2/styles.css";
import './globals.css';
// ...
export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The shortest path to a working agent. There is no agent process and no
          agent framework: <code>BuiltInAgent</code> is constructed with a model
          id, registered on the runtime under the key <code>default</code>, and
          driven by a <code>CopilotSidebar</code> under a{" "}
          <code>CopilotKitProvider</code>. One command, one port.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Can you tell me a joke?",
              "Can you help me understand AI?",
              "What do you think about React?",
            ]}
            expect="Tokens stream in a word at a time and the reply renders as markdown. On localhost the Inspector button sits in a corner; its Agents › Agent tab lists `default`."
            fail="An error banner — check that OPENAI_API_KEY is set and that the dev server was restarted after setting it."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The runtime route, as published"
        description="Verbatim from the rendered page, including the stray `//,` left where a highlight marker was stripped."
      >
        <CodeBlock
          code={DOC_ROUTE}
          filename="app/api/copilotkit/[[...slug]]/route.ts — as published"
          language="ts"
        />
      </Panel>

      <Panel
        title="This repo's runtime route"
        description="Read from disk at render time. Same import path, handler, catch-all segment, and four verb exports as the published file."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
      </Panel>

      <Callout tone="info" title="Where this runtime differs from the Quickstart's, and why">
        <p>
          The Quickstart no longer wires CopilotKit Intelligence: its route has
          no <code>intelligence</code> or <code>identifyUser</code>, and the
          sign-up step and <code>CPK_INTELLIGENCE_API_KEY</code> are gone from
          the page. This repo&apos;s shared runtime matches: it is SSE-only.
          Intelligence lives on a separate runtime,{" "}
          <code>/api/copilotkit-threads</code>, used only by the Threads Drawer
          and Headless Threads routes.
        </p>
        <p className="mt-2">
          The <code>agents</code> record also holds more than{" "}
          <code>default</code>, since constructor config from other pages
          cannot share one instance, and it passes{" "}
          <code>runner: new MyRunner()</code> for the AgentRunner page.{" "}
          <code>default</code> itself is the Quickstart&apos;s agent unchanged.
        </p>
      </Callout>

      <Panel
        title="The provider, as published"
        description="A client providers.tsx, rendered by a server layout.tsx."
      >
        <div className="space-y-4">
          <CodeBlock code={DOC_PROVIDERS} filename="app/providers.tsx — as published" language="tsx" />
          <CodeBlock code={DOC_LAYOUT} filename="app/layout.tsx — as published" language="tsx" />
        </div>
      </Panel>

      <Panel
        title="This repo's provider and layout"
        description="Same split: a client Providers component around the app, styles imported in the server layout."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/components/providers.tsx" },
            { file: "frontend/src/app/layout.tsx" },
          ]}
          note={
            <>
              The props beyond <code>runtimeUrl</code> are the harness&apos;s:{" "}
              <code>renderToolCalls</code> for the Programmatic Control page,
              and <code>enableInspector</code> switched off on routes that
              mount their own provider.
            </>
          }
        />
      </Panel>

      <Callout tone="warn" title="Changed on the page since the last sync">
        <ul className="space-y-1.5">
          <li>
            · Provider: <code>&lt;CopilotKit useSingleEndpoint={"{false}"}&gt;</code>{" "}
            in <code>layout.tsx</code> became{" "}
            <code>&lt;CopilotKitProvider&gt;</code> in a client{" "}
            <code>providers.tsx</code>. The v2 provider detects the transport
            from <code>/info</code>, so <code>useSingleEndpoint</code> is gone.
          </li>
          <li>
            · Route: <code>PATCH</code> and <code>DELETE</code> are now exported
            alongside <code>GET</code>/<code>POST</code>;{" "}
            <code>intelligence</code>/<code>identifyUser</code> were removed.
          </li>
          <li>
            · <code>app/page.tsx</code> now starts with{" "}
            <code>&quot;use client&quot;</code>.
          </li>
          <li>
            · A callout asks for <code>&quot;moduleResolution&quot;: &quot;bundler&quot;</code>{" "}
            so the <code>/v2</code> subpaths type-check; this repo&apos;s
            tsconfig already uses it.
          </li>
        </ul>
      </Callout>
    </>
  );
}
