import "server-only";

import { createBuiltInAgent } from "./tanstack-factory";

/**
 * Sub-agents — the supervisor the page's demo talks to as `agent="subagents"`.
 *
 * The page's Code tab registers it as
 * `subagents: createBuiltInAgent({ systemPrompt: SUBAGENTS_PROMPT })`.
 * `SUBAGENTS_PROMPT` lives in `@/lib/factory/demo-prompts`, which the page
 * never publishes, so the agent here runs with no supervisor prompt: the model
 * sees only the three `<role>_agent` tools and their descriptions, and
 * delegates when the request makes delegation the obvious move. The factory's
 * `systemPrompt` option is opt-in, so omitting it is the factory's own default.
 */
//#region subagents-agent
export const subagentsAgent = createBuiltInAgent();
//#endregion
