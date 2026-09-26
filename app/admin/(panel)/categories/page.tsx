import { PageHeader } from "@/components/admin/shell"
import { CategoriesManager } from "@/components/admin/categories-manager"
import { getAdminCategories } from "@/lib/db"

export const metadata = { title: "Categorieën" }

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams

  let categories
  try {
    categories = await getAdminCategories()
  } catch (error) {
    console.error("Admin categories load error:", error)
    return (
      <>
        <PageHeader eyebrow="Collectie" title="Categorieën" />
        <div className="border border-destructive/30 bg-destructive/5 p-6 text-sm text-ink">
          De categorieën konden niet worden geladen. Controleer de databaseverbinding en ververs de pagina.
        </div>
      </>
    )
  }

  return <CategoriesManager initialCategories={categories} openNew={params.new === "1"} />
}
