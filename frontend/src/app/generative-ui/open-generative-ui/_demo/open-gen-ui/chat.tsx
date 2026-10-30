"use client";

/**
 * Repo-authored stand-in: `./chat` is imported by the page's Code tab but not
 * published. A bare `<CopilotChat />`; it talks to whichever agent the
 * surrounding `<CopilotKit agent=…>` names, and the A2UI activity renderer the
 * provider registers paints the surfaces inside it.
 */
import { CopilotChat } from "@copilotkit/react-core/v2";

export function Chat() {
  return <CopilotChat className="h-full" />;
}
