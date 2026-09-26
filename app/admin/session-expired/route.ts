import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth/session"

// Server components can't clear cookies; the panel sends revoked sessions here to drop theirs.
export function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login?reden=verlopen", request.url))
  response.cookies.delete(SESSION_COOKIE)
  return response
}
