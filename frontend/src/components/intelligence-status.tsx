import { getIntelligenceReport } from "@/lib/intelligence";

function Row({
  tone,
  label,
  detail,
}: {
  tone: "ok" | "warn" | "off";
  label: string;
  detail: string;
}) {
  const dot =
    tone === "ok"
      ? "bg-emerald-500"
      : tone === "warn"
        ? "bg-amber-500"
        : "bg-slate-400";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {label}
        </p>
        <p className="break-words text-xs text-slate-500 dark:text-slate-400">
          {detail}
        </p>
      </div>
    </li>
  );
}

/**
 * Server component: probes the runtime during render.
 *
 * It reports the three axes separately on purpose. Conflating them is what makes
 * a locked Threads Drawer look like a threads failure, when the two are gated by
 * different credentials.
 */
export async function IntelligenceStatus() {
  const report = await getIntelligenceReport();

  const intelligenceLive = report.mode === "intelligence";

  const enabledThreadEndpoints = Object.entries(report.threadEndpoints ?? {})
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(", ");

  const intelligenceDetail = intelligenceLive
    ? `Mode "intelligence"${
        enabledThreadEndpoints
          ? `, threadEndpoints ${enabledThreadEndpoints}`
          : ""
      }. This says the key was read, not that the platform accepted it — a bad key still reports this. Confirm by sending a message and looking for the thread in your project dashboard.`
    : report.intelligenceKeySet
      ? 'INTELLIGENCE_API_KEY is set, but /info still reports mode "sse" — the key was rejected or never reached the platform.'
      : 'Not configured. /info reports mode "sse": MyRunner backs the threads in memory, so chat works on every route and thread list/inspect answer locally, but mutations and realtime metadata stay off and nothing survives a restart.';

  const licenseOk =
    report.licenseStatus === "valid" || report.licenseStatus === "expiring";

  const licenseDetail = licenseOk
    ? `/info reports licenseStatus "${report.licenseStatus}" — feature UIs like the Threads Drawer are unlocked.`
    : report.licenseStatus
      ? `/info reports licenseStatus "${report.licenseStatus}"${
          report.licenseTokenSet ? "" : " — no COPILOTKIT_LICENSE_TOKEN is set"
        }. Threads still work if mode is "intelligence", but the Threads Drawer renders its locked Upgrade view, which gates on this field and not on the Intelligence key.`
      : "Not reported — the runtime is not in Intelligence mode, so no license status is published.";

  return (
    <ul className="space-y-3">
      <Row
        tone={report.runtime.ok ? "ok" : "warn"}
        label="Copilot Runtime"
        detail={report.runtime.detail}
      />
      <Row
        tone={intelligenceLive ? "ok" : report.intelligenceKeySet ? "warn" : "off"}
        label="CopilotKit Intelligence"
        detail={intelligenceDetail}
      />
      <Row
        tone={licenseOk ? "ok" : report.licenseStatus ? "warn" : "off"}
        label="License (Threads Drawer gate)"
        detail={licenseDetail}
      />
    </ul>
  );
}
