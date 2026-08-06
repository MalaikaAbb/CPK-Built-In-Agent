import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const NESTED = `// Two levels deep
<CopilotChat
  messageView={{
    assistantMessage: {
      toolbar: CustomToolbar,
      copyButton: CustomCopyButton,
    },
    userMessage: CustomUserMessage,
  }}
/>

// Three levels deep
<CopilotChat
  messageView={{
    assistantMessage: {
      copyButton: ({ onClick }) => <button onClick={onClick}>Copy</button>,
    },
  }}
/>

// Input sub-slots
<CopilotChat
  input={{
    textArea: CustomTextArea,
    sendButton: CustomSendButton,
  }}
/>

// Scroll view sub-slots
<CopilotChat
  scrollView={{
    feather: CustomFeather,
    scrollToBottomButton: CustomScrollButton,
  }}
/>

// Suggestion view sub-slots
<CopilotChat
  suggestionView={{
    suggestion: CustomSuggestionPill,
    container: CustomSuggestionContainer,
  }}
/>`;

const SLOTS: [string, string][] = [
  ["messageView", "assistantMessage · userMessage · reasoningMessage · cursor"],
  ["scrollView", "feather · scrollToBottomButton"],
  [
    "input",
    "textArea · sendButton · addMenuButton · startTranscribeButton · cancelTranscribeButton · finishTranscribeButton · audioRecorder · disclaimer",
  ],
  ["suggestionView", "suggestion · container"],
  ["welcomeScreen", "welcomeMessage"],
  ["header", "titleContent · closeButton  (Sidebar / Popup only)"],
  ["toggleButton", "openIcon · closeIcon  (Sidebar / Popup only)"],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/slots" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every part of the chat is a named slot, and each slot accepts three
          shapes of value: a class string that merges, an object that sets props
          on the default component, or a component that replaces it. A fourth
          level sits outside the slot props — a children render function, where
          you receive the rendered slots and place them yourself.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello"]}
            expect="Level 1 tints the message area and outlines the input; level 2 focuses the input on mount; level 3 renders bare left/right-aligned text with no bubbles or toolbars; level 4 shows a 'My Agent' header with the welcome screen and suggestions gone."
            fail="A level looks identical to the previous one, or the chat renders nothing at all."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Nested slots"
        description="Slots nest as deep as the component tree does. Shown as code — the demo above covers the top level."
      >
        <CodeBlock code={NESTED} filename="page.tsx" language="tsx" />
      </Panel>

      <Panel title="Slot reference">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Slot</th>
                <th className="pb-2 font-medium">Sub-slots</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SLOTS.map(([slot, subs]) => (
                <tr key={slot} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {slot}
                  </td>
                  <td className="py-2 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {subs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <code>assistantMessage</code> nests further still —{" "}
          <code>markdownRenderer</code>, <code>toolbar</code>,{" "}
          <code>copyButton</code>, <code>thumbsUpButton</code>,{" "}
          <code>thumbsDownButton</code>, <code>readAloudButton</code>,{" "}
          <code>regenerateButton</code>, <code>toolCallsView</code> — as do{" "}
          <code>userMessage</code> and <code>reasoningMessage</code>.
        </p>
      </Panel>
    </>
  );
}
