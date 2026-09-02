import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { promptsFor, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { waitForDomSettled } from './page-ready';

/**
 * One `BuiltInAgent` per provider, asked the same two questions.
 *
 * All three tabs are driven rather than only the one selected on load, because
 * the page's claim is specifically that swapping the `provider:model` prefix is
 * the entire difference -- and a recording of one provider cannot show that. The
 * first question is about the model, so the answer differs per tab; the second
 * is a joke, so what differs is only the voice.
 *
 * Tabs swap `agentId` on one `CopilotChat` without a `key`, so there is no
 * remount: each provider keeps its own transcript and coming back to a tab still
 * shows what it said. That also means the assistant-message count restarts per
 * tab, so every turn reads its baseline fresh.
 *
 * A provider whose key is missing renders an explanation instead of a chat. That
 * is a real gap in the run rather than something to skip quietly, so it fails.
 */
const PROVIDERS = ['OpenAI', 'Google', 'Anthropic'] as const;

export const runModelSelectionAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  const prompts = promptsFor(config);

  for (let i = 0; i < PROVIDERS.length; i++) {
    const provider = PROVIDERS[i];
    console.log(`   [Model Selection] ${i + 1}/${PROVIDERS.length}: ${provider}...`);

    // The first tab is already selected on load; only later ones need a click.
    if (i > 0) {
      const tab = page.locator(`button:has-text("${provider}")`).first();
      await tab.waitFor({ state: 'visible', timeout: 10000 });
      const box = await tab.boundingBox();
      if (box) {
        await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
        await humanClick(page);
      } else {
        await tab.click();
      }
      await sleep(400);
      await waitForDomSettled(page, { settleMs: 800 });
    }

    // Show the model / agentId / key strip before asking anything, so the reply
    // can be read against the configuration that produced it.
    const strip = await page
      .locator('span:has-text("model=")')
      .first()
      .boundingBox()
      .catch(() => null);
    if (strip) {
      await humanGlide(page, strip.x + strip.width / 2, strip.y + strip.height / 2, 20);
      await sleep(1200);
    }

    const noKey = page.locator('p:has-text("is not set")').first();
    if (await noKey.isVisible({ timeout: 1500 }).catch(() => false)) {
      throw new Error(
        `${provider}'s API key is not set, so its tab renders no chat and the ` +
          'provider was never exercised. Set it in frontend/.env.local and ' +
          'restart the dev server.',
      );
    }

    for (const prompt of prompts) {
      const msgCount = await sendPrompt(page, prompt, { timeoutMs: i === 0 ? 12000 : 8000 });
      await waitForAgentResponseCompletion(
        page,
        config.waitAfterPromptMs ?? 2000,
        msgCount,
      );
    }
  }

  await humanGlide(page, 960, 300, 22);
  await sleep(1200);
};
