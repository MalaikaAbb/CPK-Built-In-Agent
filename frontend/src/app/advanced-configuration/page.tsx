import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const TOOL_CHOICE = `const agent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  toolChoice: "auto",       // Let the model decide (default)
  // toolChoice: "required", // Force the model to call a tool
  // toolChoice: "none",     // Disable tool calling
  // toolChoice: { type: "tool", toolName: "searchDocs" }, // Force a specific tool
});`;

const PROVIDER_OPTIONS = `// OpenAI reasoning models (o3, o4-mini) with reasoning effort
const agent = new BuiltInAgent({
  model: "openai:o3",
  providerOptions: {
    openai: { reasoningEffort: "high" },
  },
});

// Anthropic with adaptive thinking
const agent = new BuiltInAgent({
  model: "anthropic:claude-sonnet-4-6",
  providerOptions: {
    anthropic: { thinking: { type: "adaptive" }, effort: "high" },
  },
});`;

const URL_DOWNLOAD_FACTORY = `import { createSafeUrlDownload } from "@copilotkit/runtime/v2";

factory: (ctx) =>
  streamText({
    // ...
    abortSignal: ctx.abortSignal,
    experimental_download: createSafeUrlDownload({ signal: ctx.abortSignal }),
  }),`;

const OPTIONS: [string, string, string][] = [
  ["model", "string | LanguageModel", "—"],
  ["apiKey", "string", "provider env var"],
  ["maxSteps", "number", "1"],
  ["toolChoice", "\"auto\" | \"required\" | \"none\" | { type, toolName }", "\"auto\""],
  ["prompt", "string", "—"],
  ["tools", "ToolDefinition[]", "[]"],
  ["mcpServers", "MCPClientConfig[]", "[]"],
  ["mcpClients", "MCPClientProvider[]", "[]"],
  ["maxOutputTokens", "number", "—"],
  ["temperature", "number", "—"],
  ["topP / topK", "number", "—"],
  ["presencePenalty / frequencyPenalty", "number", "—"],
  ["stopSequences", "string[]", "—"],
  ["seed", "number", "—"],
  ["maxRetries", "number", "—"],
  ["overridableProperties", "string[]", "[]"],
  ["providerOptions", "Record<string, any>", "—"],
  ["forwardSystemMessages", "boolean", "false"],
  ["forwardDeveloperMessages", "boolean", "false"],
  [
    "urlDownload",
    "\"disabled\" | SafeUrlDownloadOptions | Experimental_DownloadFunction",
    "public addresses only",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/advanced-configuration" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Everything you can hand <code>BuiltInAgent</code> beyond a model. Most
          of it is ordinary generation config, but two options change how the agent
          behaves rather than how it writes: <code>maxSteps</code>, which is the
          difference between a tool call ending the run and the agent speaking
          afterwards, and <code>overridableProperties</code>, which is the only
          thing that lets a browser change the agent&apos;s configuration per run.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Do you sell replacement widgets?  (No overrides)",
              "the same question with Override prompt selected",
              "the same question with the maxOutputTokens preset",
            ]}
            expect="Preset 1 answers as an Acme Corp support agent. Preset 2 answers in pirate dialect — a whitelisted override took effect. Preset 3 answers normally at full length: maxOutputTokens is not on the whitelist, so it was ignored rather than rejected."
            fail="Preset 2 reads the same as preset 1 (overridableProperties is not being honoured), or preset 3 truncates after a few words (the whitelist is not being enforced)."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/advanced-configuration/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent this route drives"
        description="Every field is from the page's samples, collected onto one instance."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/agents.ts", region: "advanced-agent" },
          ]}
        />
      </Panel>

      <Panel title="Full option reference">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Option</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 font-medium">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {OPTIONS.map(([name, type, def]) => (
                <tr key={name} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {name}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {type}
                  </td>
                  <td className="py-2 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {def}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Samples not exercised above">
        <div className="space-y-4">
          <CodeBlock
            code={URL_DOWNLOAD_FACTORY}
            filename="URL attachments in AI SDK factory mode — as published (urlDownload does not apply there and throws if set)"
            language="ts"
          />
          <CodeBlock code={TOOL_CHOICE} filename="Tool choice" language="ts" />
          <CodeBlock
            code={PROVIDER_OPTIONS}
            filename="Provider-specific options"
            language="ts"
          />
        </div>
      </Panel>

      <Callout tone="warn" title="overridableProperties is a security boundary">
        <p>
          <code>forwardedProps</code> comes from the browser. Without a whitelist
          none of it is honoured; with one, exactly the named properties are. Adding{" "}
          <code>&quot;model&quot;</code> to that list — as the page&apos;s sample
          does, and as this repo&apos;s agent does — means a client can pick which
          model your key pays for. Worth being deliberate about.
        </p>
        <p className="mt-2">
          The override path also silently drops values of the wrong type: a
          non-numeric <code>temperature</code> is ignored rather than rejected, so
          a typo looks like the feature not working.
        </p>
        <p className="mt-2">
          <strong>The docs half-caught up on 2026-09-04.</strong>{" "}
          <a
            href="/backend/custom-agent"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Use any model router
          </a>{" "}
          rewrote its <code>forwardedProps</code> samples to allowlist a single
          model id and bound <code>temperature</code> to <code>0..1</code>, under
          a new rule: never use browser-controlled properties for unrestricted
          model and provider selection. That is the same capability this option
          grants, reached through a different door — but{" "}
          <em>this</em> page was not rewritten. It still publishes{" "}
          <code>
            [&quot;model&quot;, &quot;temperature&quot;, &quot;prompt&quot;]
          </code>{" "}
          with no caveat and lists thirteen overridable properties, including{" "}
          <code>providerOptions</code>. This repo keeps the published array so
          the route still matches the page. README §9.25.
        </p>
      </Callout>

      <Callout tone="info" title="urlDownload, added to the page since the last sync">
        <p>
          When a message carries an image or file by URL that the model cannot
          take directly, the server downloads it. The agent above carries the
          page&apos;s sample verbatim: downloads only from{" "}
          <code>cdn.example.com</code> and subdomains of{" "}
          <code>example-uploads.com</code>, capped at 10 MiB. Any other URL
          attachment is refused with a short client error and a{" "}
          <code>[BuiltInAgent]</code> line in the server log; invalid options
          throw when the agent is constructed, i.e. at dev-server start.
        </p>
        <p className="mt-2">
          This route sends text only, so the restriction is inert here; it is
          on the agent so the option is type-checked against the installed
          runtime.
        </p>
      </Callout>

      <Callout tone="info" title="mcpServers and mcpClients live on the MCP Servers route">
        The option list includes <code>mcpServers</code> and{" "}
        <code>mcpClients</code>. They are exercised on{" "}
        <a href="/mcp-servers" className="text-[var(--accent)] underline underline-offset-4">
          MCP Servers
        </a>
        , not on this agent.
      </Callout>
    </>
  );
}
