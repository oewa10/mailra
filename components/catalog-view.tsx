import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { Container, Section, Eyebrow } from "@/components/site/primitives"
import { Button } from "@/components/ui/button"
import type { Catalog, CatalogCategory, CatalogProduct } from "@/lib/db"
import { BUSINESS_ID, JsonLd, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo"

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

  const path = selected ? `/producten/${selected.id}` : "/producten"
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Producten", path: "/producten" },
    ...(selected ? [{ name: selected.name, path }] : []),
  ])

  return (
    <>

      <section
        className="bg-linen"
        style={{ paddingTop: "calc(var(--header-h) + var(--space-section-sm))", paddingBottom: "var(--space-section-sm)" }}
      >
        <Container size="wide">
          {selected ? (
            <nav aria-label="Kruimelpad" className="text-eyebrow">
              <Link href="/producten" className="link-underline hover:text-ink">
                Producten
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
            {selected ? `${selected.name} huren` : "Stoelen, tafels en decoratie huren"}
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

      <JsonLd data={breadcrumbs} />
      {products.some((p) => p.price != null) && <JsonLd data={offersJsonLd(products, path)} />}
    </>
  )
}

/**
 * Priced products as rental offers. Products without a price are left out: Google reports
 * Product markup without an offer as an error. Each item points at its card on this page.
 */
function offersJsonLd(products: CatalogProduct[], path: string) {
  const priced = products.filter((p) => p.price != null)
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: priced.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        "@id": absoluteUrl(`${path}#${product.id}`),
        name: product.name,
        ...(product.description && { description: product.description }),
        ...(product.image && { image: absoluteUrl(product.image) }),
        ...(product.dimensions && { size: product.dimensions }),
        offers: {
          "@type": "Offer",
          url: absoluteUrl(`${path}#${product.id}`),
          price: product.price!.toFixed(2),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
          seller: { "@id": BUSINESS_ID },
        },
      },
    })),
  }
}
