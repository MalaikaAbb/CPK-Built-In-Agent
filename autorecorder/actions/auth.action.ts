import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import {
  getAssistantMessageCount,
  sendPrompt,
  waitForAgentResponseCompletion,
} from '../core/actions';
import { waitForDomSettled } from './page-ready';

/**
 * All three token states against the gated runtime, including the two that are
 * supposed to fail.
 *
 * The page nests a second `<CopilotKit>` pointed at `/api/copilotkit-auth`,
 * whose `onRequest` hook 401s anything without `Authorization: Bearer
 * demo-token`. Recording only the valid tab showed a chat that worked and
 * proved nothing -- an `onRequest` hook that had been deleted would have
 * produced exactly the same video.
 *
 * So the two bad tabs are recorded as *failures on purpose*, and the assertion
 * flips with them: the shared response detector is right for the valid token and
 * exactly wrong for the other two, where a reply arriving is the bug. What is
 * checked there instead is that the client's own error banner appeared and that
 * no assistant message ever did.
 *
 * The banner comes from the mount, not the send: `key={choice.id}` remounts the
 * provider on every switch, the client requests `/info` once to discover agents,
 * and that request is the first thing the hook rejects. The prompt is still
 * typed and sent afterwards, because "the box accepts text and the send goes
 * nowhere" is the behaviour someone hitting this in their own app would see.
 */

interface TokenTab {
  label: string;
  /** Whether this tab is expected to reach the agent. */
  expectReply: boolean;
}

const TABS: TokenTab[] = [
  { label: 'Valid token', expectReply: true },
  { label: 'Wrong token', expectReply: false },
  { label: 'No header at all', expectReply: false },
];

/** The client's own 401 surface, rendered when `/info` is rejected. */
const ERROR_BANNER = 'text=/failed with status 401/i';

/** How long a rejected tab is watched for a reply that must never come. */
const SILENCE_WINDOW_MS = 9000;

async function selectTab(page: Page, label: string): Promise<void> {
  const tab = page.locator(`button:text-is("${label}")`).first();
  await tab.waitFor({ state: 'visible', timeout: 10000 });
  const box = await tab.boundingBox();
  if (box) {
    await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await humanClick(page);
  } else {
    await tab.click();
  }
  await sleep(500);
  await waitForDomSettled(page, { settleMs: 800 });
}

export const runAuthAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  for (let i = 0; i < TABS.length; i++) {
    const { label, expectReply } = TABS[i];
    console.log(
      `   [Authentication] ${i + 1}/${TABS.length}: "${label}" ` +
        `(expecting ${expectReply ? 'a reply' : 'a 401'})...`,
    );

    // The first tab is already selected on load; only later ones need a click.
    if (i > 0) await selectTab(page, label);

    // Show the header this tab actually sends before asking anything.
    const headerLine = page.locator('p.font-mono').first();
    const header = (await headerLine.textContent().catch(() => '')) ?? '';
    console.log(`   ${header.trim()}`);
    const hBox = await headerLine.boundingBox().catch(() => null);
    if (hBox) {
      await humanGlide(page, hBox.x + Math.min(hBox.width / 2, 220), hBox.y + hBox.height / 2, 20);
      await sleep(1400);
    }

    if (expectReply) {
      const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });
      await waitForAgentResponseCompletion(
        page,
        config.waitAfterPromptMs ?? 3000,
        msgCount,
      );
      continue;
    }

    // ── The rejected tabs ────────────────────────────────────────────────────
    const banner = page.locator(ERROR_BANNER).first();
    const rejected = await banner
      .waitFor({ state: 'visible', timeout: 20000 })
      .then(() => true)
      .catch(() => false);
    if (!rejected) {
      throw new Error(
        `"${label}" produced no 401: the gated runtime accepted a request it was ` +
          'meant to reject, so the onRequest hook is not doing anything.',
      );
    }
    console.log(`   ✅ Client surfaced the 401 from /info.`);
    const bBox = await banner.boundingBox().catch(() => null);
    if (bBox) {
      await humanGlide(page, bBox.x + Math.min(bBox.width / 2, 220), bBox.y + bBox.height / 2, 22);
      await sleep(2500);
    }

    // Type and send anyway: the box works, the run does not.
    await sendPrompt(page, config.prompt, { timeoutMs: 12000 });
    console.log(`   Watching ${SILENCE_WINDOW_MS / 1000}s for a reply that must not arrive...`);
    await sleep(SILENCE_WINDOW_MS);

    const leaked = await getAssistantMessageCount(page);
    if (leaked > 0) {
      throw new Error(
        `"${label}" got ${leaked} assistant message(s) back. An unauthenticated ` +
          'run reached the agent -- the gate leaks.',
      );
    }
    console.log(`   ✅ No assistant message: the send was refused, as documented.`);
    await sleep(1500);
  }

  await humanGlide(page, 960, 300, 22);
  await sleep(1500);
};
