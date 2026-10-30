import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DOC_CDN = `<head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <canvas id="myChart"></canvas>
</body>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          No catalog at all: the agent writes the UI itself, as HTML, CSS and
          script, and it runs in a sandboxed iframe in the chat. The runtime&apos;s{" "}
          <code>openGenerativeUI</code> option adds a{" "}
          <code>generateSandboxedUi</code> tool to the run; the factory
          declares the run&apos;s tools to the model so it can call it, and the
          provider&apos;s built-in activity renderer mounts the result. The
          advanced demo also hands the iframe two host functions it can call
          back into.
        </p>
        <div className="mt-4 space-y-4">
          <TryIt
            prompts={["Build an interactive bar chart of monthly signups with Chart.js"]}
            expect="Minimal demo: an iframe appears in the chat and fills in as the tool call streams, ending in a working chart."
            fail="The UI arrives as a raw HTML code block instead of a rendered iframe — the model never saw generateSandboxedUi, i.e. the run's tools were not passed to chat()."
          />
          <TryIt
            prompts={["Calculator (calls evaluateExpression)", "Ping the host (calls notifyHost)"]}
            expect="Advanced demo (the suggestion pills): a calculator or ping UI in the iframe. Using it logs '[open-gen-ui/advanced] evaluateExpression …' or '… notifyHost: …' in the browser console and the iframe shows the returned value."
            fail="The iframe renders but its buttons do nothing and nothing is logged — the sandbox functions did not reach the activity renderer."
          />
        </div>
        <p className="mt-3 text-sm">
          <Link
            href="/generative-ui/open-generative-ui/demo-chat/advanced"
            target="_blank"
            className="font-medium text-[var(--accent)] underline underline-offset-4"
          >
            Open the advanced demo ↗
          </Link>
        </p>
      </Panel>

      <Panel
        title="Minimal setup"
        description="The page's minimal page.tsx with its unpublished design skill commented out, plus a stand-in for ./chat."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/open-generative-ui/_demo/open-gen-ui/demo.tsx" },
            { file: "frontend/src/app/generative-ui/open-generative-ui/_demo/open-gen-ui/chat.tsx" },
          ]}
        />
      </Panel>

      <Panel
        title="Advanced: sandbox functions"
        description="page.tsx, sandbox-functions.ts and suggestions.ts, all published, all unchanged."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/open-generative-ui/_demo/open-gen-ui-advanced/demo.tsx" },
            { file: "frontend/src/app/generative-ui/open-generative-ui/_demo/open-gen-ui-advanced/sandbox-functions.ts" },
            { file: "frontend/src/app/generative-ui/open-generative-ui/_demo/open-gen-ui-advanced/suggestions.ts" },
          ]}
        />
      </Panel>

      <Panel
        title="The agent and its runtime"
        description="One runtime serves both demos; only the frontend differs."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-ogui/[[...slug]]/route.ts" },
            { file: "frontend/src/copilotkit/genui-factories/ogui-factory.ts" },
            { file: "frontend/src/copilotkit/genui-factories/tanstack-factory.ts" },
          ]}
          note={
            <>
              <code>tanstack-factory.ts</code> holds only{" "}
              <code>jsonSchemaToZod</code>, copied from the{" "}
              <code>tanstack-factory.ts</code> published in the{" "}
              <Link href="/generative-ui/tool-based" className="underline underline-offset-4">
                Components as Tools
              </Link>{" "}
              page&apos;s Code tab — the OGUI factory imports it, its own Code tab
              does not include it.
            </>
          }
        />
      </Panel>

      <Panel title="Published on the page, not run here">
        <CodeBlock code={DOC_CDN} filename="Using CDN libraries — as published" language="html" />
      </Panel>

      <Callout tone="warn" title="Gaps and departures">
        <ul className="space-y-1.5">
          <li>
            · <strong>Unpublished design skill.</strong> The minimal page passes{" "}
            <code>openGenerativeUI={"{{ designSkill: VISUALIZATION_DESIGN_SKILL }}"}</code>{" "}
            from <code>./design-skill</code>, whose contents the page never
            prints. Both lines are commented out, not replaced: the minimal demo
            runs on the provider&apos;s default design skill, so the generated
            visuals will not match the page&apos;s embedded demo&apos;s style.
          </li>
          <li>
            · <strong>Showcase infrastructure dropped.</strong>{" "}
            <code>forwardingFetch</code> and{" "}
            <code>DEMO_AGENT_LOOP_STRATEGY</code> (factory) and{" "}
            <code>withForwardedHeaders</code> / <code>withProbeCompat</code>{" "}
            (route) are unpublished aimock plumbing.
          </li>
          <li>
            · <strong><code>./chat</code> stand-in.</strong> The minimal page
            imports a <code>Chat</code> it does not publish; a bare{" "}
            <code>&lt;CopilotChat /&gt;</code> stands in. The advanced page
            defines its own <code>Chat</code> inline and needs none.
          </li>
        </ul>
      </Callout>
    </>
  );
}
