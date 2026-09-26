import { NextResponse } from "next/server"
import { categoryExists, createProduct, getAdminProducts } from "@/lib/db"
import { denyUnlessAdmin } from "@/lib/auth/server"
import { parseJson, productSchema } from "@/lib/admin/validation"
import { revalidatePublicSite } from "@/lib/admin/revalidate"

export async function GET() {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  try {
    return NextResponse.json(await getAdminProducts())
  } catch (err) {
    console.error("Product fetch error:", err)
    return NextResponse.json({ error: "Producten ophalen is mislukt." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const { data, error } = await parseJson(request, productSchema)
  if (error) return error

  try {
    if (!(await categoryExists(data.category))) {
      return NextResponse.json({ error: "Deze categorie bestaat niet (meer)." }, { status: 400 })
    }
    const product = await createProduct(data)
    revalidatePublicSite()
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error("Product create error:", err)
    return NextResponse.json({ error: "Product opslaan is mislukt." }, { status: 500 })
  }
}
