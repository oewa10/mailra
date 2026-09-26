import Image from "next/image"
import Link from "next/link"
import { Camera } from "lucide-react"
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
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[var(--gap-grid)] sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id}>
          <Link
            href={`/contact?product=${encodeURIComponent(product.name)}`}
            className="u-hover-zoom group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-linen">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={`${product.name} huren bij Mailra`}
                  fill
                  // The first row is in view on arrival on desktop.
                  loading={index < 4 ? "eager" : "lazy"}
                  className="object-cover"
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                />
              ) : (
                <div className="photo-placeholder--light absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-55">
                  <Camera className="h-5 w-5" aria-hidden="true" />
                  <span className="text-eyebrow !text-[0.625rem] !text-ink-55">Foto volgt</span>
                </div>
              )}
            </div>
            <div className="mt-3 sm:mt-4">
              <h2 className="text-h3 !text-[0.9375rem] !font-normal leading-snug text-ink sm:!text-base">{product.name}</h2>
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
