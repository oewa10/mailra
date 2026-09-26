import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getAdminPasswordVersion } from "@/lib/db"
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
  type Session,
} from "./session"

/**
 * The proxy only checks the signature (cheap, no database). This also checks the session was
 * issued under the account's current password, so changing or resetting it signs out every other
 * device, and a deleted account loses access at once. Memoized per request.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies()
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
  if (!session) return null
  try {
    return (await getAdminPasswordVersion(session.uid)) === session.pv ? session : null
  } catch (error) {
    console.error("Session check failed:", error)
    return null
  }
})

/** Returns a 401 response (clearing a revoked cookie) when there is no valid session, otherwise null. */
export async function denyUnlessAdmin(): Promise<NextResponse | null> {
  if (await getSession()) return null
  const response = NextResponse.json({ error: "U bent niet (meer) ingelogd." }, { status: 401 })
  response.cookies.delete(SESSION_COOKIE)
  return response
}

export async function startSession(uid: string, email: string, pv: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken(uid, email, pv), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function endSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
