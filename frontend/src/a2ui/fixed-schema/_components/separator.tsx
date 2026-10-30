/**
 * Repo-authored stand-in: `../_components/separator` is imported by the page's
 * Code tab but not published. A one-pixel horizontal rule.
 */
import type { HTMLAttributes } from "react";

export function Separator({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" className={`h-px bg-neutral-200 ${className}`} {...props} />;
}
