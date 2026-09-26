import { NextResponse } from "next/server"
import { z } from "zod"
import { createPasswordResetToken, getAdminByEmail } from "@/lib/db"
import { clientIp, recordAttempt, retryAfter, tooManyAttempts } from "@/lib/auth/rate-limit"
import { parseJson } from "@/lib/admin/validation"

const schema = z.object({ email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in").max(254) })

const GENERIC_MESSAGE =
  "Als er een account bij dit e-mailadres hoort, is er een herstellink aangemaakt. Deze is één uur geldig."

export async function POST(request: Request) {
  const { data, error } = await parseJson(request, schema)
  if (error) return error

  // Counted for every request, known address or not, so the limit reveals nothing either.
  const rules = [
    { key: `forgot:ip:${clientIp(request)}`, limit: 10 },
    { key: `forgot:account:${data.email}`, limit: 3 },
  ]

  try {
    const wait = await retryAfter(rules, 60 * 60)
    if (wait) return tooManyAttempts(wait, "Vraag een nieuwe link")
    await recordAttempt(rules)

    const user = await getAdminByEmail(data.email)
    if (user) {
      const token = await createPasswordResetToken(user.id)
      const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin
      // No mail provider is configured yet; the link is only visible in the server logs.
      console.log(`[admin] Password reset link for ${user.email}: ${base}/admin/reset-password?token=${token}`)
    }
    return NextResponse.json({ message: GENERIC_MESSAGE })
  } catch (err) {
    console.error("Forgot password error:", err)
    return NextResponse.json({ error: "Er ging iets mis. Probeer het later opnieuw." }, { status: 500 })
  }
}
