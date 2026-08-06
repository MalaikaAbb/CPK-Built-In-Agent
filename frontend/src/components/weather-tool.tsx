"use client";

import { defineToolCallRenderer } from "@copilotkit/react-core/v2";
import { z } from "zod";

/**
 * The Programmatic Control page's tool-call renderer, registered on the
 * provider via `renderToolCalls` rather than by a hook inside a page.
 *
 * Provider-level registration is what that page shows, and it is also why the
 * card appears on every route that triggers `get_weather` — including the ones
 * that never mention it.
 *
 * ⚠️ One addition: `args`. The page calls `defineToolCallRenderer` with only
 * `name` and `render`, but the shipped function has two overloads — a wildcard
 * (`name: "*"`, no schema) and a named one that *requires* an `args` schema. The
 * doc's shape matches neither, so it does not compile, and without the schema
 * `args` would be `unknown` and `args.location` unusable. The schema below is the
 * `get_weather` tool's own.
 */
//#region renderer
export const weatherToolRender = defineToolCallRenderer({
  name: "get_weather",
  args: z.object({ location: z.string() }),
  render: ({ args, status }) => {
    return <WeatherCard location={args.location} status={status} />;
  },
});

function WeatherCard({
  location,
  status,
}: {
  location?: string;
  status: string;
}) {
  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <h3 className="text-xl font-semibold">Weather in {location}</h3>
      <div className="mt-4">
        <span className="text-5xl font-light">70°F</span>
      </div>
      {status === "executing" && <div className="spinner">Loading...</div>}
    </div>
  );
}
//#endregion
