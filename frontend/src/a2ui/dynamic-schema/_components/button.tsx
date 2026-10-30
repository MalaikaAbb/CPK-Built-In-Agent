/**
 * Repo-authored stand-in: `../_components/button` is imported by the page's
 * Code tab but not published. A plain styled `<button>`.
 */
import type { ButtonHTMLAttributes } from "react";

export function Button({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
