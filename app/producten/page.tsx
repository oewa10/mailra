import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { getCategoriesWithProductCounts } from "@/lib/db"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Producten - Mailra Verhuur",
  description: "Ontdek ons uitgebreide assortiment van stoelen, tafels en decoratie voor uw evenement.",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const selectedCategory = category || "all"
  
  // Get categories with product counts and filter out empty ones
  const categoriesWithCounts = await getCategoriesWithProductCounts(true)
  const categories = categoriesWithCounts.filter(cat => cat.product_count > 0)

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-secondary pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Onze Producten
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Van elegante stoelen tot stijlvolle tafels en decoratieve accessoires - 
            wij hebben alles om uw evenement compleet te maken.
          </p>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="border-b border-border bg-card sticky top-[73px] z-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <CategoryFilter 
            categories={categories as any} 
            selectedCategory={selectedCategory} 
          />
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid selectedCategory={selectedCategory} />
          </Suspense>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-primary-foreground sm:text-4xl">
            Interesse in onze producten?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Neem contact met ons op voor een vrijblijvende offerte op maat.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-block rounded-full bg-card px-8 py-3 text-base font-medium text-foreground transition-transform hover:scale-105"
          >
            Vraag Offerte Aan
          </a>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
          <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}
