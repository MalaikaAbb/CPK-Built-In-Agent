import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import type { NextRequest } from "next/server";

import { builtInAgent } from "@/copilotkit/agents";
import { DEMO_TOKEN } from "@/copilotkit/auth-demo";

/**
 * A second, token-gated runtime endpoint — the Authentication page's backend
 * sample, running.
 *
 * It is deliberately *not* the main `/api/copilotkit` endpoint: an `onRequest`
 * hook is global to the runtime it is attached to, so gating the main one would
 * 401 every other route in this harness. The `/auth` route points its own
 * provider at this path instead, which is also what makes the failure case
 * testable — drop the header and watch it 401.
 *
 * `basePath` has to match where the file is mounted; the doc's sample says
 * `/api/copilotkit` because that is where it mounts it.
 */
const myAgent = builtInAgent;

const runtime = new CopilotRuntime({ agents: { default: myAgent } });

/**
 * The page's sample calls `verifyJwt(token)` without defining it. Signature
 * verification needs a signing key and a JWT library, neither of which the doc
 * specifies, so this stands in: it accepts the demo token the `/auth` page
 * sends and rejects anything else. Real verification belongs here.
 */
function verifyJwt(token: string): { id: string } {
  if (token !== DEMO_TOKEN) {
    throw new Response(JSON.stringify({ error: "invalid token" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return { id: "demo-user" };
}

//#region auth-handler
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-auth",
  hooks: {
    onRequest: ({ request }) => {
      const authHeader = request.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        throw new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }
      const token = authHeader.slice("Bearer ".length);
      // The doc's sample ends here, with the verified user unused — it is
      // showing where verification goes, not what to do with the result.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = verifyJwt(token);
    },
  },
});
//#endregion

export const POST = (req: NextRequest) => handler(req);
export const GET = (req: NextRequest) => handler(req);
