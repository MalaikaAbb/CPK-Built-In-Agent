import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const MULTIPLE = `const searchDocs = defineTool({
  name: "searchDocs",
  description: "Search the documentation for relevant articles",
  parameters: z.object({
    query: z.string().describe("The search query"),
  }),
  execute: async ({ query }) => {
    const results = await search(query);
    return { results, count: results.length };
  },
});

const createTicket = defineTool({
  name: "createTicket",
  description: "Create a support ticket",
  parameters: z.object({
    title: z.string().describe("Ticket title"),
    priority: z.enum(["low", "medium", "high"]).describe("Ticket priority"),
    description: z.string().describe("Detailed description of the issue"),
  }),
  execute: async ({ title, priority, description }) => {
    const ticket = await db.tickets.create({ title, priority, description });
    return { ticketId: ticket.id, status: "created" };
  },
});

const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  tools: [searchDocs, createTicket],
  maxSteps: 2
});`;

const NESTED = `const bookFlight = defineTool({
  name: "bookFlight",
  description: "Search for and book flights",
  parameters: z.object({
    trip: z.object({
      origin: z.string().describe("Origin airport code (e.g., SFO)"),
      destination: z.string().describe("Destination airport code (e.g., JFK)"),
      date: z.string().describe("Departure date in YYYY-MM-DD format"),
    }),
    passengers: z.array(
      z.object({
        name: z.string(),
        seatPreference: z.enum(["window", "middle", "aisle"]).optional(),
      })
    ).describe("List of passengers"),
    class: z.enum(["economy", "business", "first"]).default("economy"),
  }),
  execute: async ({ trip, passengers, class: seatClass }) => {
    const flights = await searchFlights(trip, seatClass);
    return { flights, passengerCount: passengers.length };
  },
});`;

const ERRORS = `const getUser = defineTool({
  name: "getUser",
  description: "Look up a user by email",
  parameters: z.object({
    email: z.string().email().describe("The user's email address"),
  }),
  execute: async ({ email }) => {
    const user = await db.users.findByEmail(email);
    if (!user) {
      throw new Error(\`No user found with email: \${email}\`);
    }
    return { id: user.id, name: user.name, role: user.role };
  },
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/server-tools" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Tools whose bodies run inside the runtime process. <code>defineTool</code>{" "}
          pairs a Zod schema with an <code>execute</code> function; the array goes
          on the agent&apos;s constructor, so unlike a frontend tool it is part of
          the agent rather than part of a run. The browser never sees the
          implementation, which is the whole reason to put a tool here — secrets
          and databases stay server-side.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Lisbon?"]}
            expect="A ⏳ getWeather row appears, becomes ✓ with { temperature: 72, condition: 'sunny', location: 'Lisbon' }, and the agent then answers in prose using those numbers."
            fail="The agent answers from its own knowledge with no tool row — or the row appears and the agent then says nothing, which means maxSteps is back at its default of 1."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="maxSteps: 2 is doing real work here">
        <code>maxSteps</code> defaults to <strong>1</strong>: one model call, and
        a run that ends the moment the tool result comes back. Every multi-tool
        sample on this page passes <code>maxSteps: 2</code> for exactly that
        reason — the second step is the agent speaking about what the tool
        returned.
      </Callout>

      <Panel title="The tool, and the agent carrying it">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/copilotkit/tools.ts", region: "get-weather" },
            { file: "frontend/src/copilotkit/agents.ts", region: "server-tools-agent" },
          ]}
        />
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/server-tools/demo-chat/page.tsx" />
      </Panel>

      {/* <Panel
        title="Multiple tools on one agent"
        description="Verbatim from the page. References an undefined search() and db."
      >
        <CodeBlock code={MULTIPLE} filename="src/copilotkit.ts" language="ts" />
      </Panel>

      <Panel
        title="Nested and array parameters"
        description="Verbatim. Shows objects, arrays, enums, optional fields, and a default."
      >
        <CodeBlock code={NESTED} filename="src/copilotkit.ts" language="ts" />
      </Panel> */}

      <Panel
        title="Error handling"
        description="Verbatim. A throw inside execute becomes the tool result the model reads."
      >
        <CodeBlock code={ERRORS} filename="src/copilotkit.ts" language="ts" />
      </Panel>
    </>
  );
}
