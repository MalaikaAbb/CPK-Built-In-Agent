import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { getAssistantMessageCount, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { waitForDomSettled } from './page-ready';

/**
 * Every id in the runtime's routing table, asked the same question.
 *
 * `agents: { … }` is a map and `agentId` is the key into it, so the thing worth
 * recording is that all ten keys resolve -- including the two factory-mode
 * agents and the three per-provider ones, which reach entirely different code
 * paths inside the runtime. An id that is not in the table fails the run rather
 * than falling back to `default`, so a typo'd key shows up here as a page that
 * never answers.
 *
 * The second half is the part the switcher exists for. `CopilotChat` carries no
 * `key` prop, deliberately: switching ids swaps `agentId` on one mounted
 * component instead of remounting it, and messages live on the agent inside the
 * CopilotKit core rather than in React state. So going back to an id already
 * asked should still show its answer -- that is checked, not just filmed, by
 * counting the assistant messages after the switch.
 *
 * Because each id owns its own transcript, the message count restarts on every
 * switch; each turn reads its baseline fresh rather than carrying a total over.
 */
const AGENT_IDS = [
  'default',
  'serverToolsAgent',
  'renderingAgent',
  'advancedAgent',
  'sharedStateAgent',
  'openAiAgent',
  'googleAgent',
  'anthropicAgent',
  'aiSdkAgent',
  'tanStackAgent',
] as const;

/** Ids revisited at the end to show their transcripts survived the switching. */
const REVISIT = ['default', 'renderingAgent'] as const;

async function selectAgent(page: Page, agentId: string): Promise<void> {
  const tab = page.locator(`button:text-is("${agentId}")`).first();
  await tab.waitFor({ state: 'visible', timeout: 10000 });
  const box = await tab.boundingBox();
  if (box) {
    await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 18);
    await humanClick(page);
  } else {
    await tab.click();
  }
  await sleep(350);
  await waitForDomSettled(page, { settleMs: 600 });
}

export const runRuntimeAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  for (let i = 0; i < AGENT_IDS.length; i++) {
    const agentId = AGENT_IDS[i];
    console.log(
      `   [Copilot Runtime] ${i + 1}/${AGENT_IDS.length}: routing to "${agentId}"...`,
    );

    // The first id is already selected on load; only later ones need a click.
    if (i > 0) await selectAgent(page, agentId);

    const msgCount = await sendPrompt(page, config.prompt, {
      timeoutMs: i === 0 ? 12000 : 8000,
    });
    await waitForAgentResponseCompletion(
      page,
      config.waitAfterPromptMs ?? 1500,
      msgCount,
    );
  }

  // ── Does each id still hold what it was told? ─────────────────────────────
  for (const agentId of REVISIT) {
    console.log(`   [Copilot Runtime] revisiting "${agentId}" -- transcript still there?`);
    await selectAgent(page, agentId);
    await sleep(800);

    const kept = await getAssistantMessageCount(page);
    if (kept === 0) {
      throw new Error(
        `Switching back to "${agentId}" showed an empty transcript: the per-agent ` +
          'message history did not survive the id swap.',
      );
    }
    console.log(`   ✅ "${agentId}" still shows ${kept} assistant message(s).`);
    await humanGlide(page, 960, 420, 22);
    await sleep(1800);
  }
};
