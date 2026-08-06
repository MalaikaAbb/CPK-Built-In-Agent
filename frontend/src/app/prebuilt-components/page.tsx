import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const STYLING = `<CopilotChat
  input={{
    textArea: "text-blue-500",
    sendButton: "bg-blue-600 hover:bg-blue-700",
  }}
  messageView={{
    assistantMessage: "bg-blue-50 rounded-xl p-2",
    userMessage: "bg-blue-100 rounded-xl",
  }}
/>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The three chat components the page documents, exercised side by side.
          They differ only in how they occupy the page —{" "}
          <code>CopilotChat</code> inline, <code>CopilotSidebar</code> docked,{" "}
          <code>CopilotPopup</code> floating — and all three take the same{" "}
          <code>labels</code> object and the same slot props.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "then switch tabs and ask: what did I just say?"]}
            expect="Each component drives the same agent, and the conversation survives a tab switch — the components share one provider, so they share one thread."
            fail="Switching tabs clears the transcript, or one of the three never connects."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Styling via slots"
        description="The page's Tailwind example. The Slots route takes this much further."
      >
        <CodeBlock code={STYLING} filename="page.tsx" language="tsx" />
      </Panel>

      <Callout tone="info" title="The stylesheet is not optional">
        <code>@copilotkit/react-core/v2/styles.css</code> has to be imported
        once, above these components. This repo imports it in{" "}
        <code>app/layout.tsx</code> next to <code>globals.css</code>; without it
        the components render unstyled rather than failing loudly.
      </Callout>
    </>
  );
}
