import { NextResponse } from "next/server"
import { changeAdminPassword } from "@/lib/db"
import { getSession } from "@/lib/auth/server"
import { parseJson, passwordChangeSchema } from "@/lib/admin/validation"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "U bent niet (meer) ingelogd." }, { status: 401 })

  const { data, error } = await parseJson(request, passwordChangeSchema)
  if (error) return error

  try {
    const result = await changeAdminPassword(session.uid, data.currentPassword, data.newPassword)
    if (result === "wrong-password") {
      return NextResponse.json({ error: "Uw huidige wachtwoord klopt niet." }, { status: 400 })
    }
    if (result === "not-found") {
      return NextResponse.json({ error: "Account niet gevonden." }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Change password error:", err)
    return NextResponse.json({ error: "Wachtwoord wijzigen is mislukt." }, { status: 500 })
  }
}
