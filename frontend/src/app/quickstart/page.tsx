import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_ROUTE = `import {
  CopilotKitIntelligence,
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { BuiltInAgent } from "@copilotkit/runtime/v2";

const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
});

const runtime = new CopilotRuntime({
  agents: { default: builtInAgent },
  intelligence: new CopilotKitIntelligence({
    apiKey: process.env.INTELLIGENCE_API_KEY!,
  }),
  identifyUser: (request) => ({
    id: request.headers.get("x-user-id") ?? "anonymous",
    name: request.headers.get("x-user-name") ?? "Anonymous",
  }),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;`;

const DOC_LAYOUT = `import { CopilotKit } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import './globals.css';

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <CopilotKit runtimeUrl="/api/copilotkit" useSingleEndpoint={false}>
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}`;

const OLD_ROUTE = `// app/api/copilotkit/route.ts — the shape this page used to publish
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { NextRequest } from "next/server";

const runtime = new CopilotRuntime({
  agents: { default: builtInAgent },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The shortest path to a working agent. There is no agent process and no
          agent framework: <code>BuiltInAgent</code> is constructed with a model
          id, registered on the runtime under the key <code>default</code>, and
          driven by a <code>CopilotSidebar</code>. One command, one port.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The runtime route below is now also where{" "}
          <strong>CopilotKit Intelligence</strong> is switched on — the same file
          carries the agent, the platform client, and the identity callback that
          makes threads per-user. That is what the three{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Rich Threads
          </a>{" "}
          routes run against.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What can you do?", "What do you think about React?"]}
            expect="Tokens stream in a word at a time and the reply renders as markdown."
            fail="An error banner — check that OPENAI_API_KEY is set and that the dev server was restarted after setting it."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The runtime route, with Intelligence"
        description="Read from this repo at render time, so it can be diffed against the doc's sample directly. This is the file the Quickstart now walks you through."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
      </Panel>

      <Panel
        title="The doc's version of that same file"
        description="Verbatim, for comparison."
      >
        <CodeBlock
          code={DOC_ROUTE}
          filename="app/api/copilotkit/[[...slug]]/route.ts — as published"
          language="ts"
        />
      </Panel>

      <Callout tone="warn" title="This route moved, and its old shape fails quietly">
        <p>
          The Quickstart used to mount a <strong>v1</strong>{" "}
          <code>CopilotRuntime</code> with{" "}
          <code>copilotRuntimeNextJSAppRouterEndpoint</code> at a single-segment{" "}
          <code>app/api/copilotkit/route.ts</code>. Three things moved:
        </p>
        <ul className="mt-2 space-y-1.5">
          <li>
            · The import is <code>@copilotkit/runtime/v2</code>. There is no{" "}
            <code>serviceAdapter</code> on that surface —{" "}
            <code>ExperimentalEmptyAdapter</code> belonged to the v1 GraphQL
            runtime and has no counterpart.
          </li>
          <li>
            · <code>createCopilotRuntimeHandler</code> returns a plain fetch
            handler rather than a <code>{"{ handleRequest }"}</code> wrapper.
          </li>
          <li>
            · The file lives at <code>[[...slug]]/route.ts</code>. The handler
            serves a subtree, so a single-segment route 404s every run while{" "}
            <code>GET /info</code> keeps answering 200 — the app looks connected
            and never replies.
          </li>
        </ul>
        <p className="mt-2">
          This harness was already on the new shape before the docs were, for the
          third reason: <code>/backend/runtime-endpoints</code> probes{" "}
          <code>/info</code> live, and that needs the catch-all.
        </p>
      </Callout>

      <Panel
        title="The shape it replaced"
        description="Kept for diffing against anything still on the old sample."
      >
        <CodeBlock code={OLD_ROUTE} filename="Previously published" language="ts" />
      </Panel>

      <Panel
        title="The provider"
        description="The doc's layout.tsx sample, then this repo's provider."
      >
        <CodeBlock code={DOC_LAYOUT} filename="app/layout.tsx — as published" language="tsx" />
        <div className="mt-4">
          <SourceCodeGroup
            files={[{ file: "frontend/src/components/providers.tsx" }]}
            note={
              <>
                <code>useSingleEndpoint={"{false}"}</code> is now the doc&apos;s
                too — it was not when this harness first needed it. The addition
                here is <code>headers</code>, which carries the identity{" "}
                <code>identifyUser</code> reads; without it every visitor shares
                one thread history.
              </>
            }
          />
        </div>
      </Panel>

      <Panel
        title="Step 1: the Intelligence key"
        description="The Quickstart opens by asking you to sign up, then uses the key several steps later."
      >
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          That key is what turns on Threads and the Inspector&apos;s Threads tab.
          It reaches the runtime as <code>INTELLIGENCE_API_KEY</code> — a
          server-side secret, never <code>NEXT_PUBLIC_</code> — and the runtime
          reads it off the <code>CopilotKitIntelligence</code> client you
          construct, not off the environment directly.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          It is optional here. With no key this repo&apos;s runtime falls back to
          SSE mode with an in-memory runner and every route still works; the Rich
          Threads routes just stop persisting. The connection panel on the{" "}
          <Link
            href="/"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            home page
          </Link>{" "}
          reports which mode you are actually in, read from <code>/info</code>{" "}
          rather than from whether the variable happens to be set.
        </p>
      </Panel>

      <Callout tone="warn" title="Two more departures from the doc's samples">
        <p>
          <strong>
            The model id is <code>openai:gpt-4.1</code>, not{" "}
            <code>openai:gpt-5.4-mini</code>.
          </strong>{" "}
          The pages in this repo name four different ids between them, and{" "}
          <code>gpt-5.4-mini</code> is not in the Model Selection page&apos;s own
          list of supported OpenAI models. Every agent reads{" "}
          <code>OPENAI_MODEL</code> instead.
        </p>
        <p className="mt-2">
          <strong>Four verb exports, not two.</strong> The doc exports{" "}
          <code>GET</code> and <code>POST</code>. Thread rename, archive, and
          delete are <code>PATCH</code> and <code>DELETE</code> — without those
          two, the Rich Threads routes fail with a 405 that surfaces as a silent
          no-op in the drawer.
        </p>
      </Callout>
    </>
  );
}
