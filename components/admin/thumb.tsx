"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function Thumb({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={cn("flex shrink-0 items-center justify-center bg-linen text-ink-55", className)}
        role="img"
        aria-label={`${alt} — geen afbeelding`}
      >
        <ImageOff className="h-4 w-4" aria-hidden="true" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("shrink-0 bg-linen object-cover", className)}
    />
  )
}
