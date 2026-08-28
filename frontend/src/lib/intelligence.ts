import "server-only";

/**
 * What the runtime reports about itself, for the connection panel.
 *
 * Server-side by necessity: `INTELLIGENCE_API_KEY` and `COPILOTKIT_LICENSE_TOKEN`
 * are server secrets that must never reach the bundle, and only their presence —
 * never their value — crosses to the client.
 *
 * The probe is `GET /api/copilotkit/info`, the runtime's own discovery route. A
 * 200 there is also what proves the multi-route handler is mounted at the
 * catch-all path rather than a single segment.
 *
 * Three axes come back, and they are genuinely independent:
 *
 *   - `mode` — "sse" or "intelligence". The honest answer to "is Intelligence
 *     actually on", because a key can be set and still rejected, and SSE mode
 *     already reports `threadEndpoints.list: true` off its in-memory runner, so
 *     the thread flags alone read as a false positive.
 *   - `licenseStatus` — from the runtime's `licenseToken`, NOT its Intelligence
 *     key. This is what `<CopilotThreadsDrawer>` gates its locked view on.
 *   - `threadEndpoints` — what the runtime says it can do with threads.
 */

export interface ThreadEndpoints {
  list?: boolean;
  inspect?: boolean;
  mutations?: boolean;
  realtimeMetadata?: boolean;
}

/** What the runtime reports it is running as. */
export type RuntimeMode = "sse" | "intelligence";

export interface IntelligenceReport {
  runtime: { ok: boolean; detail: string };
  /** Whether a project key is configured on the server. Never the value. */
  intelligenceKeySet: boolean;
  /** Whether a license token is configured on the server. Never the value. */
  licenseTokenSet: boolean;
  /** The runtime's own answer, from `/info`. Absent when the probe failed. */
  mode?: RuntimeMode;
  licenseStatus?: string;
  threadEndpoints?: ThreadEndpoints;
  agentIds: string[];
}

/** The app's own origin, for the server-side `/info` probe. */
function selfOrigin(): string {
  const port = process.env.PORT ?? "3000";
  return process.env.NEXT_PUBLIC_SITE_ORIGIN ?? `http://127.0.0.1:${port}`;
}

export async function getIntelligenceReport(): Promise<IntelligenceReport> {
  const infoUrl = `${selfOrigin()}/api/copilotkit/info`;
  const keys = {
    intelligenceKeySet: Boolean(process.env.INTELLIGENCE_API_KEY),
    licenseTokenSet: Boolean(process.env.COPILOTKIT_LICENSE_TOKEN),
  };

  try {
    const res = await fetch(infoUrl, {
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ...keys,
        runtime: {
          ok: false,
          detail: `${infoUrl} returned ${res.status} — the handler is probably still at route.ts rather than [[...slug]]/route.ts.`,
        },
        agentIds: [],
      };
    }

    const body = (await res.json()) as {
      agents?: Record<string, unknown>;
      mode?: RuntimeMode;
      licenseStatus?: string;
      threadEndpoints?: ThreadEndpoints;
    };
    const agentIds = Object.keys(body.agents ?? {});

    return {
      ...keys,
      runtime: {
        ok: true,
        detail: `200 from /api/copilotkit/info — mode "${body.mode}", ${agentIds.length} agent(s) registered.`,
      },
      mode: body.mode,
      licenseStatus: body.licenseStatus,
      threadEndpoints: body.threadEndpoints,
      agentIds,
    };
  } catch (error) {
    return {
      ...keys,
      runtime: {
        ok: false,
        detail:
          error instanceof Error
            ? `${infoUrl} unreachable — ${error.message}`
            : `${infoUrl} unreachable`,
      },
      agentIds: [],
    };
  }
}
