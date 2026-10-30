"use client";

// Verbatim from the Threads Drawer page, "Use the Drawer with a sidebar chat"
// (published as app/page.tsx). Only `YourMainContent` is not from the page.
import {
  CopilotKitProvider,
  CopilotChatConfigurationProvider,
  CopilotSidebar,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

// Repo-authored scaffolding: `YourMainContent` is used by the page but not
// defined on it.
function YourMainContent() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Your main content</h2>
      <p>The sidebar chat is docked on the right; the Drawer is on the left.</p>
    </div>
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
          <main style={{ flex: 1 }}>
            <YourMainContent />
            <CopilotSidebar defaultOpen={true} />
          </main>
        </div>
      </CopilotChatConfigurationProvider>
    </CopilotKitProvider>
  );
}
