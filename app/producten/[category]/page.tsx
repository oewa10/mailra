import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CatalogView } from "@/components/catalog-view"
import { getPublicCatalog } from "@/lib/db"

export const revalidate = 3600
// Categories created after the build are rendered on first visit and cached like the rest.
export const dynamicParams = true

type Props = { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  const catalog = await getPublicCatalog()
  return catalog?.categories.map((c) => ({ category: c.id })) ?? []
}

async function findCategory(params: Props["params"]) {
  const { category } = await params
  const catalog = await getPublicCatalog()
  return { catalog, selected: catalog?.categories.find((c) => c.id === category) ?? null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { selected } = await findCategory(params)
  if (!selected) return {}
  return {
    title: `${selected.name} Huren`,
    description:
      selected.description ||
      `${selected.name} huren voor uw bruiloft of feest bij Caftan by Mailra — levering en opbouw door heel Nederland.`,
    alternates: { canonical: `/producten/${selected.id}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { catalog, selected } = await findCategory(params)
  if (!selected) notFound()
  return <CatalogView catalog={catalog} selected={selected} />
}
