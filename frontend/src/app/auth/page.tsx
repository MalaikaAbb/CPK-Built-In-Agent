import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const FRONTEND = `import { CopilotKit } from "@copilotkit/react-core/v2";

<CopilotKit
  runtimeUrl="/api/copilotkit"
  headers={{
    Authorization: \`Bearer \${userToken}\`,
  }}
>
  <YourApp />
</CopilotKit>`;

const BACKEND = `import type { NextRequest } from "next/server";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

const runtime = new CopilotRuntime({ agents: { default: myAgent } });

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
  hooks: {
    onRequest: ({ request }) => {
      const authHeader = request.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        throw new Response(
          JSON.stringify({ error: "unauthorized" }),
          { status: 401, headers: { "content-type": "application/json" } },
        );
      }
      const token = authHeader.slice("Bearer ".length);
      const user = verifyJwt(token);
    },
  },
});

export const POST = (req: NextRequest) => handler(req);
export const GET = (req: NextRequest) => handler(req);`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/auth" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two halves that have to agree. The provider&apos;s{" "}
          <code>headers</code> prop attaches a bearer token to every request the
          client makes; the runtime&apos;s <code>onRequest</code> hook runs before
          routing and can reject the request by throwing a <code>Response</code>.
          Nothing in between is automatic — the hook is the only thing standing
          between an open runtime and an authenticated one.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "with Valid token: hello",
              "then switch to Wrong token and send again",
              "then No header at all",
            ]}
            expect="The valid token streams a reply. Either other choice fails to send — the 401 comes back from GET /info on mount, so the client never discovers an agent to run."
            fail="All three work: the hook is not attached, or the page is pointed at the ungated /api/copilotkit endpoint."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/auth/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The gated runtime this page talks to"
        description="A second endpoint, so the rest of the harness stays reachable."
      >
        <SourceCodeGroup
          files={[
            {
              file: "frontend/src/app/api/copilotkit-auth/[[...slug]]/route.ts",
            },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="Three departures, all forced">
        <p>
          <strong>It is mounted at a second path.</strong>{" "}
          <code>onRequest</code> is global to the runtime it is attached to.
          Gating <code>/api/copilotkit</code> would 401 every other route in this
          harness, so the hook lives on{" "}
          <code>/api/copilotkit-auth</code> and this page points its own provider
          there. <code>basePath</code> has to match wherever it is mounted.
        </p>
        <p className="mt-2">
          <strong>
            <code>verifyJwt</code> is not defined by the doc.
          </strong>{" "}
          Real verification needs a signing key and a JWT library, neither of
          which the page specifies. This repo substitutes a comparison against a
          demo token — clearly not verification, and marked as such in the file.
        </p>
        <p className="mt-2">
          <strong>
            <code>const user = verifyJwt(token)</code> is unused.
          </strong>{" "}
          The sample ends on that line, showing where verification goes rather
          than what to do with the result. It is kept, with a lint suppression, so
          the shape stays the doc&apos;s.
        </p>
      </Callout>

      <Panel title="The page's samples, verbatim">
        <div className="space-y-4">
          <CodeBlock
            code={FRONTEND}
            filename="frontend/src/app/page.tsx"
            language="tsx"
          />
          <CodeBlock
            code={BACKEND}
            filename="app/api/copilotkit/[[...slug]]/route.ts"
            language="ts"
          />
        </div>
      </Panel>

      <Callout tone="info" title="Why the header survives the hop">
        The runtime&apos;s default <code>forwardHeaders</code> policy strips
        infrastructure headers but lets <code>authorization</code> and custom{" "}
        <code>x-*</code> headers through to the agent call, so a token forwarded
        this way is available to the agent as well as to the hook. The Copilot
        Runtime route covers configuring that policy.
      </Callout>

      <Callout tone="warn" title="What this route does not do">
        The doc&apos;s security guidance — verify server-side, scope every data
        access to the authenticated user, never log raw tokens, require HTTPS,
        refresh tokens on the client — is about a real application. This is a
        local demo whose token is a constant in the repo. Nothing here is a
        pattern to copy for a deployment.
      </Callout>
    </>
  );
}
