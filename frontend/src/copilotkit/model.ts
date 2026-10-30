/**
 * Model ids.
 *
 * Not `server-only`: the Model Selection table below is plain data that the
 * demo's dropdown renders too. Nothing secret lives here — keys are read from
 * the environment by the runtime, never by this module.
 */

/**
 * The id every classic-mode agent reads.
 *
 * The default is the Quickstart's own `openai:gpt-5.4-mini`, which the Server
 * Tools and Advanced Configuration samples use as well, and which the Model
 * Selection page now lists among its supported OpenAI models.
 * `BuiltInAgentModel` accepts both `provider:model` and `provider/model`.
 */
export const MODEL = process.env.OPENAI_MODEL ?? "openai:gpt-5.4-mini";

//#region model-table
/**
 * Every specifier in the Model Selection page's tables, in the page's order,
 * with the env var the runtime reads for that provider when no `apiKey` is
 * passed. The demo's dropdown sends the chosen specifier as the run's `model`
 * override (see `modelSelectionAgent` in `agents.ts`).
 */
export const MODEL_TABLE = [
  {
    provider: "OpenAI",
    envVar: "OPENAI_API_KEY",
    models: [
      ["GPT-5.5", "openai:gpt-5.5"],
      ["GPT-5.4", "openai:gpt-5.4"],
      ["GPT-5.4 Mini", "openai:gpt-5.4-mini"],
      ["GPT-5", "openai:gpt-5"],
      ["GPT-5 Mini", "openai:gpt-5-mini"],
      ["GPT-4.1", "openai:gpt-4.1"],
      ["GPT-4.1 Mini", "openai:gpt-4.1-mini"],
      ["GPT-4.1 Nano", "openai:gpt-4.1-nano"],
      ["GPT-4o", "openai:gpt-4o"],
      ["GPT-4o Mini", "openai:gpt-4o-mini"],
      ["o3", "openai:o3"],
      ["o3-mini", "openai:o3-mini"],
      ["o4-mini", "openai:o4-mini"],
    ],
  },
  {
    provider: "Anthropic",
    envVar: "ANTHROPIC_API_KEY",
    models: [
      ["Claude Opus 4.8", "anthropic:claude-opus-4-8"],
      ["Claude Sonnet 4.6", "anthropic:claude-sonnet-4-6"],
      ["Claude Haiku 4.5", "anthropic:claude-haiku-4-5"],
      ["Claude Sonnet 4.5", "anthropic:claude-sonnet-4-5"],
    ],
  },
  {
    provider: "Google",
    envVar: "GOOGLE_API_KEY",
    models: [
      ["Gemini 3.8 Flash", "google:gemini-3.8-flash"],
      ["Gemini 3.5 Flash", "google:gemini-3.5-flash"],
      ["Gemini 3.5 Flash Lite", "google:gemini-3.5-flash-lite"],
    ],
  },
  {
    provider: "MiniMax",
    envVar: "MINIMAX_API_KEY",
    models: [
      ["MiniMax M3", "minimax:MiniMax-M3"],
      ["MiniMax M2.7", "minimax:MiniMax-M2.7"],
    ],
  },
] as const satisfies readonly {
  provider: string;
  envVar: string;
  models: readonly (readonly [string, string])[];
}[];
//#endregion
