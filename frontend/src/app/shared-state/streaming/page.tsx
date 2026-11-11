import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Reference-only route. Rendered for the built-in agent, the page replaces
 * every code sample (backend mapping and frontend subscription) with a "not
 * supported" notice, so there is nothing verbatim to build.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/streaming" />

      <Callout tone="warn" title="Doc gap: the page publishes no built-in-agent code">
        <p>
          Rendered for the built-in agent (fetched 2026-11-11), the page keeps
          its prose but puts a notice that the built-in agent doesn&apos;t
          support <em>Shared State: Streaming</em> in place of each of its
          three code samples: the opening demo, the backend mapping of a tool
          argument to a state key, and the frontend <code>useAgent</code>{" "}
          subscription. There is no demo Code tab. The backend half is a
          per-framework mapping, and <code>BuiltInAgent</code> has no option
          for it, so nothing is wired here. README §9.55.
        </p>
      </Callout>

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Streaming one tool argument into a shared-state key while the model
          is still generating it, so a long draft or a growing list appears
          token by token instead of all at once when the tool call finishes.
          The tool&apos;s final value then replaces the streamed partial. The
          frontend is an ordinary state subscription, plus run-status updates
          if you want a live indicator.
        </p>
      </Panel>

      <Callout tone="info" title="Closest working routes in this repo">
        Shared state without per-token streaming runs on{" "}
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
        .
      </Callout>
    </>
  );
}
