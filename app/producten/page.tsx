import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { Container, Section, Eyebrow } from "@/components/site/primitives"
import { Button } from "@/components/ui/button"
import { getCategoriesWithProductCounts } from "@/lib/db"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meubilair, Styling en Decoratie Huren",
  description:
    "Stoelen, tafels en decoratie huren voor uw bruiloft of feest. Bekijk de collectie van Caftan by Mailra — levering en opbouw door heel Nederland.",
  alternates: { canonical: "/producten" },
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const selectedCategory = category || "all"

  let categories: any[] = []
  try {
    const categoriesWithCounts = await getCategoriesWithProductCounts(true)
    categories = (categoriesWithCounts as any[]).filter((cat) => cat.product_count > 0)
  } catch {
    categories = []
  }

  return (
    <main className="min-h-screen bg-canvas">
      <Header />

      {/* Hero */}
      <section
        className="bg-linen"
        style={{ paddingTop: "calc(var(--header-h) + var(--space-section-sm))", paddingBottom: "var(--space-section-sm)" }}
      >
        <Container size="wide">
          <Eyebrow>Verhuur</Eyebrow>
          <h1 className="text-display-2 mt-4 max-w-3xl text-ink">
            Meubilair, styling en decoratie huren
          </h1>
          <p className="text-lead mt-6 max-w-xl">
            Van elegante stoelen tot stijlvolle tafels en decoratieve accessoires — wij
            hebben alles om uw evenement compleet te maken.
          </p>
        </Container>
      </section>

      {/* Category filter */}
      <section
        className="sticky z-30 border-b border-hairline bg-canvas/95 backdrop-blur-sm"
        style={{ top: "var(--header-h)" }}
      >
        <Container size="wide">
          <CategoryFilter categories={categories as any} selectedCategory={selectedCategory} />
        </Container>
      </section>

      {/* Grid */}
      <Section reveal={false}>
        <Container size="wide">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid selectedCategory={selectedCategory} />
          </Suspense>
        </Container>
      </Section>

      {/* CTA */}
      <section className="bg-olive-deep py-20 text-center">
        <Container>
          <h2 className="text-h2 !text-3xl text-canvas sm:!text-4xl">
            Interesse in onze producten?
          </h2>
          <p className="mt-4 text-lg text-canvas/75">
            Neem contact met ons op voor een vrijblijvende offerte op maat.
          </p>
          <a href="/contact">
            <Button size="lg" variant="secondary" className="mt-8 rounded-[2px] px-8">
              Vraag Offerte Aan
            </Button>
          </a>
        </Container>
      </section>

      <Footer />
    </main>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-[var(--gap-grid)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-linen" />
          <div className="mt-4 h-4 w-2/3 bg-linen" />
          <div className="mt-2 h-3 w-1/2 bg-linen" />
        </div>
      ))}
    </div>
  )
}
