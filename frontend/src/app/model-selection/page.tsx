import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";
import { MODEL_TABLE } from "@/copilotkit/model";

const PER_PROVIDER = `const agent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
});
const agent = new BuiltInAgent({
  model: "anthropic:claude-sonnet-4-6",
});
const agent = new BuiltInAgent({
  model: "google:gemini-3.8-flash",
});
const agent = new BuiltInAgent({
  model: "minimax:MiniMax-M3",
});`;

const ENV = `# OpenAI
OPENAI_API_KEY=sk-...
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
# Google
GOOGLE_API_KEY=...
# MiniMax
MINIMAX_API_KEY=...
# Optional: use the China endpoint
MINIMAX_BASE_URL=https://api.minimaxi.com/v1`;

const COMPATIBLE_ENV = `OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_API_KEY=gsk_...

OPENAI_BASE_URL=https://my-gateway.example.com/v1
COPILOTKIT_OPENAI_API=responses`;

const CUSTOM_KEY = `const agent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  apiKey: process.env.MY_OPENAI_KEY,
});`;

const CUSTOM_MODEL = `import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createOpenAI } from "@ai-sdk/openai";
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const agent = new BuiltInAgent({
  model: openai("my-fine-tuned-model"),
});`;

const AZURE = `import { createAzure } from "@ai-sdk/azure";
const azure = createAzure({
  resourceName: "my-resource",
  apiKey: process.env.AZURE_API_KEY,
});
const agent = new BuiltInAgent({
  model: azure("my-deployment"),
});`;

const PROVIDER_CHAT = `import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createOpenAI } from "@ai-sdk/openai";
const provider = createOpenAI({
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: "https://api.example-provider.com/v1",
});
const agent = new BuiltInAgent({
  model: provider.chat("provider-model-id"),
});`;

const OPENROUTER = `import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createOpenAI } from "@ai-sdk/openai";
// OpenRouter: one key, hundreds of models behind an OpenAI-compatible API
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});
const agent = new BuiltInAgent({
  model: openrouter.chat("anthropic/claude-sonnet-4-6"),
});`;

export default function Page() {
  const count = MODEL_TABLE.reduce((n, g) => n + g.models.length, 0);

  return (
    <>
      <RouteHeader path="/model-selection" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every specifier in the page&apos;s tables — {count} of them across
          OpenAI, Anthropic, Google, and MiniMax — selectable at run time on a
          single <code>BuiltInAgent</code>. The dropdown&apos;s value goes out
          as the run&apos;s <code>forwardedProps.model</code>; the agent lists{" "}
          <code>model</code> in <code>overridableProperties</code>, so the
          runtime resolves that <code>provider:model</code> string for the run
          and reads the provider&apos;s key from the environment.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Which model and provider are you? Answer in one line.",
              "Write a haiku about tide pools.  (send it once per model)",
            ]}
            expect="Each message runs on whichever model the dropdown shows when you send it, in one continuing conversation. The Inspector's run input shows forwardedProps.model. A provider whose key is missing is marked in the dropdown and the chat says so instead of running."
            fail="A run error naming the model: the id does not exist for that provider, or the key has no access to it. Nothing validates an id until the provider is actually called — that is exactly what this route checks, model by model."
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Self-reported model names are unreliable. The dropdown shows the id
          actually sent; the Inspector&apos;s run payload is the authoritative
          check.
        </p>
      </Panel>

      <Panel
        title="The agent and the model table"
        description='One BuiltInAgent with overridableProperties: ["model"]; the table is every row of the page.'
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/agents.ts", region: "model-selection-agent" },
            { file: "frontend/src/copilotkit/model.ts", region: "model-table" },
          ]}
        />
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/model-selection/demo-chat/page.tsx" },
            { file: "frontend/src/app/model-selection/demo-chat/sections.tsx" },
          ]}
        />
      </Panel>

      <Panel title="As published: one agent per provider, and the keys">
        <div className="space-y-4">
          <CodeBlock code={PER_PROVIDER} filename="Per-provider samples — as published" language="ts" />
          <CodeBlock code={ENV} filename="Environment Variables — as published" language="bash" />
        </div>
      </Panel>

      <Callout tone="warn" title="Run-time model selection, and what the pages say about it">
        <p>
          This page presents the model as fixed on the agent: CopilotKit has no
          hosted endpoint for switching it per request, and its advice is to
          construct the agent you want on your backend. The per-run switch here
          uses the mechanism documented on{" "}
          <a href="/advanced-configuration" className="text-[var(--accent)] underline underline-offset-4">
            Advanced Configuration
          </a>{" "}
          instead — <code>overridableProperties: [&quot;model&quot;]</code> plus a{" "}
          <code>model</code> in <code>forwardedProps</code>.
        </p>
        <p className="mt-2">
          That lets the browser pick any model your keys can reach, which{" "}
          <a href="/backend/custom-agent" className="text-[var(--accent)] underline underline-offset-4">
            Use any model router
          </a>{" "}
          warns against for production. It is used here because this is a local
          test harness and the point is to try every specifier.
        </p>
      </Callout>

      <Panel
        title="Reference only — not run here"
        description="Each needs an endpoint or a key this repo does not have."
      >
        <div className="space-y-4">
          <CodeBlock code={COMPATIBLE_ENV} filename="OpenAI-compatible endpoints — as published" language="bash" />
          <CodeBlock code={CUSTOM_KEY} filename="Explicit apiKey — as published" language="ts" />
          <CodeBlock code={CUSTOM_MODEL} filename="Custom Models (AI SDK) — as published" language="ts" />
          <CodeBlock code={AZURE} filename="Azure — as published (needs @ai-sdk/azure@ai-v6, not installed)" language="ts" />
          <CodeBlock code={PROVIDER_CHAT} filename="provider.chat(model) — as published" language="ts" />
          <CodeBlock code={OPENROUTER} filename="OpenRouter — as published" language="ts" />
        </div>
      </Panel>

      <Callout tone="warn" title="Changed on the page since the last sync">
        <ul className="space-y-1.5">
          <li>
            · OpenAI table gained <code>gpt-5.5</code>, <code>gpt-5.4</code>,{" "}
            <code>gpt-5.4-mini</code>; Anthropic now lists{" "}
            <code>claude-opus-4-8</code> and <code>claude-sonnet-4-6</code>{" "}
            (hyphenated ids — the old dotted-id problem is gone from the page);
            Google moved from Gemini 2.5 to <code>gemini-3.8-flash</code>,{" "}
            <code>gemini-3.5-flash</code>, <code>gemini-3.5-flash-lite</code>{" "}
            and warns that new keys get a 404 on 2.5; a MiniMax section was
            added.
          </li>
          <li>
            · New: <code>OPENAI_BASE_URL</code> with automatic Responses vs
            Chat Completions selection, and <code>COPILOTKIT_OPENAI_API</code>{" "}
            to force it.
          </li>
          <li>
            · Custom models: install <code>@ai-sdk/openai@ai-v6</code>; OpenRouter
            now uses <code>.chat()</code>; the Novita sample is gone.
          </li>
          <li>
            · This repo replaced its per-provider agent trio and the{" "}
            <code>GOOGLE_MODEL</code>/<code>ANTHROPIC_MODEL</code> env vars
            with one agent and the full table.
          </li>
        </ul>
      </Callout>
    </>
  );
}
