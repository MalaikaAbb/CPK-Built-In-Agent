"use client";

import { CopilotChat, useHumanInTheLoop } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Interactive page's approval gate, verbatim.
 *
 * The shape worth noticing is `respond`: the run does not continue until it is
 * called, and what you pass becomes the tool result the agent reads next. Both
 * branches here pass an instruction rather than a value — the agent is being
 * told what to say, not what happened.
 *
 * Unusually for the samples in this repo, this one compiles unmodified: the
 * hook's generic is inferred from the `parameters` schema, so `args.command` is
 * a `string`.
 */
export function Page() {
  // ...

  useHumanInTheLoop({
    name: "humanApprovedCommand",
    description: "Ask human for approval to run a command.",
    parameters: z.object({
      command: z.string().describe("The command to run"),
    }),
    render: ({ args, respond, status }) => {
      if (status !== "executing") return <></>;
      return (
        <div>
          <pre>{args.command}</pre>
          <button onClick={() => respond?.(`Tell the user the command ran`)}>
            Approve
          </button>
          <button
            onClick={() => respond?.(`Tell the user the command wasn't run`)}
          >
            Deny
          </button>
        </div>
      );
    },
  });

  // ...

  return (
    <CopilotChat
      labels={{
        welcomeMessageText:
          "Try: run the command rm -rf /tmp/cache — then approve or deny it.",
      }}
    />
  );
}

export default function DemoPage() {
  return (
    <DemoFrame
      parentPath="/generative-ui/your-components/interactive"
      subtitle="useHumanInTheLoop · humanApprovedCommand"
    >
      <Page />
    </DemoFrame>
  );
}
