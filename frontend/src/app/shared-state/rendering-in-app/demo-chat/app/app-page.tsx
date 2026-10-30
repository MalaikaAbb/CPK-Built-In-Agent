// The page's app/page.tsx, unchanged. Renamed so Next.js does not mount it as
// a route of its own; the folder layout keeps its `../components/Canvas`
// import resolving exactly as published.
import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
import { Canvas } from "../components/Canvas";

export default function Page() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="app-shell">
        {/* Your app UI, driven by agent.state */}
        <Canvas />
        {/* Chat is just another consumer of the same agent */}
        <CopilotSidebar />
      </div>
    </CopilotKit>
  );
}
