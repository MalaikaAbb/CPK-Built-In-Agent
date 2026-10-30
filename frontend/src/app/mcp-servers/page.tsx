import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const RUN = `# terminal 1 — official reference server, Streamable HTTP
npm run mcp:everything        # PORT=3001 npx -y @modelcontextprotocol/server-everything@2.1.0 streamableHttp

# terminal 2 — the same server over SSE, for the SSE samples
npm run mcp:everything:sse    # PORT=3002 npx -y @modelcontextprotocol/server-everything@2.1.0 sse

# terminal 3
npm run dev`;

const F = "frontend/src/copilotkit";

export default function Page() {
  return (
    <>
      <RouteHeader path="/mcp-servers" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Tools that come from an MCP server rather than from your code. With{" "}
          <code>mcpServers</code> the agent opens a connection on every run, lists
          the server&apos;s tools, and hands them to the model next to its own.
          With <code>mcpClients</code> you own a persistent client and the agent
          only calls its <code>.tools()</code>, which is what makes caching and
          token refresh yours to control.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page points every sample at example hosts. Here they all point at
          the MCP project&apos;s reference server,{" "}
          <code>@modelcontextprotocol/server-everything</code>, whose tools
          include <code>echo</code>, <code>get-sum</code>, and{" "}
          <code>get-tiny-image</code>. Each sample is an agent you can pick in the
          demo.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Use the echo tool to say hello",
              "Add 17 and 25 with the sum tool",
              "(Combining with server tools) Who is the current user?",
              "(Tool name collisions) What tools do you have?",
            ]}
            expect="A tool-call row for the MCP tool (echo, get-sum) appears and completes with the server's result. The run stops there — no sample sets maxSteps, so the default of 1 ends the run on the tool result and the model does not speak again. On the collisions agent the tools are listed as staging_echo / production_echo; on Multiple servers all three servers are the same one, so every tool collides and each copy is prefixed by position — mcp1_echo, mcp2_echo, mcp3_echo. Combining with server tools answers getUser with Jane, Admin."
            fail="A run error naming localhost:3001 or 3002 means that server is not running. On the four mcpClients samples, a failure on every message means the route's module failed to import — the server was down on its first request; start it and restart `next dev`."
          />
        </div>
      </Panel>

      <Panel title="Running it" description="The MCP servers are separate processes; `npm run dev` does not start them.">
        <CodeBlock code={RUN} filename="frontend/" language="bash" />
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/mcp-servers/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="mcpServers samples"
        description="The page's configs. Each published URL is the trailing comment on the line that replaces it."
      >
        <SourceCodeGroup
          files={[
            { file: `${F}/mcp-local.ts` },
            { file: `${F}/mcp-servers.ts`, region: "sse" },
            { file: `${F}/mcp-servers.ts`, region: "sse-auth" },
            { file: `${F}/mcp-servers.ts`, region: "http" },
            { file: `${F}/mcp-servers.ts`, region: "multiple" },
            { file: `${F}/mcp-servers.ts`, region: "collisions" },
            { file: `${F}/mcp-servers.ts`, region: "with-server-tools" },
          ]}
        />
      </Panel>

      <Panel
        title="mcpClients samples"
        description="User-managed clients. Each opens its connection when its module loads."
      >
        <SourceCodeGroup
          files={[
            { file: `${F}/mcp-clients/user-managed.ts`, region: "user-managed" },
            { file: `${F}/mcp-clients/tool-caching.ts`, region: "tool-caching" },
            { file: `${F}/mcp-clients/dynamic-auth.ts` },
            { file: `${F}/mcp-clients/combined.ts` },
          ]}
        />
      </Panel>

      <Panel title="The two runtime routes" description="Harness glue — the page publishes no runtime.">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-mcp-servers/[[...slug]]/route.ts" },
            { file: "frontend/src/app/api/copilotkit-mcp-clients/[[...slug]]/route.ts" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="Gaps in the published code">
        <ul className="space-y-1.5">
          <li>
            · <strong>Tool caching</strong> uses <code>ToolSet</code> without
            importing it (it is exported by <code>ai</code>), and reuses a{" "}
            <code>transport</code> from the previous sample. The import is left
            missing — a type error only. A transport can be started once, so this
            module builds its own (labelled glue).
          </li>
          <li>
            · <strong>Dynamic authentication</strong> calls{" "}
            <code>isTokenExpired</code>, <code>getFreshToken</code>,{" "}
            <code>makeTransport</code> and reassigns <code>currentClient</code>,
            none defined on the page. Repo-authored stand-ins: a token that
            expires after 60 s, sent as a bearer header. Watch the dev-server log
            for <code>[mcp dynamic-auth]</code> to see the reconnect.
          </li>
          <li>
            · <strong>Combining with mcpServers</strong> names a{" "}
            <code>persistentClient</code> it never defines; it is wired to the
            user-managed client from the sample before it.
          </li>
          <li>
            · <strong>Every URL is an example host.</strong> They are replaced
            with the local server through <code>mcp-local.ts</code>. The
            collisions sample&apos;s staging and production servers are the same
            local server under two names — which is exactly a full collision.
          </li>
          <li>
            · <code>MCP_API_KEY</code> and <code>DB_MCP_KEY</code> are read as
            published. The reference server ignores auth, so leaving them unset
            sends <code>Bearer undefined</code> harmlessly.
          </li>
        </ul>
      </Callout>

      <Callout tone="warn" title="The reference server has a get-env tool">
        <code>server-everything</code> exposes <code>get-env</code>, which
        returns the environment of the MCP server process — the shell you ran{" "}
        <code>npm run mcp:everything</code> from. If that shell exports API keys,
        the model can read and repeat them. Run it from a shell without secrets
        exported.
      </Callout>
    </>
  );
}
