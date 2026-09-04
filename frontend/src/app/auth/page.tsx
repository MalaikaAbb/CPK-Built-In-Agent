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

const OWNERSHIP = `const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
  hooks: {
    onRequest: async ({ request }) => {
      // Authenticate first: reject anonymous callers outright.
      const user = await verifyRequest(request);
      if (!user) throw new Response("Unauthorized", { status: 401 });
    },

    onBeforeHandler: async ({ request, route }) => {
      const user = await verifyRequest(request);

      // Routes that name a thread directly.
      if ("threadId" in route) {
        if (!(await userOwnsThread(user.id, route.threadId))) {
          throw new Response("Forbidden", { status: 403 });
        }
        return;
      }

      // agent/run and agent/connect carry the thread in the body instead.
      if (route.method === "agent/run" || route.method === "agent/connect") {
        // Clone: the handler still needs to read the original body.
        const { threadId } = await request.clone().json();
        if (threadId && !(await userOwnsThread(user.id, threadId))) {
          throw new Response("Forbidden", { status: 403 });
        }
      }
    },
  },
});`;

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

      <Panel
        title="Thread authorization — documented, and not implemented here"
        description="The page's second half. This route covers onRequest only, so this is a coverage gap in the harness rather than doc drift."
      >
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>onRequest</code>, which the panels above demonstrate, runs{" "}
          <em>before</em> routing — so it can tell an anonymous caller from a
          signed-in one, but cannot see which thread is being addressed.{" "}
          <code>onBeforeHandler</code> runs after, and receives a{" "}
          <code>route</code> naming the operation and, where the operation is
          thread-scoped, its <code>threadId</code>. Authorizing a thread needs
          the second hook; authenticating a caller needs the first.
        </p>
        <div className="mt-4">
          <CodeBlock
            code={OWNERSHIP}
            filename="Thread ownership — as published"
            language="ts"
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page names six routes carrying a <code>threadId</code> on{" "}
          <code>route</code> — <code>agent/stop</code>,{" "}
          <code>threads/update</code>, <code>threads/archive</code>,{" "}
          <code>threads/messages</code>, <code>threads/events</code>,{" "}
          <code>threads/state</code>. That list is exactly right: the shipped{" "}
          <code>RouteInfo</code> union carries <code>threadId</code> on those six
          and no others. <code>agent/run</code> and <code>agent/connect</code>{" "}
          carry it in the body instead, which is why the sample clones the
          request rather than consuming it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page then treats <code>threads/list</code> as the one route{" "}
          <code>onBeforeHandler</code> cannot authorize, since it has no thread
          to check, and says to build the list from your own ownership table.{" "}
          <code>RouteInfo</code> shows it is not alone:{" "}
          <code>threads/subscribe</code>, <code>threads/clear</code> and the four{" "}
          <code>memories/*</code> routes are in the same position. Nothing on the
          page mentions them, and <code>threads/clear</code> is the one worth
          noticing — it is a mutation.
        </p>
      </Panel>

      <Callout tone="warn" title="A thread id is not a secret">
        <p>
          The page is explicit that a <code>threadId</code> is a public
          identifier — it travels through the browser, lands in logs, and is
          enumerable if minted sequentially. Authorization has to be an explicit
          ownership check; &ldquo;they knew the id, so they must own it&rdquo; is
          not one, and UUIDs make guessing impractical without being a control.
        </p>
        <p className="mt-2">
          Off CopilotKit Intelligence there is no server-side binding between a
          thread and a user at all. This harness runs in exactly that state by
          default — SSE mode, in-memory runner — so every thread route here
          accepts any <code>threadId</code> it is handed. That is the documented
          behaviour, not a defect in the runtime, and it is why none of the
          demo routes should be read as a deployment pattern.
        </p>
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
