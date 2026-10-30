/**
 * Excerpt: only `jsonSchemaToZod`, copied verbatim from the `tanstack-factory.ts`
 * file published in the Code tab of the Components as Tools page
 * (/generative-ui/tool-based). The OGUI page's `ogui-factory.ts` imports it
 * from here but its own Code tab does not include it.
 *
 * The rest of that file (the generic `createBuiltInAgent`, state/server/
 * sub-agent tools, header forwarding) is not needed by Open Generative UI and
 * is not copied.
 */
import { z } from "zod";


/**
 * Convert a JSON Schema object to a Zod schema (shallow — handles the
 * common { type: "object", properties: {...} } shape that AG-UI tools
 * produce). Deep/recursive conversion is intentionally omitted: the
 * schema is only used for LLM tool-call declaration, not runtime
 * validation.
 */
// Exported so the OGUI and MCP-Apps factories can declare the tools that
// their runtime middleware injects into `input.tools` (see ogui-factory.ts /
// mcp-apps-factory.ts) without duplicating this conversion.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonSchemaToZod(schema: any): z.ZodTypeAny {
  if (!schema || typeof schema !== "object") return z.object({});
  if (schema.type === "object" && schema.properties) {
    const shape: Record<string, z.ZodTypeAny> = {};
    const required = new Set<string>(schema.required ?? []);
    for (const [key, prop] of Object.entries(schema.properties)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = prop as any;
      let field: z.ZodTypeAny;
      switch (p?.type) {
        case "string":
          field = z.string();
          break;
        case "number":
        case "integer":
          field = z.number();
          break;
        case "boolean":
          field = z.boolean();
          break;
        case "array":
          field = z.array(z.any());
          break;
        default:
          field = z.any();
      }
      if (p?.description) field = field.describe(p.description);
      shape[key] = required.has(key) ? field : field.optional();
    }
    return z.object(shape);
  }
  return z.object({});
}
