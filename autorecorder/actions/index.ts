/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ADAPT THIS DIRECTORY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * What the recorder *does* on each demo page once it is open.
 *
 * The registry lives here rather than in `core/` on purpose: adding or removing
 * a page must never mean editing frozen code. A page with no entry falls back
 * to `runStandardAction` — type the prompt, submit, wait for the reply — which
 * is right for most pages. Write a handler only when a page needs more than
 * that: switching tabs, clicking an approval button, opening a panel.
 *
 * ── How this map was built ─────────────────────────────────────────────────
 * A specialised handler is wired only where this repo's demo page actually
 * contains the DOM that handler drives — the tab labels it clicks, the
 * placeholder it types into, the button it presses. Each entry below was
 * written against that page's own markup rather than adapted from a page that
 * merely looked similar, because a handler pointed at the wrong DOM fails the
 * run. Two handler files are deliberately left unwired — `state-rendering` and
 * `multi-agent-flows` have no route in this repo — and are kept as the closest
 * starting point if one is ever added.
 *
 * A page stays on `runStandardAction` only when typing one prompt into one chat
 * box really is the whole of it. Anything with tabs, a Run button, an approval
 * gate or a panel to press gets a handler: without one those controls are never
 * touched, and the page reports [PASS] with half its surface unexercised.
 *
 * Handlers should build on the helpers in `core/actions.ts`:
 *
 *   sendPrompt(page, prompt, opts)          types and submits, returns the
 *                                           assistant-message count from before
 *                                           submitting
 *   waitForAgentResponseCompletion(...)     waits for the reply to finish, and
 *                                           throws if none ever arrives
 *   promptsFor(config)                      the page's prompts[] , or [prompt]
 *
 * Pass that returned count into waitForAgentResponseCompletion on multi-turn
 * pages, or the previous turn's reply is mistaken for this one's.
 */

import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { runStandardAction } from '../core/actions';
import { type Page } from 'playwright';

import { waitForPageReady } from './page-ready';

import { runAdvancedConfigurationAction } from './advanced-configuration.action';
import { runAgUiAction } from './ag-ui.action';
import { runAuthAction } from './auth.action';
import { runCustomAgentAction } from './custom-agent.action';
import { runDisplayOnlyAction } from './display-only.action';
import { runFrontendToolsAction } from './frontend-tools.action';
import { runHeadlessUiAction } from './headless-ui.action';
import { runInspectorAction } from './inspector.action';
import { runInteractiveAction } from './interactive.action';
import { runModelSelectionAction } from './model-selection.action';
import { runPrebuiltAction } from './prebuilt.action';
import { runProgrammaticAction } from './programmatic.action';
import { runRuntimeAction } from './runtime.action';
import { runRuntimeEndpointsAction } from './runtime-endpoints.action';
import { runSharedStateAction } from './shared-state.action';
import { runSlotsAction } from './slots.action';
import { runToolRenderingAction } from './tool-rendering.action';

/** Keys are page ids from `config/pages.config.ts`. Doctor flags any orphans. */
export const ACTION_MAP: Record<string, PageActionHandler> = {
  "prebuilt-components": runPrebuiltAction,
  "custom-look-and-feel-slots": runSlotsAction,
  "custom-look-and-feel-headless-ui": runHeadlessUiAction,
  "programmatic-control": runProgrammaticAction,
  "inspector": runInspectorAction,
  "generative-ui-your-components-display-only": runDisplayOnlyAction,
  "generative-ui-your-components-interactive": runInteractiveAction,
  "generative-ui-tool-rendering": runToolRenderingAction,
  "frontend-tools": runFrontendToolsAction,
  "shared-state": runSharedStateAction,
  "model-selection": runModelSelectionAction,
  "advanced-configuration": runAdvancedConfigurationAction,
  "backend-copilot-runtime": runRuntimeAction,
  "backend-runtime-endpoints": runRuntimeEndpointsAction,
  "backend-custom-agent": runCustomAgentAction,
  "backend-ag-ui": runAgUiAction,
  "auth": runAuthAction,
};

export async function executePageAction(
  page: Page,
  config: PageRecordConfig,
  rootPath: string,
): Promise<void> {
  // One gate for every page, including the ones that fall through to
  // runStandardAction. The engine waits for the route to respond and for
  // `chatReady` to be visible, but a dev server compiles client chunks lazily,
  // so markup can be on screen before anything is wired to it -- and a prompt
  // typed into an unhydrated input goes nowhere. Handlers that remount a chat
  // mid-run (tab switches) call waitForDomSettled again themselves.
  await waitForPageReady(page, { label: config.id });

  const handler = ACTION_MAP[config.id] ?? runStandardAction;
  await handler(page, config, rootPath);
}
