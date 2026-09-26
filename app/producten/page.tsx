import type { Metadata } from "next"
import { CatalogView } from "@/components/catalog-view"
import { getPublicCatalog } from "@/lib/db"

// Admin edits refresh this page on demand; the interval is only a safety net.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Meubilair, Styling en Decoratie Huren",
  description:
    "Stoelen, tafels en decoratie huren voor uw bruiloft of feest. Bekijk de collectie van Caftan by Mailra — levering en opbouw door heel Nederland.",
  alternates: { canonical: "/producten" },
}

export default async function ProductsPage() {
  return <CatalogView catalog={await getPublicCatalog()} selected={null} />
}
