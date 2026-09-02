import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { promptsFor, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';

/**
 * `agent.state` written from both ends, in the order that makes the difference
 * legible.
 *
 * The demo seeds `{ todos, userPreferences }` on mount -- the built-in agent
 * only offers itself the AG-UI state tools when a run arrives with a non-empty
 * state object, so the seed is what turns the feature on at all.
 *
 * Three steps, and each proves a different direction:
 *
 * 1. The agent writes. "Add a task..." makes it call the state tool, and the
 *    todo list on the left fills in without the page doing anything.
 * 2. The browser writes. Clicking "Dark Mode" is `agent.setState` straight from
 *    React -- no run, no agent involvement, just the readout flipping.
 * 3. The agent reads that back. Asking which theme is selected can only be
 *    answered from state the button wrote a moment earlier, which is the half a
 *    prompt-only recording never showed.
 */

/** The `Current: <theme>` readout under the Settings heading. */
const THEME_READOUT = 'p:has-text("Current:")';

/** The seeded + agent-written todo list. */
const TODO_LIST = 'h2:text-is("My Todos")';

async function restOn(page: Page, selector: string, fallback: [number, number]): Promise<void> {
  const box = await page.locator(selector).first().boundingBox().catch(() => null);
  if (box) {
    await humanGlide(page, box.x + Math.min(box.width / 2, 220), box.y + box.height / 2, 22);
  } else {
    await humanGlide(page, fallback[0], fallback[1], 22);
  }
  await sleep(2000);
}

export const runSharedStateAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  const prompts = promptsFor(config);

  // ── 1. The agent writes state ─────────────────────────────────────────────
  console.log(`   [Shared State] 1/3: "${prompts[0]}" -- the agent writes agent.state...`);
  const firstCount = await sendPrompt(page, prompts[0], { timeoutMs: 12000 });
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 3000, firstCount);

  console.log(`   Showing the todo list the agent just wrote into...`);
  await restOn(page, TODO_LIST, [300, 200]);

  // ── 2. The browser writes state ───────────────────────────────────────────
  console.log(`   [Shared State] 2/3: clicking "Dark Mode" -- agent.setState from React...`);
  const darkMode = page.locator('button:text-is("Dark Mode")').first();
  await darkMode.waitFor({ state: 'visible', timeout: 10000 });
  const dBox = await darkMode.boundingBox();
  if (dBox) {
    await humanGlide(page, dBox.x + dBox.width / 2, dBox.y + dBox.height / 2, 20);
    await humanClick(page);
  } else {
    await darkMode.click();
  }
  await sleep(1000);

  // The readout is the cheap confirmation; the raw pane below it is the proof.
  const theme = await page
    .locator(THEME_READOUT)
    .first()
    .textContent()
    .catch(() => null);
  if (!theme?.toLowerCase().includes('dark')) {
    throw new Error(
      `Clicking "Dark Mode" did not update agent.state: the readout still says ` +
        `"${(theme ?? '').trim()}".`,
    );
  }
  console.log(`   ✅ ${theme.trim()}`);
  await restOn(page, THEME_READOUT, [300, 420]);
  await restOn(page, 'pre', [300, 560]);

  // ── 3. The agent reads it back ────────────────────────────────────────────
  const followUp = prompts[1] ?? 'Which theme is currently selected?';
  console.log(`   [Shared State] 3/3: "${followUp}" -- the agent reads the new state...`);
  const secondCount = await sendPrompt(page, followUp, { timeoutMs: 8000 });
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 3000, secondCount);

  await restOn(page, 'pre', [300, 560]);
};
