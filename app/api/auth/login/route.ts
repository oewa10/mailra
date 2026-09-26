import { NextResponse } from "next/server"
import { z } from "zod"
import { passwordVersion, verifyAdminPassword } from "@/lib/db"
import { startSession } from "@/lib/auth/server"
import { clearAttempts, clientIp, recordAttempt, retryAfter, tooManyAttempts } from "@/lib/auth/rate-limit"
import { parseJson } from "@/lib/admin/validation"

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Vul uw e-mailadres in").max(254),
  password: z.string().min(1, "Vul uw wachtwoord in").max(200),
})

const WINDOW_SECONDS = 15 * 60

export async function POST(request: Request) {
  const { data, error } = await parseJson(request, loginSchema)
  if (error) return error

  const ip = clientIp(request)
  const rules = [
    // Guessing from one address, against any account.
    { key: `login:ip:${ip}`, limit: 30 },
    // Guessing one account from one address.
    { key: `login:account-ip:${data.email}:${ip}`, limit: 8 },
    // Guessing one account from many addresses, high enough that a stranger can't easily lock the owner out.
    { key: `login:account:${data.email}`, limit: 50 },
  ]

  try {
    const wait = await retryAfter(rules, WINDOW_SECONDS)
    if (wait) return tooManyAttempts(wait, "Probeer het")

    const user = await verifyAdminPassword(data.email, data.password)
    if (!user) {
      await recordAttempt(rules)
      return NextResponse.json({ error: "E-mailadres of wachtwoord klopt niet." }, { status: 401 })
    }
    await clearAttempts([rules[1]])
    await startSession(user.id, user.email, passwordVersion(user.password_hash))
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Inloggen is nu niet mogelijk. Probeer het later opnieuw." }, { status: 500 })
  }
}
