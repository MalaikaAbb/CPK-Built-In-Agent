/**
 * Repo-authored stand-in: `../_components/badge` is imported by the page's Code
 * tab but not published. A small pill; `variant` only changes its colours.
 */
import type { HTMLAttributes } from "react";

const VARIANTS = {
  default: "border-transparent bg-neutral-900 text-white",
  secondary: "border-transparent bg-neutral-100 text-neutral-800",
  outline: "border-neutral-200 text-neutral-700",
  success: "border-transparent bg-emerald-100 text-emerald-800",
  warning: "border-transparent bg-amber-100 text-amber-800",
  error: "border-transparent bg-rose-100 text-rose-800",
  info: "border-transparent bg-sky-100 text-sky-800",
} as const;

export function Badge({
  variant = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof VARIANTS }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
