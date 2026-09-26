import { NextResponse } from "next/server"
import { changeAdminPassword, passwordVersion } from "@/lib/db"
import { getSession, startSession } from "@/lib/auth/server"
import { recordAttempt, retryAfter, tooManyAttempts } from "@/lib/auth/rate-limit"
import { parseJson, passwordChangeSchema } from "@/lib/admin/validation"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "U bent niet (meer) ingelogd." }, { status: 401 })

  const { data, error } = await parseJson(request, passwordChangeSchema)
  if (error) return error

  // A stolen session must not be enough to brute-force the current password.
  const rules = [{ key: `password-change:${session.uid}`, limit: 8 }]

  try {
    const wait = await retryAfter(rules, 15 * 60)
    if (wait) return tooManyAttempts(wait, "Probeer het")

    const result = await changeAdminPassword(session.uid, data.currentPassword, data.newPassword)
    if (result.status !== "ok") {
      if (result.status === "not-found") {
        return NextResponse.json({ error: "Account niet gevonden." }, { status: 404 })
      }
      await recordAttempt(rules)
      return NextResponse.json({ error: "Uw huidige wachtwoord klopt niet." }, { status: 400 })
    }
    // Every other session is now revoked; keep this device signed in with a fresh one.
    await startSession(result.user.id, result.user.email, passwordVersion(result.user.password_hash))
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Change password error:", err)
    return NextResponse.json({ error: "Wachtwoord wijzigen is mislukt." }, { status: 500 })
  }
}
