import Image from "next/image"
import Link from "next/link"
import { getProducts } from "@/lib/db"

interface ProductGridProps {
  selectedCategory: string
}

export async function ProductGrid({ selectedCategory }: ProductGridProps) {
  const products = await getProducts(true) // Only fetch active products

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product: any) => product.category === selectedCategory)

  if (filteredProducts.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-h3 !text-xl text-ink">Geen producten gevonden</p>
        <p className="mt-2 text-ink-70">Probeer een andere categorie of neem contact met ons op.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-[var(--gap-grid)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.map((product) => (
        <Link
          key={product.id}
          href={`/contact?product=${encodeURIComponent(product.name)}`}
          className="u-hover-zoom group block"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-linen">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={`${product.name} huren bij Mailra`}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-h3 !text-base !font-normal text-ink">{product.name}</h3>
            {(product.dimensions || product.capacity) && (
              <p className="mt-1 text-xs text-ink-55">
                {[product.dimensions, product.capacity].filter(Boolean).join(" · ")}
              </p>
            )}
            <span className="link-underline mt-2 inline-block text-xs font-medium text-gold-ink">
              Vraag beschikbaarheid
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
