import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const SINGLE_ROUTE = `// app/api/copilotkit/route.ts
import { CopilotRuntime, BuiltInAgent } from "@copilotkit/runtime/v2";
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express";

const runtime = new CopilotRuntime({
  agents: { default: new BuiltInAgent({ model: "openai/gpt-4o-mini" }) },
});

app.use(
  createCopilotExpressHandler({
    runtime,
    basePath: "/api/copilotkit",
    mode: "single-route",
  }),
);`;

const SINGLE_ROUTE_FE = `import { CopilotKit } from "@copilotkit/react-core/v2";

<CopilotKit runtimeUrl="/api/copilotkit" useSingleEndpoint>
  <YourApp />
</CopilotKit>;`;

const CORS = `createCopilotExpressHandler({
  runtime,
  basePath: "/api/copilotkit",
  cors: { origin: "https://app.example.com", methods: ["GET", "POST", "OPTIONS"] },
});`;

const HOOK = `createCopilotExpressHandler({
  runtime,
  basePath: "/api/copilotkit",
  hooks: {
    onRequest: ({ request }) => {
      if (!request.headers.get("authorization")) {
        throw new Response("Unauthorized", { status: 401 });
      }
    },
  },
});`;

const CURL = `curl -s http://localhost:3000/api/copilotkit/info`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/backend/runtime-endpoints" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The HTTP surface the client actually speaks. In the default multi-route
          mode the runtime exposes one path per operation —{" "}
          <code>GET /info</code> for discovery, then run, connect, stop, and
          transcribe under <code>/agent/:agentId/…</code>. Single-route mode
          collapses all of it into one POST with a{" "}
          <code>{"{ method, params, body }"}</code> envelope, for hosts that will
          only give you one path.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["press GET /api/copilotkit/info", "then send a message in the chat"]}
            expect="200 OK and a JSON body naming all ten registered agents. The chat then streams normally, which means the run endpoint is mounted under the same base path."
            fail="404 on /info — the handler is mounted on a fixed segment rather than a catch-all, so only the base path resolves. 401 means you probed the gated endpoint by mistake."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/backend/runtime-endpoints/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="What serves these paths here"
        description="basePath is stripped, and the remainder is matched against the known routes."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="Probing it from a terminal">
        <CodeBlock code={CURL} filename="The page's curl probe, on this app's port" language="bash" />
      </Panel>


      <Panel
        title="Single-route mode"
        description="The page's samples are Express. Both parts have to agree — the server's mode and the client's useSingleEndpoint."
      >
        <div className="space-y-4">
          <CodeBlock code={SINGLE_ROUTE} filename="Server" language="ts" />
          <CodeBlock code={SINGLE_ROUTE_FE} filename="Client" language="tsx" />
        </div>
      </Panel>

      <Panel title="CORS and request hooks">
        <div className="space-y-4">
          <CodeBlock code={CORS} filename="cors" language="ts" />
          <CodeBlock code={HOOK} filename="hooks.onRequest" language="ts" />
        </div>
      </Panel>

      <Callout tone="info" title="Express is one of four adapters">
        The page&apos;s samples use{" "}
        <code>createCopilotExpressHandler</code>. The package also ships{" "}
        <code>createCopilotHonoHandler</code>, a Node listener, and the
        framework-agnostic <code>createCopilotRuntimeHandler</code> —{" "}
        a plain <code>(Request) =&gt; Promise&lt;Response&gt;</code>, which is what
        a Next.js route handler wants and what this repo uses.
      </Callout>
    </>
  );
}
