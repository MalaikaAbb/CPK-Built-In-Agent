import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Reference-only route: the page, rendered for the built-in agent, publishes
 * no code. Both of its code slots are replaced by a "Not supported on
 * CopilotKit's Built-in Agent" notice, so there is nothing verbatim to build.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/state-rendering" />

      <Callout tone="warn" title="Doc gap: the page publishes no built-in-agent code">
        <p>
          Rendered for the built-in agent (fetched 2026-11-11), the page keeps
          its prose but swaps both of its code samples, the frontend{" "}
          <code>useAgent</code> subscription and the backend state-streaming
          setup, for a notice saying the built-in agent does not support{" "}
          <em>Shared State: Streaming</em>. There is no demo Code tab.
        </p>
        <p className="mt-2">
          The <code>.md</code> export does carry code, but it is the default
          LangGraph integration (a Python <code>create_agent</code> with{" "}
          <code>StateStreamingMiddleware</code>). That is another
          framework&apos;s agent, so this repo does not port it. Nothing is
          wired here: no demo, no runtime route, no agent. README §9.52.
        </p>
      </Callout>

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Showing the agent&apos;s state as it changes: progress counters,
          drafts that fill in while the agent works, or panels outside the chat.
          The frontend subscribes to state changes and run-status changes on
          the agent and re-renders on each one. The backend has to push a tool
          argument into a state key token by token while the call is still
          streaming, and that is the part the built-in agent lacks.
        </p>
      </Panel>

      <Callout tone="info" title="Closest working routes in this repo">
        <p>
          Whole-value state rendering, without per-token streaming, already
          runs on{" "}
          <a href="/shared-state" className="text-[var(--accent)] underline underline-offset-4">
            Shared State
          </a>{" "}
          and{" "}
          <a
            href="/shared-state/rendering-in-app"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Render agent state in your app
          </a>
          , through <code>BuiltInAgent</code>&apos;s own AG-UI state tools.
          Neither is this page&apos;s feature.
        </p>
      </Callout>
    </>
  );
}
