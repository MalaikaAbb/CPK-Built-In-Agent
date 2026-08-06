import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, KeyValue, Panel, TryIt } from "@/components/ui";

const BASIC = `const agent = new BuiltInAgent({
  model: "openai:gpt-4.1",
});`;

const CUSTOM_KEY = `const agent = new BuiltInAgent({
  model: "openai:gpt-4.1",
  apiKey: process.env.MY_OPENAI_KEY,
});`;

const CUSTOM_PROVIDER = `import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createOpenAI } from "@ai-sdk/openai";

const customProvider = createOpenAI({
  apiKey: process.env.MY_API_KEY,
  baseURL: "https://my-proxy.example.com/v1",
});

const agent = new BuiltInAgent({
  model: customProvider("my-fine-tuned-model"),
});`;

const AZURE = `import { createAzure } from "@ai-sdk/azure";

const azure = createAzure({
  resourceName: "my-resource",
  apiKey: process.env.AZURE_API_KEY,
});

const agent = new BuiltInAgent({
  model: azure("my-deployment"),
});`;

const OPENROUTER = `import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const agent = new BuiltInAgent({
  model: openrouter("anthropic/claude-sonnet-4-5"),
});`;

const PROVIDERS: [string, string, string, string][] = [
  [
    "OpenAI",
    "OPENAI_API_KEY",
    "gpt-5 · gpt-5-mini · gpt-4.1 · gpt-4.1-mini · gpt-4.1-nano · gpt-4o · gpt-4o-mini · o3 · o3-mini · o4-mini",
    "Live — Agent A (openAiAgent)",
  ],
  [
    "Google",
    "GOOGLE_API_KEY",
    "gemini-2.5-pro · gemini-2.5-flash · gemini-2.5-flash-lite",
    "Live — Agent B (googleAgent)",
  ],
  [
    "Anthropic",
    "ANTHROPIC_API_KEY",
    "claude-sonnet-4-5 · claude-opus-4-5 · claude-haiku-4-5  (hyphens, not dots — see below)",
    "Live — Agent C (anthropicAgent)",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/model-selection" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Which model the built-in agent calls, and how little it takes to change
          it. The demo is <strong>three agents in three tabs</strong>, one per
          provider — the same <code>BuiltInAgent</code> construction and the same{" "}
          <code>CopilotChat</code> in each, differing only in the prefix on the
          model string and which key that agent reads. Nothing about the chat, the
          runtime, or the AG-UI stream changes with the provider.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              [
                "Agent A · OpenAI",
                <>
                  <code>openAiAgent</code> · <code>openai:gpt-4.1</code> ·{" "}
                  <code>OPENAI_API_KEY</code>
                </>,
              ],
              [
                "Agent B · Google",
                <>
                  <code>googleAgent</code> · <code>google:gemini-2.5-flash</code>{" "}
                  · <code>GOOGLE_API_KEY</code>
                </>,
              ],
              [
                "Agent C · Anthropic",
                <>
                  <code>anthropicAgent</code> ·{" "}
                  <code>anthropic:claude-sonnet-4-5</code> ·{" "}
                  <code>ANTHROPIC_API_KEY</code>
                </>,
              ],
            ]}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Each id is overridable — <code>OPENAI_MODEL</code>,{" "}
          <code>GOOGLE_MODEL</code>, <code>ANTHROPIC_MODEL</code> — and both{" "}
          <code>provider:model</code> and <code>provider/model</code> parse. Above
          those three there are two further levels of control the page documents
          but the tabs do not need: an explicit <code>apiKey</code> instead of the
          environment fallback, and an AI SDK provider instance, which is how you
          reach a proxy, a fine-tune, Azure, or OpenRouter.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Which model and provider are you? Answer in one line.",
              "Write a haiku about tide pools.  (send it once in each tab)",
            ]}
            expect="Each tab answers independently and names its own provider, and its transcript is still there when you switch away and back. A tab whose key is missing says so up front instead of offering a chat."
            fail="A run error naming the model — the id does not exist, or the key in that tab's env var has no access to it. Nothing validates the id until the provider is actually called."
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Take the self-reported model name with salt: models are unreliable
          narrators about their own version, and answers like &ldquo;GPT-4o&rdquo;
          or &ldquo;Claude 3.5 Sonnet&rdquo; are common even when the request went
          out with a different id. What the tab header shows is the id actually
          sent; the Inspector&apos;s run payload is the authoritative check.
        </p>
      </Panel>

      <Panel
        title="The three agents"
        description="Agent A, B, and C. apiKey is passed explicitly — resolveModel would fall back to the same env vars anyway, but being explicit is what makes the per-provider wiring visible."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/agents.ts", region: "model-selection-agents" },
            { file: "frontend/src/copilotkit/model.ts" },
          ]}
        />
      </Panel>

      <Panel
        title="The demo"
        description="A server component, so it can report which keys are set without ever sending their values to the browser — only the boolean crosses the boundary."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/model-selection/demo-chat/page.tsx" },
            { file: "frontend/src/app/model-selection/demo-chat/sections.tsx" },
          ]}
        />
      </Panel>

      <Panel title="Providers, keys, and what is live here">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Provider</th>
                <th className="pb-2 pr-4 font-medium">Env var</th>
                <th className="pb-2 pr-4 font-medium">Models</th>
                <th className="pb-2 font-medium">In this repo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PROVIDERS.map(([name, env, models, status]) => (
                <tr key={name} className="align-top">
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {name}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {env}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {models}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
