import { NextResponse } from "next/server"
import { z } from "zod"
import { resetAdminPassword, verifyResetToken } from "@/lib/db"
import { parseJson } from "@/lib/admin/validation"

const schema = z.object({
  token: z.string().min(1, "Ongeldige herstellink"),
  password: z.string().min(10, "Het wachtwoord moet minimaal 10 tekens hebben").max(200),
})

export async function POST(request: Request) {
  const { data, error } = await parseJson(request, schema)
  if (error) return error

  try {
    const resetToken = await verifyResetToken(data.token)
    if (!resetToken) {
      return NextResponse.json({ error: "Deze herstellink is ongeldig of verlopen." }, { status: 400 })
    }
    await resetAdminPassword(resetToken.user_id, data.password)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Reset password error:", err)
    return NextResponse.json({ error: "Er ging iets mis. Probeer het later opnieuw." }, { status: 500 })
  }
}
