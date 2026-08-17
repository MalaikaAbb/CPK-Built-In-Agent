# Tool Rendering

> Render your agent's tool calls with custom UI components.


<IframeSwitcher
  id="backend-tools-example"
  exampleUrl={`https://feature-viewer.copilotkit.ai/${props.framework || "langgraph"}/feature/backend_tool_rendering?sidebar=false&chatDefaultOpen=false`}
  codeUrl={`https://feature-viewer.copilotkit.ai/${props.framework || "langgraph"}/feature/backend_tool_rendering?view=code&sidebar=false&codeLayout=tabs`}
  exampleLabel="Demo"
  codeLabel="Code"
  height="700px"
/>

<Callout>
  This example demonstrates the implementation section applied in the <a href={`https://feature-viewer.copilotkit.ai/${props.framework || "langgraph"}/feature/agentic_chat`} target="_blank">CopilotKit feature viewer</a>.
</Callout>

## What is this?

Tools are a way for the LLM to call predefined, typically, deterministic functions. CopilotKit allows you to render these tools in the UI as a custom component, which we call **Generative UI**.

## When should I use this?

Rendering tools in the UI is useful when you want to provide the user with feedback about what your agent is doing, specifically when your agent is calling tools. CopilotKit allows you to fully customize how these tools are rendered in the chat.

## Render tool calls in your frontend

Use the `useRenderTool` hook to render tool calls in the UI. The name must match the name of the tool defined in your agent.

<Callout type="info" title="Important">
In order to render a tool call in the UI, the name must match the name of the tool. [Learn more](/server-tools).
</Callout>

```tsx title="app/page.tsx"
import { useRenderTool } from "@copilotkit/react-core/v2"; // [!code highlight]
import { z } from "zod";
// ...

const weatherParams = z.object({
  location: z.string().describe("The location to get weather for"),
});

const YourMainContent = () => {
  // ...
  // [!code highlight:14]
  useRenderTool({
    name: "get_weather",
    parameters: weatherParams,
    render: ({ status, parameters }) => {
      return (
        <p className="text-gray-500 mt-2">
          {status !== "complete" && "Calling weather API..."}
          {status === "complete" && `Called the weather API for ${parameters.location}.`}
        </p>
      );
    },
  });
  // ...
}
```

## Default Tool Rendering

`useDefaultRenderTool` provides a catch-all renderer for **any tool** that doesn't have a specific `useRenderToolCall` defined. This is useful for:

- Displaying all tool calls during development
- Rendering MCP (Model Context Protocol) tools
- Providing a generic fallback UI for unexpected tools

```tsx title="app/page.tsx"
import { useDefaultRenderTool } from "@copilotkit/react-core/v2"; // [!code highlight]
// ...

const YourMainContent = () => {
  // ...
  // [!code highlight:15]
  useDefaultRenderTool({
    render: ({ name, args, status, result }) => {
      return (
        <div style={{ color: "black" }}>
          <span>
            {status === "complete" ? "✓" : "⏳"}
            {name}
          </span>
          {status === "complete" && result && (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      );
    },
  });
  // ...
};
```

<Callout type="info">
  Unlike `useRenderToolCall`, which targets a specific tool by name,
  `useDefaultRenderTool` catches **all** tools that don't have a dedicated
  renderer.
</Callout>

<Callout type="info">
  In v2, use [`useDefaultRenderTool`](/reference/v2/hooks/useDefaultRenderTool)
  for wildcard fallback rendering, and
  [`useRenderTool`](/reference/v2/hooks/useRenderTool) for named or wildcard
  renderer registration.
</Callout>
