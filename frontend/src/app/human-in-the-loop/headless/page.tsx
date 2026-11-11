import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Reference-only route. Rendered for the built-in agent, the page carries a
 * "not supported" notice and no code at all.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Callout tone="warn" title="Doc gap: the page publishes no built-in-agent code">
        <p>
          Rendered for the built-in agent (fetched 2026-11-11), the page shows
          a notice that the built-in agent doesn&apos;t support{" "}
          <em>Human in the Loop: Headless Interrupts</em>. It has prose and
          links but no code samples and no demo Code tab. Headless interrupts
          sit on top of <code>useInterrupt</code>, which the built-in agent
          doesn&apos;t support either (see{" "}
          <a
            href="/human-in-the-loop/useInterrupt"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Pausing the Agent for Input
          </a>
          ). Nothing is wired. README §9.54.
        </p>
      </Callout>

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A resolver for interrupts that lives outside the chat: a button grid,
          side panel or dashboard that answers the agent&apos;s pause directly,
          built from the same lower-level pieces <code>useInterrupt</code> uses.
          It&apos;s meant for deterministic UIs, tests, and cases where you need
          to know exactly when an interrupt arrived and when it was resolved.
        </p>
      </Panel>
    </>
  );
}
