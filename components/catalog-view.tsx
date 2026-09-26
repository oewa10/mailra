import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { Container, Section, Eyebrow } from "@/components/site/primitives"
import { Button } from "@/components/ui/button"
import type { Catalog, CatalogCategory } from "@/lib/db"
import { siteConfig } from "@/lib/site-config"

const DEFAULT_LEAD =
  "Van elegante stoelen tot stijlvolle tafels en decoratieve accessoires — wij hebben alles om uw evenement compleet te maken."

export function CatalogView({
  catalog,
  selected,
}: {
  catalog: Catalog | null
  selected: CatalogCategory | null
}) {
  const categories = catalog?.categories ?? []
  const products = (catalog?.products ?? []).filter((p) => !selected || p.category === selected.id)

  const breadcrumbs = selected && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Producten", item: `${siteConfig.url}/producten` },
      { "@type": "ListItem", position: 2, name: selected.name, item: `${siteConfig.url}/producten/${selected.id}` },
    ],
  }

  return (
    <main className="min-h-screen bg-canvas">
      <Header />

      <section
        className="bg-linen"
        style={{ paddingTop: "calc(var(--header-h) + var(--space-section-sm))", paddingBottom: "var(--space-section-sm)" }}
      >
        <Container size="wide">
          {selected ? (
            <nav aria-label="Kruimelpad" className="text-eyebrow">
              <Link href="/producten" className="link-underline hover:text-ink">
                Collectie
              </Link>
              <span className="mx-2 text-ink-55" aria-hidden="true">
                /
              </span>
              <span aria-current="page">{selected.name}</span>
            </nav>
          ) : (
            <Eyebrow>Verhuur</Eyebrow>
          )}
          <h1 className="text-display-2 mt-4 max-w-3xl text-ink">
            {selected ? `${selected.name} huren` : "Meubilair, styling en decoratie huren"}
          </h1>
          <p className="text-lead mt-6 max-w-xl">{selected?.description || DEFAULT_LEAD}</p>
        </Container>
      </section>

      {categories.length > 0 && (
        <section
          className="sticky z-30 border-b border-hairline bg-canvas/95 backdrop-blur-sm"
          style={{ top: "var(--header-h)" }}
        >
          <Container size="wide">
            <CategoryFilter
              categories={categories}
              selectedCategory={selected?.id ?? null}
              total={catalog?.products.length ?? 0}
            />
          </Container>
        </section>
      )}

      <Section reveal={false}>
        <Container size="wide">
          <ProductGrid products={products} />
        </Container>
      </Section>

      <section className="bg-olive-deep py-20 text-center">
        <Container>
          <h2 className="text-h2 !text-3xl text-canvas sm:!text-4xl">Interesse in onze producten?</h2>
          <p className="mt-4 text-lg text-canvas/75">
            Neem contact met ons op voor een vrijblijvende offerte op maat.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 rounded-[2px] px-8">
            <Link href="/contact">Vraag Offerte Aan</Link>
          </Button>
        </Container>
      </section>

      <Footer />

      {breadcrumbs && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      )}
    </main>
  )
}
