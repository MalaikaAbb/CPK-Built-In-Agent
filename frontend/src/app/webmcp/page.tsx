import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/webmcp/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/webmcp" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A <code>useFrontendTool</code> registration with a{" "}
          <code>webmcp</code> option. CopilotKit mirrors the tool — name,
          description, schema, annotations, handler — onto{" "}
          <code>document.modelContext</code>, so a WebMCP-aware browser agent
          can discover and call it on the page without going through the runtime.
          The same tool stays available to the CopilotKit agent.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show me my open orders."]}
            expect="Status line: in a normal browser it reads 'absent' (registration is a silent no-op, as the page says); in Chrome 149+ with WebMCP enabled it reads 'present' and the Model Context Tool Inspector lists searchOrders with readOnlyHint. Calling the tool — from the chat or the Inspector — fails with 'searchOrders is not defined': the page's handler calls a helper it never defines."
            fail="'present' but the Inspector does not list searchOrders — the webmcp option was ignored. The chat agent never attempts the tool — it did not reach the run."
          />
        </div>
      </Panel>

      <Panel title="React frontend tool (as published)">
        <SourceCode file={`${DIR}/OrderSearch.tsx`} />
      </Panel>

      <Panel
        title="WebMCP only, with no agent (as published)"
        description="Kept in the repo verbatim but not imported — it would register a second searchOrders on the same page."
      >
        <SourceCode file={`${DIR}/webmcp.ts`} />
      </Panel>

      <Panel title="Harness page">
        <SourceCode file={`${DIR}/page.tsx`} />
      </Panel>

      <Callout tone="warn" title="Gap: searchOrders is never defined">
        Both samples&apos; handlers call <code>searchOrders(status)</code>, and
        neither the page nor anything it links defines it. It is left undefined
        rather than invented, so registration and discovery are testable but
        every call throws a <code>ReferenceError</code> (and{" "}
        <code>tsc</code> reports <em>Cannot find name &apos;searchOrders&apos;</em>{" "}
        in both files).
      </Callout>

      <Callout tone="info" title="Needs a WebMCP browser">
        WebMCP is a draft spec. Testing the browser-agent half needs Chrome 149
        or newer with the WebMCP origin trial or{" "}
        <code>chrome://flags/#enable-webmcp-testing</code>, plus Chrome&apos;s
        Model Context Tool Inspector extension. Everywhere else the{" "}
        <code>webmcp</code> option does nothing, by design.
      </Callout>
    </>
  );
}
