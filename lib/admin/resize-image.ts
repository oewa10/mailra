"use client"

const MAX_SOURCE_BYTES = 25 * 1024 * 1024

/** Downscales an uploaded photo in the browser and returns a compact data URL. */
export async function resizeImage(file: File, maxEdge = 1400, quality = 0.8): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Kies een afbeeldingsbestand (JPG, PNG of WebP).")
  if (file.size > MAX_SOURCE_BYTES) throw new Error("Deze foto is groter dan 25 MB. Kies een kleinere foto.")

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error("Deze afbeelding kan niet worden gelezen. Probeer een JPG of PNG.")
  }

  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Afbeelding verwerken is niet gelukt.")
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const webp = canvas.toDataURL("image/webp", quality)
  // Browsers without WebP encoding silently fall back to PNG, which is far larger.
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", quality)
}
