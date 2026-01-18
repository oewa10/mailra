import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/db"

interface ProductGridProps {
  selectedCategory: string
}

export async function ProductGrid({ selectedCategory }: ProductGridProps) {
  const products = await getProducts()
  
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product: any) => product.category === selectedCategory)

  if (filteredProducts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-muted-foreground">
          Geen producten gevonden in deze categorie.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="group"
        >
          <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-foreground">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            {product.dimensions && (
              <p className="mt-2 text-xs text-muted-foreground">
                Afmetingen: {product.dimensions}
              </p>
            )}
            {product.capacity && (
              <p className="text-xs text-muted-foreground">
                Capaciteit: {product.capacity}
              </p>
            )}
            <Link href={`/contact?product=${encodeURIComponent(product.name)}`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 w-full rounded-full bg-transparent"
              >
                Vraag beschikbaarheid
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
