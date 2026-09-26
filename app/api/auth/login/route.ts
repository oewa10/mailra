import { NextResponse } from "next/server"
import { z } from "zod"
import { verifyAdminPassword } from "@/lib/db"
import { startSession } from "@/lib/auth/server"
import { parseJson } from "@/lib/admin/validation"

const loginSchema = z.object({
  email: z.string().trim().min(1, "Vul uw e-mailadres in"),
  password: z.string().min(1, "Vul uw wachtwoord in"),
})

export async function POST(request: Request) {
  const { data, error } = await parseJson(request, loginSchema)
  if (error) return error

  try {
    const user = await verifyAdminPassword(data.email, data.password)
    if (!user) {
      return NextResponse.json({ error: "E-mailadres of wachtwoord klopt niet." }, { status: 401 })
    }
    await startSession(user.id, user.email)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Inloggen is nu niet mogelijk. Probeer het later opnieuw." }, { status: 500 })
  }
}
