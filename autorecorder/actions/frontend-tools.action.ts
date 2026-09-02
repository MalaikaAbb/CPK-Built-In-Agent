import { type Page } from 'playwright';
import { humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { sendPrompt, waitForAgentResponseCompletion } from '../core/actions';

/**
 * The doc's `sayHello` tool, executed in the browser rather than in the agent.
 *
 * ── Why this page needs a dialog handler ───────────────────────────────────
 * The handler body is `alert(\`Hello, \${name}!\`)`. A native alert is browser
 * chrome, not page content, so a screen recording of the *page* can never
 * contain it — Playwright captures the viewport, and the alert is painted
 * outside it by the browser itself. Left unhandled it also blocks the page:
 * Playwright's default is to dismiss dialogs automatically, which unblocks it
 * but silently, leaving no evidence in the run that the browser-side handler
 * ever fired.
 *
 * So the dialog is handled explicitly, and the recording problem is solved
 * separately: the exact message the browser was about to show is repainted into
 * the page as a modal that looks like the alert it came from. Nothing is
 * invented — the text is `dialog.message()`, read off the real dialog that the
 * real `alert()` call really raised. It just gets shown somewhere the camera can
 * see. Without it the video's whole payload is a chat reply saying a greeting
 * happened, which is exactly what a *failed* run would also look like.
 *
 * The dialog must be accepted before anything is drawn: while it is pending the
 * page's JavaScript is blocked, so an injection would simply hang.
 */

const OVERLAY_ID = '__cpk_alert_replay__';

/** Repaints the accepted alert into the page so the recording can show it. */
async function paintAlert(page: Page, message: string): Promise<void> {
  await page
    .evaluate(
      ({ id, text, origin }) => {
        document.getElementById(id)?.remove();

        const backdrop = document.createElement('div');
        backdrop.id = id;
        backdrop.style.cssText = [
          'position:fixed', 'inset:0', 'z-index:2147483000',
          'background:rgba(15,23,42,.35)',
          'display:flex', 'align-items:flex-start', 'justify-content:center',
          'padding-top:8vh',
          'font-family:system-ui,-apple-system,"Segoe UI",sans-serif',
        ].join(';');

        const card = document.createElement('div');
        card.style.cssText = [
          'min-width:420px', 'max-width:560px',
          'background:#fff', 'color:#111827',
          'border-radius:12px', 'overflow:hidden',
          'box-shadow:0 24px 60px rgba(0,0,0,.35)',
        ].join(';');

        const head = document.createElement('div');
        head.textContent = `${origin} says`;
        head.style.cssText =
          'padding:16px 20px 4px;font-size:13px;color:#6b7280;';

        const body = document.createElement('div');
        body.textContent = text;
        body.style.cssText =
          'padding:4px 20px 20px;font-size:17px;font-weight:500;';

        const footer = document.createElement('div');
        footer.style.cssText =
          'display:flex;justify-content:flex-end;padding:0 16px 16px;';

        const ok = document.createElement('div');
        ok.textContent = 'OK';
        ok.style.cssText = [
          'background:#2563eb', 'color:#fff',
          'padding:7px 22px', 'border-radius:6px',
          'font-size:14px', 'font-weight:500',
        ].join(';');

        footer.appendChild(ok);
        card.append(head, body, footer);
        backdrop.appendChild(card);
        document.body.appendChild(backdrop);
      },
      { id: OVERLAY_ID, text: message, origin: new URL(page.url()).host },
    )
    .catch(() => {});
}

async function clearAlert(page: Page): Promise<void> {
  await page
    .evaluate((id) => document.getElementById(id)?.remove(), OVERLAY_ID)
    .catch(() => {});
}

export const runFrontendToolsAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  const dialogs: string[] = [];
  page.on('dialog', async (dialog) => {
    dialogs.push(dialog.message());
    console.log(`   🔔 Browser dialog fired: "${dialog.message()}"`);
    // Accept first: the page is frozen until this resolves, so nothing can be
    // drawn into it before then.
    await dialog.accept().catch(() => {});
  });

  console.log(`   [Frontend Tools] Sending prompt to trigger the browser sayHello tool...`);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });

  // The tool runs in the browser as soon as the model calls it, well before the
  // confirmation streams back, so the alert is caught mid-run rather than after.
  console.log(`   Waiting for the browser-side handler to raise its alert...`);
  const deadline = Date.now() + 30000;
  while (dialogs.length === 0 && Date.now() < deadline) {
    await sleep(250);
  }

  if (dialogs.length > 0) {
    console.log(`   🪧 Repainting the alert into the page so the recording shows it...`);
    await paintAlert(page, dialogs[0]);
    await humanGlide(page, 960, 300, 22);
    await sleep(3500);
    await clearAlert(page);
    await sleep(500);
  }

  // The agent's confirmation only arrives after the handler returned its string
  // over AG-UI, so waiting for the reply also waits for the round trip.
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, msgCount);

  if (dialogs.length === 0) {
    throw new Error(
      'The sayHello handler never ran: no browser dialog fired during the run. ' +
        'The agent answered in text instead of calling the tool, or the tool was ' +
        'not forwarded in the AG-UI run input.',
    );
  }
};
