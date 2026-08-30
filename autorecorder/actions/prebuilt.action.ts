import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { promptsFor, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { waitForDomSettled } from './page-ready';

/**
 * All three prebuilt surfaces, each actually used rather than merely shown.
 *
 * The earlier version only chatted in the first tab and then glided the cursor
 * over the other two, which recorded a sidebar and a popup that were never
 * asked anything -- so a surface whose input was broken still passed. Every tab
 * now sends its own prompt and waits for its own reply.
 *
 * The three components share one provider and one `default` agent, so the
 * transcript carries across the swap: the sidebar opens already showing what was
 * asked in the inline chat. Each turn therefore reads the assistant-message
 * count fresh instead of assuming an empty list.
 *
 * CopilotPopup is the one that needs care. It renders its launcher
 * (`data-testid="copilot-chat-toggle"`) *and*, in this version, opens itself --
 * the toggle reports `data-state="open"` with a live textarea already mounted.
 * The previous handler clicked the launcher unconditionally, which closed the
 * popup it was about to demonstrate. The state attribute is checked first now,
 * so the click happens only when there is really something to open.
 */

const TAB_SELECTORS = [
  null, // CopilotChat is the tab selected on load.
  'button:has-text("CopilotSidebar")',
  'button:has-text("CopilotPopup")',
] as const;

const POPUP_TOGGLE = '[data-testid="copilot-chat-toggle"]';

async function clickAt(page: Page, locatorSelector: string, timeoutMs = 8000): Promise<boolean> {
  const target = page.locator(locatorSelector).first();
  if (!(await target.isVisible({ timeout: timeoutMs }).catch(() => false))) return false;

  const box = await target.boundingBox();
  if (box) {
    await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await humanClick(page);
  } else {
    await target.click();
  }
  return true;
}

export const runPrebuiltAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  const prompts = promptsFor(config);
  const labels = ['CopilotChat', 'CopilotSidebar', 'CopilotPopup'];

  for (let i = 0; i < TAB_SELECTORS.length; i++) {
    console.log(`   [Prebuilt] ${i + 1}/3: ${labels[i]}...`);

    const tabSelector = TAB_SELECTORS[i];
    if (tabSelector) {
      if (!(await clickAt(page, tabSelector))) {
        throw new Error(
          `The "${labels[i]}" tab button is missing, so that prebuilt component ` +
            'was never exercised.',
        );
      }
      await sleep(400);
      await waitForDomSettled(page, { settleMs: 800 });
    }

    // Open the popup only if it is not already open -- clicking an open one
    // closes it, and there is then no input to type into.
    if (labels[i] === 'CopilotPopup') {
      const toggle = page.locator(POPUP_TOGGLE).first();
      if (!(await toggle.isVisible({ timeout: 6000 }).catch(() => false))) {
        throw new Error(
          'CopilotPopup rendered no chat toggle, so the popup could never be opened.',
        );
      }
      const state = await toggle.getAttribute('data-state').catch(() => null);
      console.log(`   Popup launcher reports data-state="${state}".`);
      if (state !== 'open') {
        await clickAt(page, POPUP_TOGGLE, 6000);
        await sleep(900);
        await waitForDomSettled(page, { settleMs: 600 });
      } else {
        // Still put the cursor on the launcher, so the video shows what opened it.
        const tBox = await toggle.boundingBox();
        if (tBox) {
          await humanGlide(page, tBox.x + tBox.width / 2, tBox.y + tBox.height / 2, 20);
          await sleep(900);
        }
      }
    }

    // Every surface keeps the same transcript, so the baseline is whatever is
    // already on screen for this one -- read it fresh rather than carried over.
    const prompt = prompts[i] ?? prompts[prompts.length - 1];
    const msgCount = await sendPrompt(page, prompt, { timeoutMs: i === 0 ? 12000 : 8000 });
    await waitForAgentResponseCompletion(
      page,
      config.waitAfterPromptMs ?? 2500,
      msgCount,
    );
  }

  await humanGlide(page, 960, 400, 22);
  await sleep(1200);
};
