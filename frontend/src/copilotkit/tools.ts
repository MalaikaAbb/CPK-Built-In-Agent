import "server-only";

import { defineTool } from "@copilotkit/runtime/v2";
import { z } from "zod";

/**
 * Server-side tools, executed by the runtime rather than the browser.
 *
 * Both are the Server Tools page's `getWeather` sample. They differ only in
 * name, and the reason is worth knowing:
 *
 * - `getWeather` — the name the Server Tools page gives it.
 * - `get_weather` — the name the Tool Rendering and Programmatic Control pages
 *   render, in `useRenderTool({ name: "get_weather" })` and
 *   `defineToolCallRenderer({ name: "get_weather" })`.
 *
 * A renderer only binds when its name matches the tool exactly, so a single
 * tool cannot satisfy both sets of pages. Each is registered on a different
 * agent (see `agents.ts`), so nothing is shadowed.
 *
 * The page's three other samples — `searchDocs`, `createTicket`, `bookFlight`,
 * `getUser` — call `search()`, `db.tickets`, `searchFlights()`, and `db.users`,
 * helpers the docs never define. They are shown verbatim on the Server Tools
 * route as code rather than wired up here, because there is nothing to execute
 * them against and inventing a backing store would stop being the doc's code.
 */

//#region get-weather
export const getWeather = defineTool({
  name: "getWeather",
  description: "Get the current weather for a location",
  parameters: z.object({
    location: z.string().describe("The location's name"),
  }),
  execute: async ({ location }) => {
    return { temperature: 72, condition: "sunny", location };
  },
});
//#endregion

//#region get-weather-snake
export const get_weather = defineTool({
  name: "get_weather",
  description: "Get the current weather for a location",
  parameters: z.object({
    location: z.string().describe("The location to get weather for"),
  }),
  execute: async ({ location }) => {
    return { temperature: 72, condition: "sunny", location };
  },
});
//#endregion
