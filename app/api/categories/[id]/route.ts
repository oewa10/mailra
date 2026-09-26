import { NextResponse } from "next/server"
import {
  countProductsInCategory,
  deleteCategory,
  setCategoryActive,
  updateCategory,
} from "@/lib/db"
import { denyUnlessAdmin } from "@/lib/auth/server"
import { activeSchema, categorySchema, parseJson } from "@/lib/admin/validation"
import { revalidatePublicSite } from "@/lib/admin/revalidate"

type Context = { params: Promise<{ id: string }> }

const notFound = () => NextResponse.json({ error: "Categorie niet gevonden." }, { status: 404 })

export async function PUT(request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const { id } = await params
  const { data, error } = await parseJson(request, categorySchema)
  if (error) return error

  try {
    const category = await updateCategory(id, data)
    if (!category) return notFound()
    revalidatePublicSite()
    return NextResponse.json(category)
  } catch (err) {
    console.error("Category update error:", err)
    return NextResponse.json({ error: "Categorie opslaan is mislukt." }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const { id } = await params
  const { data, error } = await parseJson(request, activeSchema)
  if (error) return error

  try {
    const category = await setCategoryActive(id, data.active)
    if (!category) return notFound()
    revalidatePublicSite()
    return NextResponse.json(category)
  } catch (err) {
    console.error("Category status error:", err)
    return NextResponse.json({ error: "Status wijzigen is mislukt." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const { id } = await params
  try {
    const count = await countProductsInCategory(id)
    if (count > 0) {
      return NextResponse.json(
        {
          error: `Deze categorie bevat nog ${count} ${count === 1 ? "product" : "producten"}. Verplaats of verwijder die eerst.`,
        },
        { status: 409 },
      )
    }
    const deleted = await deleteCategory(id)
    if (!deleted) return notFound()
    revalidatePublicSite()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Category delete error:", err)
    return NextResponse.json({ error: "Verwijderen is mislukt." }, { status: 500 })
  }
}
