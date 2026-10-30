/**
 * The page's CSS-parts sample, verbatim, kept as a string so the demo can
 * inject it only while its toggle is on. Imported as a global stylesheet it
 * would hide the Drawer's own controls on every variant.
 */
export const HIDE_NEW_THREAD_CSS = `copilotkit-threads-drawer::part(new-thread-button),
copilotkit-threads-drawer::part(launcher-new-thread) {
  display: none;
}`;
