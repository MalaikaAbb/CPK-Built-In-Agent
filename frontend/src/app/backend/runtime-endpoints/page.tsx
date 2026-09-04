import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, KeyValue, Panel, TryIt } from "@/components/ui";

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
        title="What /info gained"
        description="Added to this page on 2026-09-04. Both fields are Intelligence-only, so this harness shows neither without a project key."
      >
        <div className="mt-1">
          <KeyValue
            rows={[
              [
                "runtimeEntitlements",
                <>
                  <code>status</code> is one of <code>ready</code>,{" "}
                  <code>degraded</code>, <code>misconfigured</code>,{" "}
                  <code>unavailable</code>. <code>ready</code> carries the
                  normalized feature and limit values; the other three carry a
                  structured error with a code, a message, and a retry flag.
                </>,
              ],
              [
                "inspectorMetadata",
                <>
                  <code>true</code> advertises{" "}
                  <code>GET {"{basePath}"}/inspector-metadata</code>. The client
                  requests it in the background <em>after</em> the main
                  connection completes; older runtimes omit the flag and newer
                  clients then skip the request entirely.
                </>,
              ],
            ]}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>/info</code> answers <code>200</code> even when the entitlement
          lookup fails — it is an availability endpoint, so a failure degrades
          features rather than the response. A project key rejected with a{" "}
          <code>401</code> still gets a <code>200</code> whose body reports{" "}
          <code>status: &quot;misconfigured&quot;</code>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page names one error code. The shipped runtime emits{" "}
          <strong>two</strong>, split on whether retrying could help:{" "}
          <code>runtime_entitlements_misconfigured</code> with{" "}
          <code>retryable: false</code> for a non-retryable platform error such
          as that 401, and{" "}
          <code>runtime_entitlements_unavailable</code> with{" "}
          <code>retryable: true</code> for every other lookup failure. Only the
          first is on the page.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The <code>/inspector-metadata</code> route answers a versioned{" "}
          <code>InspectorMetadataV1</code> object, or <code>204</code> when the
          data is absent, the schema is unsupported, the runtime is not
          Intelligence-backed, or the upstream request fails or exceeds its
          five-second deadline. Every response — <code>200</code> and{" "}
          <code>204</code> alike — carries{" "}
          <code>Cache-Control: no-store, private</code>, and a metadata failure
          never disturbs the runtime connection or agent state.
        </p>
      </Panel>

      <Callout
        tone="warn"
        title="licenseStatus is no longer just the license token — and this repo said it was"
      >
        <p>
          Reading the shipped <code>handleGetRuntimeInfo</code> alongside the new
          entitlement text resolves something this repo had recorded as an
          unresolvable contradiction. <code>resolveCompatibilityLicenseStatus</code>{" "}
          checks <code>runtimeEntitlements</code> <em>first</em>: a{" "}
          <code>ready</code> entitlement whose source is{" "}
          <code>managedOrgSubscription</code> yields{" "}
          <code>&quot;valid&quot;</code> when active, and only then does it fall
          back to the <code>licenseToken</code>&apos;s{" "}
          <code>licenseChecker</code>.
        </p>
        <p className="mt-2">
          So a managed project <em>can</em> unlock the Threads Drawer without
          ever being issued a <code>COPILOTKIT_LICENSE_TOKEN</code> — through its
          entitlement, not through the token. README §9.17 was written before
          this page documented entitlements and has been corrected rather than
          left standing.
        </p>
        <p className="mt-2">
          Two further details, both from the implementation rather than any page:{" "}
          <code>licenseStatus</code> is emitted <strong>only</strong> by an
          Intelligence runtime, so SSE mode reports none at all whatever the
          token says; and a retryable entitlement failure with no token fallback
          resolves to <code>&quot;unknown&quot;</code> rather than{" "}
          <code>&quot;none&quot;</code>.
        </p>
      </Callout>

      <Panel
        title="Handler and mode pairings"
        description="Two rows are new on this page: the v1 wrappers that cannot leave single-route mode, and one more deprecated alias."
      >
        <div className="mt-1">
          <KeyValue
            rows={[
              [
                "Multi-route (default)",
                "createCopilotRuntimeHandler · createCopilotHonoHandler · createCopilotExpressHandler · createCopilotNodeHandler · createCopilotNodeListener",
              ],
              ["Single-route", 'any of those with mode: "single-route"'],
              [
                "Single-route only — no option (new)",
                "copilotRuntimeNextJSAppRouterEndpoint · copilotRuntimeNextJSPagesRouterEndpoint · copilotRuntimeNodeHttpEndpoint · copilotRuntimeNodeExpressEndpoint · copilotRuntimeNestEndpoint",
              ],
              [
                "createCopilotEndpointSingleRouteExpress (new alias row)",
                'deprecated → createCopilotExpressHandler with mode: "single-route"',
              ],
            ]}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          That third row is the page stating outright what this repo has carried
          as issue §9.1 since it was built: the v1 framework wrappers cannot
          serve Rich Threads, because they have no multi-route mode to switch
          into. <code>useSingleEndpoint={"{false}"}</code> does not help — it
          points the browser at REST sub-routes the wrapper will never serve.
          Moving off them is a server-side change, not a provider prop, which is
          exactly why this harness mounts{" "}
          <code>createCopilotRuntimeHandler</code> at a catch-all.
        </p>
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
