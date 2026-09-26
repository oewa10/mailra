import Image from "next/image"
import Link from "next/link"
import type { CatalogProduct } from "@/lib/db"

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-h3 !text-xl text-ink">Geen producten gevonden</p>
        <p className="mt-2 text-ink-70">
          Probeer een andere categorie of{" "}
          <Link href="/contact" className="link-underline text-gold-ink">
            neem contact met ons op
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-x-[var(--gap-grid)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id}>
          <Link
            href={`/contact?product=${encodeURIComponent(product.name)}`}
            className="u-hover-zoom group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-linen">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={`${product.name} huren bij Mailra`}
                fill
                // The first row is in view on arrival on desktop.
                loading={index < 4 ? "eager" : "lazy"}
                className="object-cover"
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="mt-4">
              <h2 className="text-h3 !text-base !font-normal text-ink">{product.name}</h2>
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
        </li>
      ))}
    </ul>
  )
}
