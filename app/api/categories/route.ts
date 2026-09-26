import { NextResponse } from "next/server"
import { createCategory, getAdminCategories } from "@/lib/db"
import { denyUnlessAdmin } from "@/lib/auth/server"
import { categorySchema, parseJson } from "@/lib/admin/validation"
import { revalidatePublicSite } from "@/lib/admin/revalidate"

export async function GET() {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  try {
    return NextResponse.json(await getAdminCategories())
  } catch (err) {
    console.error("Category fetch error:", err)
    return NextResponse.json({ error: "Categorieën ophalen is mislukt." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const { data, error } = await parseJson(request, categorySchema)
  if (error) return error

  try {
    const category = await createCategory(data)
    revalidatePublicSite()
    return NextResponse.json(category, { status: 201 })
  } catch (err) {
    console.error("Category create error:", err)
    return NextResponse.json({ error: "Categorie opslaan is mislukt." }, { status: 500 })
  }
}
