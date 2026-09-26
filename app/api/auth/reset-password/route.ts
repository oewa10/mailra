import { NextResponse } from "next/server"
import { z } from "zod"
import { resetPasswordWithToken } from "@/lib/db"
import { clientIp, recordAttempt, retryAfter, tooManyAttempts } from "@/lib/auth/rate-limit"
import { parseJson } from "@/lib/admin/validation"

const schema = z.object({
  token: z.string().min(1, "Ongeldige herstellink").max(100),
  password: z.string().min(10, "Het wachtwoord moet minimaal 10 tekens hebben").max(200),
})

export async function POST(request: Request) {
  const { data, error } = await parseJson(request, schema)
  if (error) return error

  // Tokens can't be guessed; this caps the bcrypt work an anonymous caller can trigger.
  const rules = [{ key: `reset:ip:${clientIp(request)}`, limit: 20 }]

  try {
    const wait = await retryAfter(rules, 15 * 60)
    if (wait) return tooManyAttempts(wait, "Probeer het")
    await recordAttempt(rules)

    if (!(await resetPasswordWithToken(data.token, data.password))) {
      return NextResponse.json({ error: "Deze herstellink is ongeldig of verlopen." }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Reset password error:", err)
    return NextResponse.json({ error: "Er ging iets mis. Probeer het later opnieuw." }, { status: 500 })
  }
}
