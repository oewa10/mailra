"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

/** Small product photo for admin lists; goes through the image optimizer so lists stay light. */
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
    <Image
      src={src}
      alt={alt}
      width={56}
      height={56}
      onError={() => setFailed(true)}
      className={cn("shrink-0 bg-linen object-cover", className)}
    />
  )
}
