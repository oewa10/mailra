import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session"

const PUBLIC_ADMIN_PAGES = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/admin/session-expired",
]
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])

/**
 * Refuses state-changing requests another site made on the admin's behalf (CSRF). Browsers always
 * say where a non-GET request comes from; requests without those headers aren't from a browser.
 */
function isSameOrigin(request: NextRequest) {
  const site = request.headers.get("sec-fetch-site")
  if (site && site !== "same-origin" && site !== "none") return false

  const origin = request.headers.get("origin")
  if (!origin) return true
  if (origin === "null") return false
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isApi = pathname.startsWith("/api/")

  if (isApi && !SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
    return NextResponse.json({ error: "Verzoek geweigerd." }, { status: 403 })
  }
  if (pathname.startsWith("/api/auth/")) return NextResponse.next()

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)

  const isPublicPage = PUBLIC_ADMIN_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (isPublicPage) {
    if (session && pathname === "/admin/login" && !request.nextUrl.searchParams.has("reden")) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }

  // Only the signature is checked here; the panel and API also check the session wasn't revoked.
  if (session) return NextResponse.next()

  const response = isApi
    ? NextResponse.json({ error: "U bent niet (meer) ingelogd." }, { status: 401 })
    : NextResponse.redirect(new URL(`/admin/login?next=${encodeURIComponent(pathname + search)}`, request.url))
  if (token) response.cookies.delete(SESSION_COOKIE)
  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/products/:path*",
    "/api/categories/:path*",
    "/api/admin/:path*",
  ],
}
