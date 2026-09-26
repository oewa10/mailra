import Image from "next/image"
import { Camera } from "lucide-react"
import type { PhotoSlot } from "@/lib/photos"
import { cn } from "@/lib/utils"

type Props = {
  slot: PhotoSlot
  sizes: string
  priority?: boolean
  className?: string
  /** Where the placeholder's brief sits, so it never collides with text laid over the photo. */
  captionAt?: "center" | "top" | "hero"
  tone?: "light" | "dark"
}

/** Fills its (positioned) parent with the slot's photo, or with a placeholder describing it. */
export function Photo({ slot, sizes, priority, className, captionAt = "center", tone = "light" }: Props) {
  if (slot.src) {
    return (
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    )
  }

  const dark = tone === "dark"
  return (
    <div
      role="img"
      aria-label={`${slot.alt} (foto volgt)`}
      data-photo-slot={slot.id}
      className={cn(
        "photo-placeholder absolute inset-0 flex p-6 sm:p-8",
        dark ? "photo-placeholder--dark" : "photo-placeholder--light",
        captionAt === "center" && "items-center justify-center text-center",
        captionAt === "top" && "items-start justify-start",
        captionAt === "hero" &&
          "items-start justify-end pt-[calc(var(--header-h)+1rem)] sm:items-end sm:pb-24 sm:pt-6",
      )}
    >
      <div
        className={cn(
          "max-w-[19rem] border border-dashed px-4 py-3",
          dark ? "border-gold/40 bg-olive-deep/40 text-canvas/80" : "border-gold-ink/35 bg-canvas/70 text-ink-70",
          captionAt === "center" && "mx-auto",
        )}
      >
        <p className={cn("flex items-center gap-2 text-eyebrow !text-[0.625rem]", dark ? "!text-gold" : "!text-gold-ink", captionAt === "center" && "justify-center")}>
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          Foto volgt · {slot.label}
        </p>
        <p className="mt-2 text-xs leading-relaxed">{slot.brief}</p>
        <p className={cn("mt-2 text-[0.6875rem]", dark ? "text-canvas/50" : "text-ink-55")}>{slot.format}</p>
      </div>
    </div>
  )
}
