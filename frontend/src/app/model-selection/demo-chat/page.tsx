import {
  ANTHROPIC_MODEL_ID,
  GOOGLE_MODEL_ID,
  OPENAI_MODEL_ID,
} from "@/copilotkit/model";

import { ProviderSections, type ProviderSection } from "./sections";

/**
 * Three agents, three providers, one tab each.
 *
 * A server component, because the useful thing to show alongside each chat is
 * whether that provider's key is actually configured — and that can only be
 * read on the server. Only the boolean crosses to the client; the key itself
 * never leaves this process. The tabs and the chat live in `./sections`, which
 * is the client half.
 *
 * `force-dynamic` because env is read at request time. Prerendering this at
 * build time would freeze whichever keys happened to be set then.
 */
export const dynamic = "force-dynamic";

export default function Page() {
  const sections: ProviderSection[] = [
    {
      letter: "A",
      title: "OpenAI",
      agentId: "openAiAgent",
      model: OPENAI_MODEL_ID,
      envVar: "OPENAI_API_KEY",
      configured: Boolean(process.env.OPENAI_API_KEY),
    },
    {
      letter: "B",
      title: "Google",
      agentId: "googleAgent",
      model: GOOGLE_MODEL_ID,
      envVar: "GOOGLE_API_KEY",
      configured: Boolean(process.env.GOOGLE_API_KEY),
    },
    {
      letter: "C",
      title: "Anthropic",
      agentId: "anthropicAgent",
      model: ANTHROPIC_MODEL_ID,
      envVar: "ANTHROPIC_API_KEY",
      configured: Boolean(process.env.ANTHROPIC_API_KEY),
    },
  ];

  return <ProviderSections sections={sections} />;
}
