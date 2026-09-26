import { getProductImage } from "@/lib/db"

type Context = { params: Promise<{ id: string; version: string }> }

const DATA_URL = /^data:(image\/(?:webp|jpeg|png|avif));base64,/

export async function GET(request: Request, { params }: Context) {
  const { id, version } = await params

  let stored
  try {
    stored = await getProductImage(id)
  } catch (error) {
    console.error("Product image load error:", error)
    return new Response("Afbeelding tijdelijk niet beschikbaar", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    })
  }
  if (!stored) return new Response("Niet gevonden", { status: 404, headers: { "Cache-Control": "no-store" } })

  const match = DATA_URL.exec(stored.image)
  if (!match) {
    // Only reachable from a page cached before the photo became a plain file path (e.g. after a
    // manual database edit). Stream the file rather than redirect: the image optimizer won't follow redirects.
    const upstream = await fetch(new URL(stored.image, request.url)).catch(() => null)
    if (!upstream?.ok) return new Response("Niet gevonden", { status: 404, headers: { "Cache-Control": "no-store" } })
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
        "Cache-Control": "public, max-age=60, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    })
  }

  const bytes = Buffer.from(stored.image.slice(match[0].length), "base64")
  // The version in the URL changes with every edit, so a matching URL can be cached forever.
  // A stale version still gets the current photo, just without the immutable promise.
  const current = version === stored.version
  return new Response(bytes, {
    headers: {
      "Content-Type": match[1],
      "Content-Length": String(bytes.length),
      "Cache-Control": current
        ? "public, max-age=31536000, immutable"
        : "public, max-age=60, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
