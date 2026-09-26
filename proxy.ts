import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session"

const PUBLIC_ADMIN_PAGES = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"]

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)

  const isPublicPage = PUBLIC_ADMIN_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (isPublicPage) {
    if (session && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }

  if (session) return NextResponse.next()

  const response = pathname.startsWith("/api/")
    ? NextResponse.json({ error: "U bent niet (meer) ingelogd." }, { status: 401 })
    : NextResponse.redirect(
        new URL(`/admin/login?next=${encodeURIComponent(pathname + search)}`, request.url),
      )
  if (token) response.cookies.delete(SESSION_COOKIE)
  return response
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/categories/:path*", "/api/admin/:path*"],
}
