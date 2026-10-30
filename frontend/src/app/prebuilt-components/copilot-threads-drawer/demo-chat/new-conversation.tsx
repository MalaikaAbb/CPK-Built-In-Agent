"use client";

// Verbatim from the Threads Drawer page, "Add your own 'New conversation'
// button" (published as app/page.tsx).
import {
  CopilotKitProvider,
  CopilotChatConfigurationProvider,
  CopilotChat,
  CopilotThreadsDrawer,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

function NewConversationButton() {
  const configuration = useCopilotChatConfiguration();

  return (
    <button
      type="button"
      onClick={() => configuration?.startNewThread()}
    >
      New conversation
    </button>
  );
}

export default function Page() {
  return (
    // Harness edit: published as runtimeUrl="/api/copilotkit". Intelligence
    // lives on its own runtime here, used only by the two Threads routes.
    <CopilotKitProvider runtimeUrl="/api/copilotkit-threads">
      <CopilotChatConfigurationProvider>
        <div style={{ display: "flex", height: "100dvh" }}>
          <CopilotThreadsDrawer />
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <header>
              <NewConversationButton />
            </header>
            <CopilotChat />
          </main>
        </div>
      </CopilotChatConfigurationProvider>
    </CopilotKitProvider>
  );
}
