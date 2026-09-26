import Link from "next/link"
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { nl } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/admin/shell"
import { Thumb } from "@/components/admin/thumb"
import { getAdminCategories, getAdminStats, getRecentlyUpdatedProducts } from "@/lib/db"
import type { AdminCategory, AdminProduct, AdminStats } from "@/lib/admin/types"

export const metadata = { title: "Overzicht" }

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("nl-NL", { hour: "numeric", hour12: false, timeZone: "Europe/Amsterdam" }).format(
      new Date(),
    ),
  )
  if (hour < 12) return "Goedemorgen"
  if (hour < 18) return "Goedemiddag"
  return "Goedenavond"
}

async function loadDashboard(): Promise<{
  stats: AdminStats
  recent: AdminProduct[]
  categories: AdminCategory[]
} | null> {
  try {
    const [stats, recent, categories] = await Promise.all([
      getAdminStats(),
      getRecentlyUpdatedProducts(5),
      getAdminCategories(),
    ])
    return { stats, recent, categories }
  } catch (error) {
    console.error("Dashboard load error:", error)
    return null
  }
}

export default async function AdminDashboardPage() {
  const data = await loadDashboard()
  const today = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Amsterdam",
  }).format(new Date())

  return (
    <>
      <PageHeader
        eyebrow={today}
        title={greeting()}
        description="Hier ziet u in één oogopslag hoe de collectie op de website ervoor staat."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/admin/categories?new=1">Nieuwe categorie</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/products?new=1">
                <Plus className="h-4 w-4" />
                Nieuw product
              </Link>
            </Button>
          </>
        }
      />

      {!data ? (
        <div className="border border-destructive/30 bg-destructive/5 p-6 text-sm text-ink">
          De database is op dit moment niet bereikbaar. Controleer de databaseverbinding en ververs de pagina.
        </div>
      ) : (
        <Dashboard {...data} />
      )}
    </>
  )
}

function Dashboard({
  stats,
  recent,
  categories,
}: {
  stats: AdminStats
  recent: AdminProduct[]
  categories: AdminCategory[]
}) {
  const hidden = stats.products - stats.activeProducts
  const tiles = [
    { label: "Producten", value: stats.products, href: "/admin/products" },
    { label: "Zichtbaar op de site", value: stats.activeProducts, href: "/admin/products?status=active" },
    { label: "Verborgen", value: hidden, href: "/admin/products?status=hidden" },
    { label: "Categorieën", value: stats.categories, href: "/admin/categories" },
  ]

  const attention = [
    {
      count: stats.withoutImage,
      label: stats.withoutImage === 1 ? "product zonder afbeelding" : "producten zonder afbeelding",
      href: "/admin/products?issue=no-image",
    },
    {
      count: stats.withoutDescription,
      label: stats.withoutDescription === 1 ? "product zonder beschrijving" : "producten zonder beschrijving",
      href: "/admin/products?issue=no-description",
    },
    {
      count: stats.hiddenByCategory,
      label:
        stats.hiddenByCategory === 1
          ? "product niet zichtbaar doordat de categorie verborgen is"
          : "producten niet zichtbaar doordat hun categorie verborgen is",
      href: "/admin/categories",
    },
  ].filter((item) => item.count > 0)

  const categoryNames = new Map(categories.map((c) => [c.id, c.name]))

  return (
    <div className="space-y-10">
      <section aria-label="Kerncijfers" className="grid grid-cols-2 gap-px overflow-hidden border border-hairline bg-hairline lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="group bg-surface p-5 transition-colors hover:bg-linen/60 sm:p-6"
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-55">{tile.label}</p>
            <p className="font-display mt-3 text-4xl font-light tabular-nums text-ink sm:text-5xl">{tile.value}</p>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <section className="lg:col-span-3" aria-labelledby="recent-heading">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="recent-heading" className="font-display text-xl text-ink">
              Recent bijgewerkt
            </h2>
            <Link href="/admin/products" className="link-underline text-sm text-gold-ink">
              Alle producten
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="border border-dashed border-hairline bg-surface p-8 text-center">
              <p className="text-sm text-ink-70">Er staan nog geen producten in de collectie.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/products?new=1">
                  <Plus className="h-4 w-4" />
                  Eerste product toevoegen
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-hairline border border-hairline bg-surface">
              {recent.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/products?edit=${encodeURIComponent(product.id)}`}
                    className="flex items-center gap-4 p-3 transition-colors hover:bg-linen/60 sm:p-4"
                  >
                    <Thumb src={product.image} alt={product.name} className="h-12 w-12" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">{product.name}</p>
                      <p className="truncate text-xs text-ink-55">
                        {categoryNames.get(product.category) ?? product.category} ·{" "}
                        {formatDistanceToNow(new Date(product.updated_at), { addSuffix: true, locale: nl })}
                      </p>
                    </div>
                    {!product.active && (
                      <span className="shrink-0 border border-hairline px-2 py-0.5 text-xs text-ink-55">
                        Verborgen
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-2" aria-labelledby="attention-heading">
          <h2 id="attention-heading" className="font-display mb-4 text-xl text-ink">
            Aandachtspunten
          </h2>
          {attention.length === 0 ? (
            <div className="border border-hairline bg-surface p-6">
              <p className="text-sm text-ink-70">
                Alles ziet er goed uit: elk product heeft een afbeelding en een beschrijving.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-hairline border border-hairline bg-surface">
              {attention.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-4 p-4 transition-colors hover:bg-linen/60"
                  >
                    <span className="font-display w-8 text-2xl tabular-nums text-gold-ink">{item.count}</span>
                    <span className="flex-1 text-sm text-ink">{item.label}</span>
                    <ArrowRight className="h-4 w-4 text-ink-55 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <a
            href="/producten"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-between border border-hairline bg-linen/60 p-4 text-sm text-ink transition-colors hover:bg-linen"
          >
            <span>
              <span className="block font-medium">Bekijk de collectie zoals klanten die zien</span>
              <span className="text-xs text-ink-55">Opent de productpagina in een nieuw tabblad</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </a>
        </section>
      </div>
    </div>
  )
}
