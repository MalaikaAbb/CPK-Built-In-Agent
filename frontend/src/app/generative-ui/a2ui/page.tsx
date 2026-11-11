import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

/**
 * The A2UI overview page. Reference route: both samples are shown as published
 * and not mounted, because each refers to a value the page never defines
 * (`myAgent` on the server, `children` in the provider snippet). The runtime
 * `a2ui` option and the provider's `a2ui` prop already run on the two A2UI
 * sub-routes.
 */

const RUNTIME = `import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {},
});

// Single-route: only POST needed, no catch-all [...path] required
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
  mode: "single-route",
});

export { handler as POST };`;

const THEME = `import { CopilotKit, type A2UITheme } from "@copilotkit/react-core/v2";

// Your own theme object — the renderer reads the keys it understands.
// Leave the \`a2ui\` prop off entirely to keep the built-in theme.
const myCustomTheme: A2UITheme = {
  // ...your theme keys
};

<CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ theme: myCustomTheme }}>
  {children}
</CopilotKit>;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui" />

      <Panel title="What it covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The entry page for A2UI, Google&apos;s JSON-lines spec for UI that an
          agent describes and the client draws. CopilotKit needs one switch on
          each side: <code>a2ui: {"{}"}</code> on <code>CopilotRuntime</code>{" "}
          wraps every registered agent (or the ones listed in{" "}
          <code>a2ui.agents</code>) in the A2UI middleware, and the React
          renderer then turns any A2UI output in the stream into a surface in
          the chat. The <code>a2ui</code> prop on <code>&lt;CopilotKit&gt;</code>{" "}
          is optional and only replaces the default theme.
        </p>
      </Panel>

      <Panel
        title="As published"
        description="Rendered for the built-in agent on 2026-11-11. Shown, not mounted."
      >
        <div className="space-y-4">
          <CodeBlock code={RUNTIME} filename="app/api/copilotkit/route.ts" language="ts" />
          <CodeBlock code={THEME} filename="Optional custom theme" language="tsx" />
        </div>
      </Panel>

      <Callout tone="warn" title="Why this route has no demo">
        <p>
          The runtime sample registers <code>myAgent</code>, and the theme
          sample wraps <code>{"{children}"}</code>. The page defines neither.
          It also doesn&apos;t say how the agent produces A2UI: with{" "}
          <code>a2ui: {"{}"}</code> and no catalog on the provider, the
          installed runtime (1.83) does not inject an A2UI tool, so a plain{" "}
          <code>BuiltInAgent</code> in its place would just reply in text.
          This repo doesn&apos;t fill that gap here. README §9.53.
        </p>
        <p className="mt-2">
          The same two switches run on the sub-routes:{" "}
          <a
            href="/generative-ui/a2ui/dynamic-schema"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Dynamic Schema A2UI
          </a>{" "}
          (runtime <code>a2ui</code> with tool injection, catalog on the
          provider) and{" "}
          <a
            href="/generative-ui/a2ui/fixed-schema"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Fixed Schema A2UI
          </a>{" "}
          (runtime <code>a2ui</code>, an agent tool that returns A2UI
          operations). The theme prop isn&apos;t exercised anywhere.
        </p>
      </Callout>
    </>
  );
}
