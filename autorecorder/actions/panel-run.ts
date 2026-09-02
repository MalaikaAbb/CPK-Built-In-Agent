/**
 * Driving a demo that has no chat component: a plain input plus a button that
 * calls `copilotkit.runAgent` itself.
 *
 * `sendPrompt` from `core/actions` cannot be used for these. It ends with a
 * swallowed-submit retry -- "if text is still in the box, press Enter" -- which
 * is right for a chat box that clears itself on send, and wrong here: these
 * inputs are controlled React state that survives the run, so the retry always
 * fires, and the click has just left focus on the run button, so Enter presses
 * it a second time and the agent runs twice on one recording.
 *
 * Same human motion as `sendPrompt` otherwise: glide, click, key-by-key typing,
 * glide to the button, click.
 *
 * @returns The count of assistant rows observed before the run started.
 */

import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';

export interface FillAndRunOptions {
  /** The text box to type into. */
  inputSelector: string;
  /** The control that starts the run. */
  buttonSelector: string;
  /** What to type. The box is cleared first -- these arrive pre-populated. */
  text: string;
  /** Rows the response detector counts, so the baseline is read consistently. */
  messageSelector: string;
  /** How long to wait for the input to appear. */
  timeoutMs?: number;
}

export async function fillAndRun(
  page: Page,
  { inputSelector, buttonSelector, text, messageSelector, timeoutMs = 15000 }: FillAndRunOptions,
): Promise<number> {
  const input = page.locator(inputSelector).first();
  await input.waitFor({ state: 'visible', timeout: timeoutMs });
  await sleep(300);

  const before = await page
    .evaluate((sel) => document.querySelectorAll(sel).length, messageSelector)
    .catch(() => 0);

  const inputBox = await input.boundingBox();
  if (inputBox) {
    await humanGlide(page, inputBox.x + 80, inputBox.y + inputBox.height / 2, 18);
    await humanClick(page);
  } else {
    await input.click();
  }
  await sleep(200);

  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(text, { delay: 35 });
  await sleep(300);

  // A React re-render mid-typing can wipe a controlled input; put it back.
  if (!(await input.inputValue().catch(() => ''))) {
    await input.fill(text);
    await sleep(200);
  }

  const button = page.locator(buttonSelector).first();
  await button.waitFor({ state: 'visible', timeout: 8000 });
  const btnBox = await button.boundingBox();
  if (btnBox) {
    await humanGlide(page, btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2, 18);
    await humanClick(page);
  } else {
    await button.click();
  }

  return before;
}
