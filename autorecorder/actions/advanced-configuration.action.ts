import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { promptsFor, waitForAgentResponseCompletion } from '../core/actions';
import { fillAndRun } from './panel-run';
import { waitForDomSettled } from './page-ready';

/**
 * `advancedAgent` run once under every preset the page offers.
 *
 * There is no chat component here: the whole page is constructor config plus
 * `forwardedProps`, so it renders a preset row, one input, a Run button and a
 * hand-rolled transcript. Driving only the preset selected on load recorded the
 * agent answering once and proved nothing about the page, because the page is
 * not "the agent replies" -- it is *which* overrides reach it and which do not.
 *
 * The four presets are the whole argument, and each needs its own run:
 *
 *   No overrides                 the support-desk `prompt` the agent was built
 *                                with, unmodified -- the baseline
 *   Override prompt              whitelisted, so the pirate persona replaces the
 *                                support one for that single run
 *   Override temperature         whitelisted, and deliberately hard to see: the
 *                                point is that it is *accepted*, not that 0.1
 *                                reads differently
 *   Override maxOutputTokens     NOT on `overridableProperties`, so a 12-token
 *                                cap is dropped and the answer comes back full
 *                                length -- the negative case, and the only one
 *                                that can silently regress into working
 *
 * `sendPrompt` cannot be used: its Enter-key retry would re-trigger the focused
 * Run button and run the agent twice per preset. See `panel-run.ts`.
 *
 * The transcript accumulates across presets (nothing remounts), so every run
 * takes its baseline from the rows already on screen and waits for a new one.
 */

/** The only input the demo renders; it arrives pre-populated. */
const RUN_INPUT = 'input';
const RUN_BUTTON = 'button:text-is("Run")';

/** Assistant rows in the page's own transcript. */
const TRANSCRIPT_ASSISTANT = 'div.mr-8';

/** Exact preset labels, in the order the page lists them. */
const PRESETS = [
  'No overrides',
  'Override prompt (whitelisted)',
  'Override temperature (whitelisted)',
  'Override maxOutputTokens (NOT whitelisted)',
] as const;

export const runAdvancedConfigurationAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  await page.locator(RUN_BUTTON).first().waitFor({ state: 'visible', timeout: 20000 });
  await waitForDomSettled(page, { settleMs: 600 });

  const prompts = promptsFor(config);

  for (let i = 0; i < PRESETS.length; i++) {
    const preset = PRESETS[i];
    console.log(`   [Advanced Configuration] ${i + 1}/${PRESETS.length}: "${preset}"...`);

    // The first preset is already selected on load; only later ones need a click.
    if (i > 0) {
      const button = page.locator(`button:text-is("${preset}")`).first();
      await button.waitFor({ state: 'visible', timeout: 10000 });
      const box = await button.boundingBox();
      if (box) {
        await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
        await humanClick(page);
      } else {
        await button.click();
      }
      await sleep(600);
    }

    // Rest on the forwardedProps readout: it is what this run is about to carry,
    // and it is the only place the difference between presets is written down.
    const propsPane = page.locator('pre').first();
    const forwarded = (await propsPane.textContent().catch(() => '')) ?? '';
    console.log(`   ${forwarded.trim()}`);
    const pBox = await propsPane.boundingBox().catch(() => null);
    if (pBox) {
      await humanGlide(page, pBox.x + Math.min(pBox.width / 2, 220), pBox.y + 14, 20);
      await sleep(1600);
    }

    const prompt = prompts[i] ?? prompts[prompts.length - 1];
    const before = await fillAndRun(page, {
      inputSelector: RUN_INPUT,
      buttonSelector: RUN_BUTTON,
      text: prompt,
      messageSelector: TRANSCRIPT_ASSISTANT,
      timeoutMs: 12000,
    });

    await waitForAgentResponseCompletion(
      page,
      config.waitAfterPromptMs ?? 2500,
      before,
      TRANSCRIPT_ASSISTANT,
    );
  }

  await humanGlide(page, 960, 500, 22);
  await sleep(1500);
};
