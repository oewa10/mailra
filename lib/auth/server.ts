import "server-only"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
  type Session,
} from "./session"

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

/** Returns a 401 response when there is no valid session, otherwise null. */
export async function denyUnlessAdmin(): Promise<NextResponse | null> {
  const session = await getSession()
  if (session) return null
  return NextResponse.json({ error: "U bent niet (meer) ingelogd." }, { status: 401 })
}

export async function startSession(uid: string, email: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken(uid, email), {
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
