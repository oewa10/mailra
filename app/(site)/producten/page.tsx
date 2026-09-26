import type { Metadata } from "next"
import { CatalogView } from "@/components/catalog-view"
import { getPublicCatalog } from "@/lib/db"
import { pageMetadata } from "@/lib/seo"

// Admin edits refresh this page on demand; the interval is only a safety net.
export const revalidate = 3600

export const metadata: Metadata = pageMetadata({
  title: "Stoelen, tafels en decoratie huren",
  description:
    "Bekijk de volledige verhuurcollectie van Caftan by Mailra: stoelen, tafels, decoratie en meer voor uw bruiloft of feest. Levering en opbouw door heel Nederland.",
  path: "/producten",
})

export default async function ProductsPage() {
  return <CatalogView catalog={await getPublicCatalog()} selected={null} />
}
