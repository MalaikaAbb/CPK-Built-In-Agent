import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, KeyValue, Panel, TryIt } from "@/components/ui";

const CUSTOM = `import {
  CopilotRuntime,
  createCopilotEndpoint,
  InMemoryAgentRunner,
  BuiltInAgent,
} from "@copilotkit/runtime/v2";
import { EventType, type BaseEvent } from "@ag-ui/client";

const agent = new BuiltInAgent({
  type: "custom",
  factory: async function* ({ input, abortSignal }) {
    const response = await fetch("https://your-llm-api.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: input.messages }),
      signal: abortSignal,
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const messageId = crypto.randomUUID();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield {
        type: EventType.TEXT_MESSAGE_CHUNK,
        role: "assistant",
        messageId,
        delta: decoder.decode(value),
      } as BaseEvent;
    }
  },
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const copilotEndpoint = createCopilotEndpoint({
  runtime,
  basePath: "/api/copilotkit",
});
export default copilotEndpoint;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/backend/custom-agent" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>BuiltInAgent</code> has two modes. Classic mode — a{" "}
          <code>model</code> plus parameters — is what every other route here
          uses, and the agent owns the model call, the tool loop, MCP, and the
          state tools. Factory mode gives all of that up: you pass{" "}
          <code>type</code> and a <code>factory</code>, and the agent keeps only
          the run lifecycle and the AG-UI event translation.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              ["type: \"aisdk\"", "factory returns anything with a fullStream — e.g. streamText()"],
              ["type: \"tanstack\"", "factory returns an async iterable of TanStack AI chunks"],
              ["type: \"custom\"", "factory is a generator yielding AG-UI BaseEvents directly"],
              ["Context given to the factory", "input · abortSignal · abortController · interrupt"],
            ]}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two of the three modes are live here, one per tab. They differ only in
          what the factory hands back — <code>streamText()</code> returns an
          object with a <code>fullStream</code>, <code>chat()</code> is itself an
          async iterable — and <code>type</code> is what tells the agent which to
          expect.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Write two sentences about tide pools  (then switch tabs and send it again)",
            ]}
            expect="Both tabs stream in exactly as any other route does — the client cannot tell them apart, because both come out as AG-UI events. Each tab keeps its own transcript across switches."
            fail="An immediate run error. The most common cause is the model id inside the factories, which is the doc's hardcoded gpt-4o rather than OPENAI_MODEL, so a key without gpt-4o access fails on this route and nowhere else."
          />
        </div>
      </Panel>

      <Panel
        title="The two live factories"
        description="Both samples from the page, as they run in this repo. Same agent class, same runtime, different router."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/agents.ts", region: "aisdk-agent" },
            { file: "frontend/src/copilotkit/agents.ts", region: "tanstack-agent" },
          ]}
        />
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/backend/custom-agent/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="warn" title="Factory mode silently drops classic-mode config">
        <p>
          The two configs are a union, not a merge —{" "}
          <code>BuiltInAgentClassicConfig | BuiltInAgentFactoryConfig</code>. A
          factory-mode agent has no <code>tools</code>, no <code>prompt</code>, no{" "}
          <code>maxSteps</code>, and no state tools, because the code that would
          have applied them is the code you replaced. Server tools become{" "}
          <code>convertToolsToVercelAITools(input.tools)</code> passed into your
          own <code>streamText</code> call.
        </p>
        <p className="mt-2">
          The page&apos;s samples also mount with{" "}
          <code>createCopilotEndpoint</code> and{" "}
          <code>export default copilotEndpoint</code>, which is a Hono-style
          default export. A Next.js App Router route needs named{" "}
          <code>GET</code>/<code>POST</code> exports instead, which is why this
          repo mounts the same runtime with{" "}
          <code>createCopilotRuntimeHandler</code>.
        </p>
      </Callout>

      <Callout tone="info" title="What convertInputToTanStackAI does that the AI SDK path does not">
        It returns <code>{"{ messages, systemPrompts }"}</code> as two separate
        values, because <code>chat()</code> takes them as separate arguments,
        where <code>convertMessagesToVercelAISDKMessages</code> folds system
        prompts into the single <code>messages</code> array that{" "}
        <code>streamText</code> expects. Same run input, two shapes — which is
        the only real difference between the two factories above.
      </Callout>

      {/* <Panel
        title="The third mode"
        description="Shown as published, not wired: it posts to https://your-llm-api.com/chat, an endpoint that has to be yours."
      >
        <CodeBlock code={CUSTOM} filename="src/copilotkit.ts — raw AG-UI events" language="ts" />
      </Panel> */}
    </>
  );
}
