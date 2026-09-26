import { PageHeader } from "@/components/admin/shell"
import {
  ProductsManager,
  type ProductFilters,
  type ProductIssueFilter,
  type ProductSort,
  type ProductStatusFilter,
} from "@/components/admin/products-manager"
import { getAdminCategories, getAdminProducts } from "@/lib/db"

export const metadata = { title: "Producten" }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback
}

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams

  let data
  try {
    const [products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()])
    data = { products, categories }
  } catch (error) {
    console.error("Admin products load error:", error)
    return (
      <>
        <PageHeader eyebrow="Collectie" title="Producten" />
        <div className="border border-destructive/30 bg-destructive/5 p-6 text-sm text-ink">
          De producten konden niet worden geladen. Controleer de databaseverbinding en ververs de pagina.
        </div>
      </>
    )
  }

  const category =
    typeof params.category === "string" && data.categories.some((c) => c.id === params.category)
      ? params.category
      : "all"

  const filters: ProductFilters = {
    q: typeof params.q === "string" ? params.q : "",
    category,
    status: pick<ProductStatusFilter>(params.status, ["all", "active", "hidden"], "all"),
    issue: pick<Exclude<ProductIssueFilter, null> | "none">(params.issue, ["no-image", "no-description", "none"], "none") === "none"
      ? null
      : (params.issue as Exclude<ProductIssueFilter, null>),
    sort: pick<ProductSort>(params.sort, ["newest", "name", "updated"], "newest"),
  }

  return (
    <ProductsManager
      initialProducts={data.products}
      categories={data.categories}
      initialFilters={filters}
      openNew={params.new === "1"}
      editId={typeof params.edit === "string" ? params.edit : null}
    />
  )
}
