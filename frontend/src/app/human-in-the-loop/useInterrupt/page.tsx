import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

/**
 * Reference-only route. Rendered for the built-in agent, the page opens with a
 * "not supported" notice for interrupts. It still prints two framework-neutral
 * frontend samples, shown here as published but not mounted: no built-in agent
 * ever emits an interrupt, so the hook would have nothing to render.
 */

const OUTCOME = `outcome.type === "interrupt"
outcome.interrupts  // Interrupt[]`;

const APPROVE_CANCEL = `function ApprovalInterrupt() {
  useInterrupt({
    render: ({ interrupt, resolve, cancel }) => (
      <div className="p-3 border rounded">
        <p>{interrupt?.message ?? "Approve this action?"}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Cancel</button>
        </div>
      </div>
    ),
  });
  return null;
}`;

const MULTI = `useInterrupt({
  render: ({ interrupts, resolve, cancel }) => (
    <ul>
      {interrupts.map((i) => (
        <li key={i.id}>
          {i.message}
          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>
          <button onClick={() => cancel(i.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  ),
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/useInterrupt" />

      <Callout tone="warn" title="Doc gap: interrupts aren't supported on the built-in agent">
        <p>
          Rendered for the built-in agent (fetched 2026-11-11), the page opens
          with a notice that the built-in agent doesn&apos;t support{" "}
          <em>Human in the Loop: Interrupts</em>, and it publishes no backend
          that pauses a run. <code>BuiltInAgent</code> never emits an interrupt
          outcome or the legacy interrupt event, so <code>useInterrupt</code>{" "}
          would never fire here. The samples below are shown as published and
          not mounted. README §9.54.
        </p>
        <p className="mt-2">
          For pauses the model chooses, the page points to tool-based HITL,
          which runs on{" "}
          <a
            href="/human-in-the-loop"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            HITL Overview
          </a>{" "}
          (<code>useHumanInTheLoop</code>).
        </p>
      </Callout>

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>useInterrupt</code> renders a component when the backend
          itself stops a run for human input, then resumes it with what the
          user returned. It handles two signals: the AG-UI standard one (a
          run-finished outcome of type <code>interrupt</code> carrying an{" "}
          <code>interrupts</code> array) and an older custom event. The
          standard one wins if both arrive. With several open interrupts, each
          is resolved or cancelled by id, and the run resumes once the last one
          is answered. A <code>responseSchema</code> on an interrupt is passed
          through to the UI but not validated.
        </p>
      </Panel>

      <Panel title="As published" description="Shown, not mounted.">
        <div className="space-y-4">
          <CodeBlock code={OUTCOME} filename="Standard flow — what the hook looks for" language="ts" />
          <CodeBlock code={APPROVE_CANCEL} filename="Approve / Cancel example" language="tsx" />
          <CodeBlock code={MULTI} filename="Multi-interrupt behavior" language="tsx" />
        </div>
      </Panel>
    </>
  );
}
