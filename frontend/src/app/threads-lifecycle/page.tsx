import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const CONTROLS = `import { useCopilotChatConfiguration } from "@copilotkit/react-core/v2";

function ThreadControls() {
  const config = useCopilotChatConfiguration();

  return (
    <>
      <button onClick={() => config?.setActiveThreadId(existingId, { explicit: true })}>
        Open conversation
      </button>
      <button onClick={() => config?.startNewThread()}>New chat</button>
    </>
  );
}`;

const EXPLICIT = `import { CopilotChat } from "@copilotkit/react-core/v2";

<CopilotChat agentId="my-agent" threadId={myThreadId} />`;

const HYDRATE = `import { useAgent } from "@copilotkit/react-core/v2";

function MyComponent() {
  const { agent } = useAgent({ agentId: "my-agent" });
  const messages = agent.messages;
  // agent.setMessages(myPersistedMessages);
  return null;
}`;

const MINT_UP_FRONT = `async function startConversation() {
  const { id } = await myApi.createThread();
  config?.setActiveThreadId(id, { explicit: true });
}`;

const HEADLESS_SEND = `import { CopilotChatInput, useAgent } from "@copilotkit/react-core/v2";

function MyInput() {
  const { agent } = useAgent({ agentId: "my-agent" });

  return (
    <CopilotChatInput
      onSubmitMessage={async (text) => {
        const { id } = await myApi.createThread();
        agent.threadId = id;
        agent.addMessage({ role: "user", content: text });
      }}
    />
  );
}`;

const PRECEDENCE: [string, string][] = [
  ["1. Explicit `threadId` prop", "Authoritative. Enables replay and disables the welcome screen."],
  ["2. setActiveThreadId() / startNewThread()", "The active-thread override, when no prop is supplied."],
  ["3. Inherited threadId", "From a parent configuration provider."],
  ["4. Non-authoritative seed", "A starting value that does not count as explicit."],
  ["5. Freshly minted randomUUID()", "The fallback. Stable across re-renders, re-minted on remount."],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/threads-lifecycle" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Where a thread id comes from, and what changing it does. Four stages —
          mint, run, hydrate, switch — and one rule that decides which of the two
          demos on the neighbouring routes you are writing: whether the id is a
          prop or a setter, never both.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The readable difference is <code>explicit</code>. Setting an id with{" "}
          <code>explicit: true</code> treats it as a known conversation and
          replays its history; the same id with <code>explicit: false</code>{" "}
          shows the welcome screen. This demo prints both, so the flag is visible
          rather than inferred.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Say hello, then press New chat and watch threadId change",
              "pick the first conversation and press Open conversation",
              "then press Set id, no replay with the same conversation selected",
            ]}
            expect="New chat mints a new id and clears the transcript. Open conversation replays the earlier messages and flips explicit to true. Set id, no replay lands on the same id with the welcome screen and explicit false."
            fail="The buttons do nothing and the console logs a warning — that is the prop-controlled no-op, and it means a threadId prop crept back onto the chat."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/threads-lifecycle/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="threadId precedence"
        description="First match wins."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PRECEDENCE.map(([source, what]) => (
                <tr key={source} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {source}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {what}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Callout tone="warn" title="Two footguns, and this harness hit both">
        <p>
          <strong>Setters no-op when the id is prop-controlled.</strong> They also
          log a warning, which is easy to miss. Pick one source of truth: this
          route uses the setters and passes no prop, and{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Headless Threads
          </a>{" "}
          passes the prop and never calls them.
        </p>
        <p className="mt-2">
          <strong>Auto-minted ids re-mint on remount.</strong> A changed React{" "}
          <code>key</code> silently starts a new conversation. That bit this
          repo&apos;s own tab demos in the opposite direction — a{" "}
          <code>key</code> on <code>CopilotChat</code> threw away the transcript
          on every tab switch, which is why the Model Selection and Use-any-router
          tabs deliberately carry none.
        </p>
      </Callout>

      <Panel title="The page's samples">
        <div className="space-y-4">
          <CodeBlock code={CONTROLS} filename="Switch or start" language="tsx" />
          <CodeBlock code={EXPLICIT} filename="Explicit threadId (recommended)" language="tsx" />
          <CodeBlock code={HYDRATE} filename="Manual hydration via useAgent" language="tsx" />
          <CodeBlock code={MINT_UP_FRONT} filename="Mint up front" language="tsx" />
          <CodeBlock code={HEADLESS_SEND} filename="Headless: set the thread before sending" language="tsx" />
        </div>
      </Panel>

      <Callout tone="info" title="What changed from v1">
        There is no <code>initialMessages</code> prop — messages are read and
        written through <code>useAgent().agent.messages</code> and{" "}
        <code>agent.setMessages()</code>. <code>useThreads()</code> returns the
        platform thread list rather than managing a single id, and{" "}
        <code>threadId</code> lives per chat component rather than provider-wide.
      </Callout>
    </>
  );
}
