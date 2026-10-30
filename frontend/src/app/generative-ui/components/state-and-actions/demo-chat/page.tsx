"use client";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { plansUI } from "./events-catalog";
import { shopUI as functionsUI } from "./functions-catalog";
import { DeclarationsSection, FunctionsSection, StateSection } from "./sections";
import { shopUI as stateUI } from "./state-catalog";
import { shopUI as writableUI } from "./writable-catalog";

export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/state-and-actions" subtitle="state · functions · events · writable">
      <GenUIDemo
        variants={[
          {
            id: "state",
            label: "App state (bind)",
            generativeUI: { ui: stateUI },
            page: <StateSection />,
            welcome: "Try: show product cards for p1 Trail Runner and p2 City Sneaker.",
          },
          {
            id: "functions",
            label: "Run code on click",
            generativeUI: { ui: functionsUI },
            page: <FunctionsSection />,
            welcome: "Try: show product cards for p1 Trail Runner and p3 Track Spike.",
          },
          {
            id: "events",
            label: "Send a click to the agent",
            generativeUI: { ui: plansUI },
            welcome: "Try: show plan cards for Starter and Team.",
          },
          {
            id: "writable",
            label: "Keep what the user types",
            generativeUI: { ui: writableUI },
            welcome: "Try: show a checkout form with the email set to me@example.com.",
          },
          {
            id: "declarations",
            label: "Who may call a function",
            noChat: true,
            page: <DeclarationsSection />,
          },
        ]}
      />
    </DemoFrame>
  );
}
