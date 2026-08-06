import "server-only";

/**
 * Model ids, one per provider.
 *
 * The doc pages this repo implements name four different OpenAI ids —
 * `openai:gpt-5.4-mini` (Quickstart, Server Tools, Advanced Configuration),
 * `openai:gpt-4.1` (Copilot Runtime, Model Selection), `openai/gpt-4o-mini`
 * (Runtime HTTP endpoints, AgentRunner), and `gpt-4o` via the AI SDK
 * (Use any model router). Rather than pick one and have the other pages
 * disagree with the code they link to, every classic-mode agent reads `MODEL`.
 *
 * The default is `openai:gpt-4.1`, which is the only one of those ids that
 * appears in the Model Selection page's list of supported OpenAI models.
 * `BuiltInAgentModel` accepts both `provider:model` and `provider/model`.
 */
export const MODEL = process.env.OPENAI_MODEL ?? "openai:gpt-4.1";

/**
 * The three provider-specific ids the Model Selection route drives, one agent
 * each.
 *
 * `resolveModel` in the runtime parses the prefix and picks the provider, so
 * no extra package is needed for any of them: `@ai-sdk/anthropic` and
 * `@ai-sdk/google` are already dependencies of `@copilotkit/runtime`.
 *
 * ⚠️ **The Anthropic id is hyphenated, and the docs' is not.** The Model
 * Selection page lists "Claude Sonnet 4.5" and `BuiltInAgentModel` carries the
 * literal `"anthropic/claude-sonnet-4.5"`, but `resolveModel` passes whatever
 * follows the prefix straight to `createAnthropic()(model)` with no
 * normalisation — and Anthropic's API has no `claude-sonnet-4.5`. It answers
 * 404 `not_found_error`. The real ids separate the version with hyphens:
 * `claude-sonnet-4-5`. Verified against `GET https://api.anthropic.com/v1/models`.
 *
 * OpenAI and Google are the opposite: `gpt-4.1` and `gemini-2.5-flash` are
 * exactly what those APIs expect, dots and all. Only Anthropic differs.
 */
export const OPENAI_MODEL_ID = process.env.OPENAI_MODEL ?? "openai:gpt-4.1";
export const GOOGLE_MODEL_ID =
  process.env.GOOGLE_MODEL ?? "google:gemini-2.5-flash";
export const ANTHROPIC_MODEL_ID =
  process.env.ANTHROPIC_MODEL ?? "anthropic:claude-sonnet-4-5";
