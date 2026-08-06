/**
 * Shared between the token-gated runtime endpoint and the `/auth` demo page.
 *
 * Not a credential: it gates a local demo endpoint that serves the same agent
 * as the ungated one. It exists so the page can show both outcomes — a run that
 * carries the header and one that does not.
 *
 * It lives here rather than in the route file because a Next.js `route.ts` may
 * only export route handlers and a small set of config values.
 */
export const DEMO_TOKEN = "demo-token";

/** Where the gated runtime is mounted. */
export const AUTH_RUNTIME_URL = "/api/copilotkit-auth";
