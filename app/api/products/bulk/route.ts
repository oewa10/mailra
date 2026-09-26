import { NextResponse } from "next/server"
import { deleteProducts, setProductsActive } from "@/lib/db"
import { denyUnlessAdmin } from "@/lib/auth/server"
import { bulkSchema, parseJson } from "@/lib/admin/validation"
import { revalidatePublicSite } from "@/lib/admin/revalidate"

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const { data, error } = await parseJson(request, bulkSchema)
  if (error) return error

  try {
    const affected =
      data.action === "delete"
        ? await deleteProducts(data.ids)
        : await setProductsActive(data.ids, data.action === "activate")
    revalidatePublicSite()
    return NextResponse.json({ affected })
  } catch (err) {
    console.error("Bulk product action error:", err)
    return NextResponse.json({ error: "De bulkactie is mislukt." }, { status: 500 })
  }
}
