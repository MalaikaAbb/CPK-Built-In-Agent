"use client";

/**
 * Repo-authored stand-in: `./demo-layout` is imported by the page's Code tab
 * but not published.
 *
 * Only its contract is fixed by the published page — an `ACTIVITIES` list (it
 * reads indexes 0 and 2) and a `DemoLayout` taking the three values plus their
 * setters. Everything here is the minimum that satisfies that: plain inputs
 * for the name and timezone, and a checkbox per activity. The activity strings
 * are placeholders, not the showcase's.
 */

export const ACTIVITIES = [
  "Opened the Q3 planning doc",
  "Commented on the pricing proposal",
  "Uploaded the onboarding checklist",
  "Joined the design review",
];

export function DemoLayout({
  userName,
  userTimezone,
  recentActivity,
  onUserNameChange,
  onUserTimezoneChange,
  onToggleActivity,
}: {
  userName: string;
  userTimezone: string;
  recentActivity: string[];
  onUserNameChange: (value: string) => void;
  onUserTimezoneChange: (value: string) => void;
  onToggleActivity: (activity: string) => void;
}) {
  return (
    <div className="mx-auto max-w-xl space-y-5 p-6 text-sm">
      <p className="text-xs text-slate-500">
        Everything below is published to the agent with useAgentContext. Change
        it, then ask the popup about it.
      </p>
      <label className="block">
        <span className="font-medium">Display name</span>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="font-medium">Timezone</span>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
          value={userTimezone}
          onChange={(e) => onUserTimezoneChange(e.target.value)}
        />
      </label>
      <fieldset>
        <legend className="font-medium">Recent activity</legend>
        <ul className="mt-1 space-y-1">
          {ACTIVITIES.map((a) => (
            <li key={a}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={recentActivity.includes(a)}
                  onChange={() => onToggleActivity(a)}
                />
                {a}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
