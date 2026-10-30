import { MODEL_TABLE } from "@/copilotkit/model";

import { ModelPicker } from "./sections";

/**
 * Every specifier on the page, one agent each, picked from a dropdown.
 *
 * A server component, because the useful thing to show next to each model is
 * whether its provider's key is configured — and that can only be read on the
 * server. Only booleans cross to the client; no key value is serialised.
 *
 * `force-dynamic` because env is read at request time. Prerendering at build
 * time would freeze whichever keys happened to be set then.
 */
export const dynamic = "force-dynamic";

export default function Page() {
  const configured = Object.fromEntries(
    MODEL_TABLE.map(({ envVar }) => [envVar, Boolean(process.env[envVar])]),
  );

  return <ModelPicker configured={configured} />;
}
