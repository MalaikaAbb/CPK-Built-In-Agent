import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { sendPrompt, waitForAgentResponseCompletion } from '../core/actions';

/**
 * The approval gate from the Interactive doc page.
 *
 * `useHumanInTheLoop` registers `humanApprovedCommand` with a `render` and no
 * handler. The run suspends on the tool call and stays suspended until
 * `respond` fires, so clicking Approve is not decoration -- nothing further
 * streams until it happens, and the string the button sends becomes the tool
 * result the model reads next. Without the click this page records a chat that
 * simply stops.
 *
 * The demo's `render` emits `<pre>{args.command}</pre>` and two bare buttons and
 * nothing else -- no heading, no card text -- so the buttons themselves are the
 * only thing worth matching on. Their labels are hard-coded by the page rather
 * than invented by the agent, so exact text matching is safe.
 *
 * `status !== "executing"` hides the whole block once `respond` has fired, which
 * is what makes "the Approve button went away" a reliable signal that the run
 * actually resumed.
 */
const COMMAND = 'pre';
const APPROVE = 'button:text-is("Approve")';

export const runInteractiveAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  console.log(`   [Interactive] Prompting to trigger the approval interrupt...`);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });

  console.log(`   Waiting for the approval buttons to render in the message stream...`);
  const approve = page.locator(APPROVE).last();
  await approve.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});

  if (!(await approve.isVisible({ timeout: 3000 }).catch(() => false))) {
    // The run is paused waiting for `respond`, so nothing further will ever
    // stream. Failing here is the honest outcome -- the interrupt is the page.
    throw new Error(
      'Approval gate never rendered: no "Approve" button appeared within 30s. ' +
        'Either the agent answered in plain text instead of calling ' +
        'humanApprovedCommand, or the `status !== "executing"` guard is hiding ' +
        'the block.',
    );
  }

  // Let the proposed command sit on screen long enough to read before deciding.
  const cmdBox = await page.locator(COMMAND).last().boundingBox().catch(() => null);
  if (cmdBox) {
    await humanGlide(page, cmdBox.x + Math.min(cmdBox.width / 2, 200), cmdBox.y + cmdBox.height / 2, 22);
  }
  await sleep(2500);

  console.log(`   🎯 Approving the command...`);
  const box = await approve.boundingBox();
  if (box) {
    await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await sleep(600);
    await humanClick(page);
  } else {
    await approve.click();
  }

  // The buttons disappearing is `respond` having fired and the run having
  // resumed. If they are still there, the click did not take and everything
  // after this would be waiting on a run that is still suspended.
  const resumed = await approve
    .waitFor({ state: 'hidden', timeout: 20000 })
    .then(() => true)
    .catch(() => false);
  if (!resumed) {
    throw new Error(
      'Clicking "Approve" did not resume the run: the approval block is still ' +
        'showing, so `respond` never fired.',
    );
  }
  console.log(`   ✅ respond() fired -- the run resumed.`);

  // Baseline 0 rather than msgCount: the resumed reply can land in the same
  // assistant message that carried the tool call, and demanding a brand new one
  // would then wait forever for a message that is never created.
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, 0);
};
