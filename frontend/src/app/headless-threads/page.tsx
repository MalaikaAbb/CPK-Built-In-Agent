import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, KeyValue, Panel, TryIt } from "@/components/ui";

const SIDEBAR = `import { useThreads } from "@copilotkit/react-core/v2";

function ThreadSidebar() {
  const {
    threads,
    isLoading,
    renameThread,
    archiveThread,
    deleteThread,
  } = useThreads({ agentId: "my-agent" });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {threads.map((thread) => (
        <div key={thread.id}>
          <span>{thread.name ?? "New conversation"}</span>
          <button onClick={() => renameThread(thread.id, "Renamed")}>
            Rename
          </button>
          <button onClick={() => archiveThread(thread.id)}>
            Archive
          </button>
        </div>
      ))}
    </div>
  );
}`;

const APP = `import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

function App() {
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();

  return (
    <div className="flex">
      <ThreadSidebar onSelectThread={setActiveThreadId} />
      <CopilotChat threadId={activeThreadId} />
    </div>
  );
}`;

const PAGINATION = `const {
  threads,
  hasMoreThreads,
  isFetchingMoreThreads,
  fetchMoreThreads,
} = useThreads({
  agentId: "my-agent",
  limit: 20,
});

{hasMoreThreads && (
  <button
    onClick={fetchMoreThreads}
    disabled={isFetchingMoreThreads}
  >
    {isFetchingMoreThreads ? "Loading..." : "Load more"}
  </button>
)}`;

const SERVER = `import {
  CopilotKitIntelligence,
  CopilotRuntime,
} from "@copilotkit/runtime/v2";

const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
  intelligence: new CopilotKitIntelligence({
    apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
  }),
  identifyUser: async (request) => {
    const session = await verifyAppSession(request);
    if (!session?.user) throw new Error("Unauthorized");
    return { id: session.user.id, name: session.user.name };
  },
  // generateThreadNames: false,
  // lockTtlSeconds: 20,
  // lockHeartbeatIntervalSeconds: 15,
  // lockKeyPrefix: "my-app",
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/headless-threads" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The same thread data as the drawer, through the hook the drawer itself
          uses. <code>useThreads</code> returns the list plus four actions, and
          you render whatever you like around them — which is the point, because
          the prebuilt drawer surfaces only three of the four.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              ["Read", "threads · isLoading · error · hasMoreThreads · isFetchingMoreThreads"],
              ["Act", "renameThread · archiveThread · deleteThread · startNewThread · fetchMoreThreads"],
              ["Hand off", "the selected id goes to <CopilotChat threadId={…}>"],
            ]}
          />
        </div>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Say hello, then press Rename on the row that appears",
              "then New conversation, say hello again, and click back to the first row",
            ]}
            expect='The row is renamed to "Renamed" without a reload; New conversation clears the chat to a welcome screen; clicking the first row replays its messages. Archive greys the row, Delete removes it.'
            fail="The list stays empty while chat works — the runtime is in SSE mode and its in-memory runner is not persisting threads. Check the home page's Intelligence row."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/headless-threads/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="warn" title='"New conversation" needs two steps, and the second one is not obvious'>
        <p>
          <code>useThreads().startNewThread()</code> clears the list selection and
          nothing else — it never touches the chat&apos;s <code>threadId</code>.
          The prebuilt drawer pairs it with{" "}
          <code>CopilotChatConfigurationValue.startNewThread</code>, which is what
          actually mints a new id.
        </p>
        <p className="mt-2">
          This demo is prop-controlled, so that second setter is unavailable —
          and clearing the prop to <code>undefined</code> is not enough either: an
          unpropped chat falls back to an id minted with <code>useMemo</code> at
          mount, so clearing returns to the <em>same</em> id and the button looks
          dead. Bumping a React <code>key</code> forces the remount that re-runs
          that memo. The Lifecycle page lists that remount behaviour as a footgun;
          here it is the mechanism.
        </p>
      </Callout>

      <Panel title="The page's samples">
        <div className="space-y-4">
          <CodeBlock code={SIDEBAR} filename="ThreadSidebar.tsx" language="tsx" />
          <CodeBlock code={APP} filename="App.tsx" language="tsx" />
          <CodeBlock code={PAGINATION} filename="Pagination" language="tsx" />
        </div>
      </Panel>

      <Panel
        title="The server half"
        description="The page's runtime sample, and this repo's equivalent underneath it."
      >
        <CodeBlock code={SERVER} filename="server.ts — as published" language="ts" />
        <div className="mt-4">
          <SourceCodeGroup
            files={[{ file: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts" }]}
            note={
              <>
                Two departures. <code>identifyUser</code> here reads headers the
                provider sends rather than calling{" "}
                <code>verifyAppSession</code>, which the docs never define — a
                local harness has no session to verify. And the runtime is built
                in two shapes, because without an{" "}
                <code>CPK_INTELLIGENCE_API_KEY</code> the options union does not
                accept <code>intelligence</code> at all.
              </>
            }
          />
        </div>
      </Panel>

      <Panel
        title="Thread locks"
        description="Documented on this page as of 2026-09-04. The options were already in its code sample; the table explaining them is new."
      >
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Starting a run takes a lock on its thread, so a second run cannot begin
          on the same thread while the first is streaming. Three options tune it,
          and this repo&apos;s runtime now sets all three explicitly — at their
          own defaults, so the names stay typechecked rather than sitting in a
          comment.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              [
                "lockTtlSeconds",
                "How long the lock survives without renewal. Default 20, max 3600 (1 hour).",
              ],
              [
                "lockHeartbeatIntervalSeconds",
                "How often a live run renews it. Default 15, max 3000 (50 minutes).",
              ],
              [
                "lockKeyPrefix",
                "Namespaces the Redis key. No default — worth setting when several apps share one Redis.",
              ],
            ]}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two things the table leaves out, both read off the installed{" "}
          <code>@copilotkit/runtime</code> types rather than the page. The maxima
          are enforced with <code>Math.min</code> and no warning, so{" "}
          <code>lockTtlSeconds: 86400</code> is silently served as{" "}
          <code>3600</code> rather than rejected. And all three are
          Intelligence-only — the SSE branch types them as{" "}
          <code>undefined</code>, so there is no lock to tune when no project key
          is set, which is the state this harness runs in by default.
        </p>
      </Panel>

      <Callout tone="info" title="Not gated by the license token">
        <p>
          Unlike the Threads Drawer, this route talks to the runtime directly, so
          it renders a real list whenever the runtime serves one. That makes it
          the quickest way to tell a locked drawer apart from a broken threads
          setup.
        </p>
        <p className="mt-2">
          This page now states that a managed project is never issued a{" "}
          <code>COPILOTKIT_LICENSE_TOKEN</code> at all — offline and self-hosted
          licensing only, and no substitute for the project key. Read alone that
          looks like it strands the drawer forever, since the drawer gates on
          that token. The Runtime endpoints page&apos;s new{" "}
          <code>runtimeEntitlements</code> section is what resolves it: the token
          is only the fallback, and an active managed subscription reaches{" "}
          <code>&quot;valid&quot;</code> without it. README §9.17.
        </p>
      </Callout>
    </>
  );
}
