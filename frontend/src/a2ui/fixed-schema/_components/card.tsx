/**
 * Repo-authored stand-in: `../_components/card` is imported by the page's Code
 * tab but not published. A plain bordered container — just enough for the
 * published `Card` renderer to have something to render into.
 */
import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm ${className}`}
      {...props}
    />
  );
}
