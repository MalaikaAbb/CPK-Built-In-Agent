import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_SAMPLE = `import {
  CopilotKitProvider,
  CopilotChatConfigurationProvider,
  CopilotChat,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

export default function Page() {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" publicLicenseKey="ck_pub_...">
      <CopilotChatConfigurationProvider>
        <div style={{ display: "flex", height: "100dvh" }}>
          <CopilotThreadsDrawer />
          <CopilotChat />
        </div>
      </CopilotChatConfigurationProvider>
    </CopilotKitProvider>
  );
}`;

const SLOT_SNIPPET = `<CopilotThreadsDrawer>
  <span slot="header">My conversations</span>
</CopilotThreadsDrawer>`;

const PROPS: [string, string][] = [
  ["agentId", "Agent whose threads to list. Inherits from the chat configuration if omitted."],
  ["label", 'Accessible name for the drawer region. Defaults to "Threads".'],
  ["recentLabel", 'Section heading above the list. Defaults to "Recent Conversations".'],
  ["onThreadSelect", "Escape hatch to take over thread selection yourself."],
  ["onNewThread", "Escape hatch to handle the New Conversation row yourself."],
  ["renderRow", "Custom content per row, keeping the row chrome around it."],
  ["limit", "Page size. Shows a Load more control while more threads remain."],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/copilot-threads-drawer" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A ready-made conversation sidebar: list, switch, start, archive, and
          delete. The notable part is what you <em>don&apos;t</em> write — no
          active-thread state, no selection handler, no props threaded between
          the list and the chat.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          What makes that work is the shared{" "}
          <code>CopilotChatConfigurationProvider</code> wrapping both components.
          It owns the active thread, so the drawer and the chat read the same
          value rather than passing it to each other. Underneath, the component is
          a thin React wrapper over a self-contained{" "}
          <code>copilotkit-threads-drawer</code> web component fed by{" "}
          <code>useThreads</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Say hello", "then click New Conversation and say hello again"]}
            expect="Two rows in the drawer. Clicking the first replays its messages into the chat; clicking New Conversation clears back to the welcome screen."
            fail="The drawer shows an Upgrade button instead of a list. That is the no-license-token state, not a threads failure — see the callout below, and check /headless-threads to confirm threads themselves work."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Two credentials, and the drawer gates on the one you'd least expect">
        <p>
          The drawer showing &ldquo;Threads are a CopilotKit Intelligence
          feature&rdquo; with an <strong>Upgrade</strong> button does{" "}
          <em>not</em> mean threads are broken. These are two independent axes:
        </p>
        <ul className="mt-2 space-y-1.5">
          <li>
            · <code>CPK_INTELLIGENCE_API_KEY</code> authorizes the runtime against
            the platform. It is what makes <code>/info</code> report{" "}
            <code>mode: &quot;intelligence&quot;</code> and what makes the thread
            endpoints return real rows.
          </li>
          <li>
            · <code>COPILOTKIT_LICENSE_TOKEN</code> (or <code>licenseToken</code>{" "}
            on <code>CopilotRuntime</code>) builds the runtime&apos;s{" "}
            <code>licenseChecker</code>. <code>/info</code> reports{" "}
            <code>licenseStatus</code> off that checker, and returns{" "}
            <code>&quot;none&quot;</code> when there is no checker at all.
          </li>
        </ul>
        <p className="mt-2">
          The drawer reads the second. So a runtime that serves threads perfectly
          still renders every drawer locked when only the project key is set — and
          while unlicensed the wrapper skips the thread fetch entirely, so the
          drawer issues no network requests at all.
        </p>
        <p className="mt-2">
          <strong>And a managed project cannot set the second.</strong> Headless
          Threads gained a paragraph on 2026-09-04 saying managed project setup
          does not issue a <code>COPILOTKIT_LICENSE_TOKEN</code> — the token is
          for offline and self-hosted licensing, and does not replace the project
          API key. No page reconciles that with the gate above, so as documented
          there is no route from a managed project to an unlocked drawer, and
          this locked view is its steady state rather than a misconfiguration.
          README §9.17.
        </p>
        <p className="mt-2">
          The home page reports both axes on separate rows, so the two are
          distinguishable at a glance. The{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Headless Threads
          </a>{" "}
          route is not gated this way — <code>useThreads</code> talks to the
          runtime directly, which is a useful way to confirm threads work while
          the drawer is locked.
        </p>
      </Callout>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The page's sample, verbatim"
        description="For comparison against the file above."
      >
        <CodeBlock code={DOC_SAMPLE} filename="app/page.tsx" language="tsx" />
      </Panel>

      <Panel
        title="Props"
        description="The component works with zero props. These are the optional ones the doc lists."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Prop</th>
                <th className="pb-2 font-medium">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PROPS.map(([prop, desc]) => (
                <tr key={prop}>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {prop}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Customization"
        description="The drawer renders in a shadow root, so it takes bounded escape hatches rather than arbitrary CSS."
      >
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Slots</strong> — project children with a <code>slot</code>{" "}
            attribute: <code>header</code>, <code>empty</code>,{" "}
            <code>footer</code>, <code>memories</code>,{" "}
            <code>launcher-icon</code>.
          </li>
          <li>
            <strong>Per-row content</strong> — <code>renderRow</code> projects
            into each row while the element keeps selection, archived styling,
            and the kebab menu.
          </li>
          <li>
            <strong>CSS parts and tokens</strong> — restyle structural{" "}
            <code>::part()</code>s or override <code>--cpk-drawer-*</code>{" "}
            variables.
          </li>
        </ul>
        <div className="mt-4">
          <CodeBlock filename="A slot" language="tsx" code={SLOT_SNIPPET} />
        </div>
      </Panel>

      <Callout tone="info" title="Rename is deliberately not here">
        The row menu covers archive, unarchive, and delete. Rename is a{" "}
        <code>useThreads</code> action the prebuilt drawer does not surface — the{" "}
        <a
          href="/headless-threads"
          className="text-[var(--accent)] underline underline-offset-4"
        >
          Headless Threads
        </a>{" "}
        route implements it, which is the clearest reason to reach for that hook
        over this component.
      </Callout>
    </>
  );
}
