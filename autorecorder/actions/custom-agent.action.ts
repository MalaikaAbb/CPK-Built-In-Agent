import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import {
  getAssistantMessageCount,
  promptsFor,
  sendPrompt,
  waitForAgentResponseCompletion,
} from '../core/actions';
import { waitForDomSettled } from './page-ready';

/**
 * Both factory modes, each actually asked something.
 *
 * `aiSdkAgent` returns a `fullStream` from `streamText`, `tanStackAgent` returns
 * an async iterable from TanStack's `chat()`, and the page's point is that from
 * the browser the two are indistinguishable -- both arrive as the same AG-UI
 * event stream. Driving only the tab selected on load recorded exactly half of
 * that, and would have passed with the TanStack factory completely broken.
 *
 * As on the other switcher pages there is no `key` prop, so swapping tabs does
 * not remount the chat and each factory keeps its own transcript. Coming back to
 * the first tab at the end checks that rather than assuming it.
 */
const MODES = [
  { tab: 'AI SDK', agentId: 'aiSdkAgent' },
  { tab: 'TanStack AI', agentId: 'tanStackAgent' },
] as const;

async function selectMode(page: Page, tab: string): Promise<void> {
  const button = page.locator(`button:text-is("${tab}")`).first();
  await button.waitFor({ state: 'visible', timeout: 10000 });
  const box = await button.boundingBox();
  if (box) {
    await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await humanClick(page);
  } else {
    await button.click();
  }
  await sleep(400);
  await waitForDomSettled(page, { settleMs: 800 });
}

export const runCustomAgentAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  const prompts = promptsFor(config);

  for (let i = 0; i < MODES.length; i++) {
    const { tab, agentId } = MODES[i];
    console.log(`   [Use any model router] ${i + 1}/${MODES.length}: ${tab} (${agentId})...`);

    // The first mode is already selected on load; only later ones need a click.
    if (i > 0) await selectMode(page, tab);

    const prompt = prompts[i] ?? prompts[prompts.length - 1];
    const msgCount = await sendPrompt(page, prompt, { timeoutMs: i === 0 ? 12000 : 8000 });
    await waitForAgentResponseCompletion(
      page,
      config.waitAfterPromptMs ?? 2500,
      msgCount,
    );
  }

  // Back to the first factory: its transcript should still be there.
  console.log(`   [Use any model router] Back to "${MODES[0].tab}" -- transcript still there?`);
  await selectMode(page, MODES[0].tab);
  await sleep(800);

  const kept = await getAssistantMessageCount(page);
  if (kept === 0) {
    throw new Error(
      `Switching back to "${MODES[0].tab}" showed an empty transcript: the ` +
        'per-agent message history did not survive the tab swap.',
    );
  }
  console.log(`   ✅ "${MODES[0].tab}" still shows ${kept} assistant message(s).`);

  await humanGlide(page, 960, 400, 22);
  await sleep(1800);
};
