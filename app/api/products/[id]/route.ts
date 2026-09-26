import { NextResponse } from "next/server"
import {
  categoryExists,
  deleteProduct,
  getProductById,
  setProductActive,
  updateProduct,
} from "@/lib/db"
import { denyUnlessAdmin } from "@/lib/auth/server"
import { activeSchema, parseJson, productSchema } from "@/lib/admin/validation"
import { revalidatePublicSite } from "@/lib/admin/revalidate"

type Context = { params: Promise<{ id: string }> }

const notFound = () => NextResponse.json({ error: "Product niet gevonden." }, { status: 404 })

export async function GET(_request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const product = await getProductById((await params).id)
  return product ? NextResponse.json(product) : notFound()
}

export async function PUT(request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const { id } = await params
  const { data, error } = await parseJson(request, productSchema)
  if (error) return error

  try {
    if (!(await categoryExists(data.category))) {
      return NextResponse.json({ error: "Deze categorie bestaat niet (meer)." }, { status: 400 })
    }
    const product = await updateProduct(id, data)
    if (!product) return notFound()
    revalidatePublicSite()
    return NextResponse.json(product)
  } catch (err) {
    console.error("Product update error:", err)
    return NextResponse.json({ error: "Product opslaan is mislukt." }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const { id } = await params
  const { data, error } = await parseJson(request, activeSchema)
  if (error) return error

  try {
    const product = await setProductActive(id, data.active)
    if (!product) return notFound()
    revalidatePublicSite()
    return NextResponse.json(product)
  } catch (err) {
    console.error("Product status error:", err)
    return NextResponse.json({ error: "Status wijzigen is mislukt." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  try {
    const deleted = await deleteProduct((await params).id)
    if (!deleted) return notFound()
    revalidatePublicSite()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Product delete error:", err)
    return NextResponse.json({ error: "Verwijderen is mislukt." }, { status: 500 })
  }
}
