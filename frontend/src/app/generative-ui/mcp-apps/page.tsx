import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const HTTP_TRANSPORT = `{
  type: "http",
  url: "http://localhost:3101/mcp",
  serverId: "my-http-server"
}`;

const SSE_TRANSPORT = `{
  type: "sse",
  url: "https://mcp.example.com/sse",
  headers: {
    "Authorization": "Bearer token"
  },
  serverId: "my-sse-server"
}`;

const RUN = `# terminal 1 — the official ext-apps example server, on the doc's port
npm run mcp:apps          # PORT=3108 npx -y @modelcontextprotocol/server-basic-react@2.0.4

# terminal 2
npm run dev`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A tool whose result is a user interface. <code>MCPAppsMiddleware</code>{" "}
          wraps the <code>BuiltInAgent</code> with <code>.use()</code>, discovers
          the MCP server&apos;s tools, and forwards them to the model. When the
          model calls one that declares a <code>ui://</code> resource, the
          middleware fetches that HTML and emits it as an activity message, which
          the provider&apos;s built-in renderer paints in a sandboxed iframe. The
          frontend registers nothing.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The server is the MCP project&apos;s own ext-apps example,{" "}
          <code>@modelcontextprotocol/server-basic-react</code>: one tool,{" "}
          <code>get-time</code>, linked to <code>ui://get-time/mcp-app.html</code>,
          a small React app that can call the server back.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What time is it on the server?"]}
            expect="A get-time tool call, then an embedded card (an iframe) rendered from the server's UI resource, showing the server time and its own buttons. Interacting with the card works without another chat turn."
            fail="Plain text with no card means the middleware never reached the server — check that `npm run mcp:apps` is running on 3108. A run error naming localhost:3108 is the same thing. An error about '@copilotkit/mcp-apps-renderer' means that package is missing from node_modules."
          />
        </div>
      </Panel>

      <Panel title="Running it" description="Two processes. The MCP server is not started by `npm run dev`.">
        <CodeBlock code={RUN} filename="frontend/" language="bash" />
      </Panel>

      <Panel
        title="The runtime route"
        description="The page's route.ts, verbatim except basePath — mounted on its own path so the app-wide runtime keeps its Intelligence wiring."
      >
        <SourceCode
          file="frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts"
          region="route"
        />
      </Panel>

      <Panel title="The demo" description="Harness glue only: a provider at the route above, and a chat.">
        <SourceCode file="frontend/src/app/generative-ui/mcp-apps/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Transport types"
        description="Verbatim. Reference only — neither address is served in this harness (3101 is not the port the runtime route uses, and the SSE host is an example)."
      >
        <div className="space-y-4">
          <CodeBlock code={HTTP_TRANSPORT} filename="HTTP transport" language="ts" />
          <CodeBlock code={SSE_TRANSPORT} filename="SSE transport" language="ts" />
        </div>
      </Panel>

      <Callout tone="warn" title="Where this departs from the page">
        <ul className="space-y-1.5">
          <li>
            · <strong>basePath</strong> is <code>/api/copilotkit-mcp-apps</code>,
            not <code>/api/copilotkit</code>. The page&apos;s route is a
            replacement for the whole runtime; this harness already has one.
          </li>
          <li>
            · <strong>The server is not on the page.</strong> It ends by linking
            the <code>modelcontextprotocol/ext-apps</code> repo of example
            servers. This harness runs one of them from npm, on the port the
            sample&apos;s URL already names, so the URL stays as published.
          </li>
          <li>
            · <strong>Intelligence variant not covered.</strong> A callout on the
            page says an Intelligence-connected runtime configures servers through
            the runtime&apos;s <code>mcpApps</code> option instead. That option has
            no sample on this page, so it is not wired here.
          </li>
          <li>
            · <strong>maxSteps</strong> is not set, so it is the default of 1: the
            run ends with the tool call and the card, and the agent does not
            follow up in prose. That is the published config, not a fault.
          </li>
        </ul>
      </Callout>
    </>
  );
}
