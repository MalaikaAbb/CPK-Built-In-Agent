import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
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
    <CopilotKitProvider runtimeUrl="/api/copilotkit">
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

const AGENT_ID_SAMPLE = `<CopilotThreadsDrawer agentId="research_agent" />`;

const PROPS: [string, string][] = [
  [
    "agentId",
    "Agent whose threads to list. Defaults to the chat configuration's agent, then agentId on <CopilotKitProvider>, then \"default\".",
  ],
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

      <Callout tone="warn" title="Intelligence access: which credential unlocks the list">
        <p>
          The page now splits this by deployment. <strong>Cloud-hosted</strong>:
          the project-scoped <code>CPK_INTELLIGENCE_API_KEY</code> is the
          credential, and the runtime resolves the drawer&apos;s entitlement
          from the organization&apos;s subscription — no token is issued.{" "}
          <strong>Self-hosted / open source</strong>: give the runtime a
          license token, as <code>licenseToken</code> or{" "}
          <code>COPILOTKIT_LICENSE_TOKEN</code> (the option wins if both are
          set).
        </p>
        <p className="mt-2">
          Without an active entitlement the drawer shows a locked view with an
          Upgrade link and issues no thread requests. That is not a threads
          failure:{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Headless Threads
          </a>{" "}
          is not gated this way and is the quickest check that threads work.
          The home page reports the runtime mode and <code>licenseStatus</code>{" "}
          on separate rows.
        </p>
        <p className="mt-2">
          The provider-side <code>publicLicenseKey</code> is gone from the
          page&apos;s sample — entitlement is server-side configuration now.
        </p>
      </Callout>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The page's sample, verbatim"
        description="Variant 1 of the demo, for comparison against the file above."
      >
        <CodeBlock code={DOC_SAMPLE} filename="app/page.tsx" language="tsx" />
      </Panel>

      <Panel
        title="Variants 2–4: the page's newer samples"
        description="Copied whole. 2 and 3 mount their own CopilotKitProvider as published; 4 is printed without a provider or imports, so it runs under the root one."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/sidebar-host.tsx" },
            { file: "frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/new-conversation.tsx" },
            { file: "frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/controlled-chat.tsx" },
            { file: "frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/hide-new-thread.ts" },
          ]}
          note={
            <>
              What to check: <strong>2</strong> — the sidebar chat and the
              Drawer share the active thread (on desktop the Drawer has no
              launcher in the chat header; the page says that is by design).{" "}
              <strong>3</strong> — the header button resets the chat to the
              welcome screen and deselects the row; a new row appears only
              after the first run. <strong>4</strong> — the app owns{" "}
              <code>threadId</code>; row clicks and both New-conversation
              controls go through its state. The checkbox injects the CSS-parts
              sample, which hides the Drawer&apos;s own row and (+) launcher.
              Variants 2 and 3 use 100dvh as published, so they can overflow
              the demo frame. <code>YourMainContent</code> in 2 and the imports
              in 4 are repo-authored, labelled in the files.
            </>
          }
        />
      </Panel>

      <Panel
        title="Which agent's threads the drawer shows"
        description="One agent per drawer, resolved from its own prop, then the nearest chat configuration, then the provider, then default."
      >
        <CodeBlock code={AGENT_ID_SAMPLE} filename="Listing another agent's threads — as published" language="tsx" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Every variant here resolves <code>default</code>: variant 1 sets it
          on its configuration provider, the others fall through to the
          fallback. <code>research_agent</code> is the page&apos;s example id
          and is not registered on this runtime.
        </p>
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
