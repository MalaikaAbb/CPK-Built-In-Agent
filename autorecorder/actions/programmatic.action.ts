import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { waitForAgentResponseCompletion } from '../core/actions';
import { fillAndRun } from './panel-run';
import { waitForDomSettled } from './page-ready';

/**
 * The page with no chat component at all: `useAgent` + `useCopilotKit`, a draft
 * box, and a "Run Agent" button that calls `copilotkit.runAgent` directly.
 *
 * Three things here are page-specific, and each of them broke a previous
 * version of this handler:
 *
 * - **The draft box has no placeholder.** It is the only `<input>` the demo
 *   renders, so that is what it is matched on, and it arrives pre-populated so
 *   it has to be cleared.
 * - **Submitting means clicking, not pressing Enter.** Hence `fillAndRun`
 *   rather than `sendPrompt`; see that file for why the difference matters.
 * - **The transcript is hand-rolled.** No CopilotKit message classes exist on
 *   this page, so the shared response detector needs the page's own markup:
 *   assistant rows are the `.mr-8` paragraphs inside `.messages`, the user's are
 *   `.ml-8`. Pointed at the default selector it waits for a class that never
 *   appears and reports that the agent never answered.
 */

/** The draft box: the only input the demo renders, and it carries no placeholder. */
const DRAFT_INPUT = 'input';

/** `copilotkit.runAgent`, which is the whole point of the page. */
const RUN_BUTTON = 'button:has-text("Run Agent")';

/** Assistant rows in the page's own transcript. */
const TRANSCRIPT_ASSISTANT = '.messages p.mr-8';

export const runProgrammaticAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  // The shared pre-flight watches for a chat input this page does not have, so
  // it can hand over early. Wait for the button itself instead.
  await page.locator(RUN_BUTTON).first().waitFor({ state: 'visible', timeout: 20000 });
  await waitForDomSettled(page, { settleMs: 600 });

  console.log(`   [Programmatic Control] 1/2: writing user_theme via "Dark Mode"...`);
  const darkModeBtn = page.locator('button:text-is("Dark Mode")').first();
  if (await darkModeBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    const dmBox = await darkModeBtn.boundingBox();
    if (dmBox) {
      await humanGlide(page, dmBox.x + dmBox.width / 2, dmBox.y + dmBox.height / 2, 20);
      await humanClick(page);
      await sleep(1200);
    }
    // Rest on the raw agent.state pane -- `agent.setState` is only visible there.
    const stateBox = await page.locator('pre').first().boundingBox().catch(() => null);
    if (stateBox) {
      await humanGlide(page, stateBox.x + Math.min(stateBox.width / 2, 200), stateBox.y + 40, 20);
      await sleep(1500);
    }
  }

  console.log(`   [Programmatic Control] 2/2: filling the draft and clicking "Run Agent"...`);
  const before = await fillAndRun(page, {
    inputSelector: DRAFT_INPUT,
    buttonSelector: RUN_BUTTON,
    text: config.prompt,
    messageSelector: TRANSCRIPT_ASSISTANT,
    timeoutMs: 12000,
  });

  console.log(`   Waiting for the run to stream into the page's own transcript...`);
  await waitForAgentResponseCompletion(
    page,
    config.waitAfterPromptMs ?? 3000,
    before,
    TRANSCRIPT_ASSISTANT,
  );

  // The subscriber log is the other half of the page: onRunStartedEvent ->
  // onStateChanged -> onRunFinalized should all be listed by now.
  console.log(`   Resting on the subscriber callback log...`);
  const eBox = await page
    .locator('h2:text-is("Subscriber callbacks")')
    .first()
    .boundingBox()
    .catch(() => null);
  if (eBox) {
    await humanGlide(page, eBox.x + 60, eBox.y + 60, 22);
  } else {
    await humanGlide(page, 420, 620, 22);
  }
  await sleep(2000);
};
