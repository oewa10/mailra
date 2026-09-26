import * as React from "react"
import { cn } from "@/lib/utils"

/** Fluid-width containers, see REDESIGN_PLAN.md §3.3 */
export function Container({
  size = "page",
  className,
  ...props
}: React.ComponentProps<"div"> & { size?: "wide" | "page" | "text" }) {
  const map = { wide: "u-wide", page: "u-page", text: "u-text" }
  return <div className={cn(map[size], className)} {...props} />
}

/** Section wrapper: fluid vertical rhythm + scroll-driven reveal (progressive). */
export function Section({
  rhythm = "default",
  reveal = true,
  className,
  ...props
}: React.ComponentProps<"section"> & {
  rhythm?: "default" | "lg" | "sm"
  reveal?: boolean
}) {
  const rhythmClass =
    rhythm === "lg" ? "section-y-lg" : rhythm === "sm" ? "section-y-sm" : "section-y"
  return (
    <section
      className={cn(rhythmClass, reveal && "u-reveal", className)}
      {...props}
    />
  )
}

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-eyebrow", className)} {...props} />
}

export function Hairline({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="separator" className={cn("hairline", className)} {...props} />
}

/** The site's one signature shape — cap the usage at three per plan. */
export function ArchFrame({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("arch relative", className)} {...props} />
}

/** Small hand-authored botanical sprig echoing the logo's leaf motif. */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 96"
      className={cn("h-12 w-8", className)}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M32 94V20"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M32 34C32 34 20 28 18 16C30 16 32 30 32 30"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M32 50C32 50 44 44 46 32C34 32 32 46 32 46"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M32 22C32 22 24 16 24 6C34 8 32 20 32 20"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="32" cy="10" r="2.5" fill="currentColor" />
    </svg>
  )
}
