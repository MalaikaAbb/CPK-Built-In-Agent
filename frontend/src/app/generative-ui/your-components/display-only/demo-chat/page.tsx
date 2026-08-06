"use client";

import { CopilotChat, useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Display-only page's sample, unchanged: a React component registered with
 * `useComponent` so the agent can render it.
 *
 * There is no `handler` and no `execute` anywhere — the component *is* the
 * outcome. The agent decides to show a weather card and fills in the props; the
 * schema is what tells it which props exist and what they mean.
 */

const weatherSchema = z.object({
  city: z.string().describe("City name"),
  temperature: z.number().describe("Temperature in Fahrenheit"),
  condition: z.string().describe("Weather condition"),
});

function WeatherCard({
  city,
  temperature,
  condition,
}: z.infer<typeof weatherSchema>) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{city}</h3>
      <p className="text-2xl">{temperature}°F</p>
      <p className="text-sm text-gray-500">{condition}</p>
    </div>
  );
}

function YourMainContent() {
  useComponent({
    name: "showWeather",
    description: "Display a weather card for a city.",
    parameters: weatherSchema,
    render: WeatherCard,
  });

  // The second sample on the page: a component with no parameters schema.
  useComponent({
    name: "showGreeting",
    render: ({ message }: { message: string }) => (
      <div className="rounded border p-3 bg-blue-50">
        <p>{message}</p>
      </div>
    ),
  });

  return (
    <CopilotChat
      labels={{
        welcomeMessageText:
          "Try: show the weather card for Tokyo — 77 degrees and clear.",
      }}
    />
  );
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/your-components/display-only"
      subtitle="useComponent · showWeather + showGreeting"
    >
      <YourMainContent />
    </DemoFrame>
  );
}
