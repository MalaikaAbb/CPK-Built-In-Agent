import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { sendPrompt, waitForAgentResponseCompletion } from '../core/actions';

/**
 * The live probe of the runtime's own HTTP surface, then traffic across it.
 *
 * `GET /info` is the only endpoint on the page that can be called by hand -- the
 * run and stop routes want a full AG-UI `RunAgentInput` and answer with an SSE
 * stream. It is also the request the client itself makes on mount to discover
 * agents, so its JSON body is the agent table this whole app is built on.
 *
 * Recording the chat alone missed the page entirely: the endpoint list is static
 * markup, and without pressing the button the `<pre>` still reads "Press the
 * button". Clicking it and waiting for that placeholder to be replaced is what
 * turns the panel from a screenshot into a test.
 */
const PROBE_BUTTON = 'button:has-text("/api/copilotkit/info")';
const OUTPUT = 'pre';
const PLACEHOLDER = 'Press the button';

export const runRuntimeEndpointsAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  console.log(`   [Runtime Endpoints] Reading the endpoint table...`);
  const tableBox = await page.locator('table').first().boundingBox().catch(() => null);
  if (tableBox) {
    await humanGlide(page, tableBox.x + Math.min(tableBox.width / 2, 240), tableBox.y + tableBox.height / 2, 22);
    await sleep(1800);
  }

  console.log(`   [Runtime Endpoints] Clicking GET /api/copilotkit/info...`);
  const probe = page.locator(PROBE_BUTTON).first();
  await probe.waitFor({ state: 'visible', timeout: 15000 });
  const pBox = await probe.boundingBox();
  if (pBox) {
    await humanGlide(page, pBox.x + pBox.width / 2, pBox.y + pBox.height / 2, 20);
    await humanClick(page);
  } else {
    await probe.click();
  }

  // The placeholder being replaced is the response having landed. `fetch` plus a
  // React state update is fast, but the route may still be compiling on a cold
  // dev server, so this gets a real budget rather than a fixed sleep.
  const output = page.locator(OUTPUT).first();
  const answered = await output
    .filter({ hasNotText: PLACEHOLDER })
    .waitFor({ state: 'visible', timeout: 30000 })
    .then(() => true)
    .catch(() => false);

  const body = (await output.textContent().catch(() => '')) ?? '';
  if (!answered || body.includes(PLACEHOLDER) || body.trim().length === 0) {
    throw new Error(
      'GET /api/copilotkit/info produced nothing: the output pane still shows its ' +
        'placeholder, so the runtime never answered the discovery request.',
    );
  }
  console.log(`   ✅ /info answered with ${body.trim().length} characters of JSON.`);

  // Let the agent table be read, then scroll-rest further down the body.
  const oBox = await output.boundingBox().catch(() => null);
  if (oBox) {
    await humanGlide(page, oBox.x + Math.min(oBox.width / 2, 220), oBox.y + 60, 22);
    await sleep(2500);
    await humanGlide(page, oBox.x + Math.min(oBox.width / 2, 220), oBox.y + Math.min(oBox.height - 40, 300), 22);
    await sleep(2000);
  }

  // The chat on the right is the honest way to exercise POST /agent/:id/run.
  console.log(`   [Runtime Endpoints] Sending a prompt through POST /agent/renderingAgent/run...`);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, msgCount);
};
