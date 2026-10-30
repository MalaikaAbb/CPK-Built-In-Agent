/**
 * Routes whose demo mounts its own provider (`<CopilotKit>` or
 * `<CopilotKitProvider>`), because the doc page's code does.
 *
 * Every provider mounts its own Inspector in development unless told not to,
 * so a nested provider under the root one puts two Inspectors on the page, and
 * the two lit-html instances fight. The root provider turns its Inspector off on
 * these paths and leaves the nested one in charge.
 *
 * Match is by prefix, so a demo path also covers anything under it.
 */
export const NESTED_PROVIDER_ROUTES: string[] = [
  "/auth/demo-chat",
  "/model-selection/demo-chat",
  "/prebuilt-components/copilot-threads-drawer/demo-chat",
  "/headless-threads/demo-chat",
  "/generative-ui/tool-based/demo-chat",
  "/human-in-the-loop/demo-chat",
  "/shared-state/rendering-in-app/demo-chat",
  "/shared-state/agent-readonly/demo-chat",
  "/generative-ui/a2ui/fixed-schema/demo-chat",
  "/generative-ui/a2ui/dynamic-schema/demo-chat",
  "/generative-ui/open-generative-ui/demo-chat",
  "/generative-ui/json-render/demo-chat",
  "/generative-ui/hashbrown/demo-chat",
  "/multi-agent/subagents/demo-chat",
  "/generative-ui/mcp-apps/demo-chat",
  "/mcp-servers/demo-chat",
  "/generative-ui/components/demo-chat",
  "/generative-ui/components/surfaces/demo-chat",
  "/generative-ui/components/catalogs/demo-chat",
  "/generative-ui/components/standard-catalog/demo-chat",
  "/generative-ui/components/state-and-actions/demo-chat",
  "/generative-ui/components/theming/demo-chat",
  "/generative-ui/components/transports/demo-chat",
  "/generative-ui/components/markdown-mode/demo-chat",
  "/generative-ui/components/from-a2ui/demo-chat",
];

export function rootInspectorEnabled(pathname: string | null): boolean | undefined {
  if (!pathname) return undefined;
  const nested = NESTED_PROVIDER_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  // `undefined` keeps the provider's own default: on in development only.
  return nested ? false : undefined;
}
