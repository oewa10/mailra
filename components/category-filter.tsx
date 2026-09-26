"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string
  product_count?: number
}

interface CategoryFilterProps {
  categories: readonly Category[]
  selectedCategory: string
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <nav
      className="flex gap-8 overflow-x-auto py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Filter producten op categorie"
    >
      <Link
        href="/producten"
        aria-current={selectedCategory === "all" ? "page" : undefined}
        className={cn(
          "link-underline shrink-0 text-eyebrow !tracking-[0.14em] transition-colors",
          selectedCategory === "all"
            ? "text-ink link-underline-active"
            : "text-ink-55 hover:text-ink",
        )}
      >
        Alle Producten
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/producten?category=${category.id}`}
          aria-current={selectedCategory === category.id ? "page" : undefined}
          className={cn(
            "link-underline shrink-0 text-eyebrow !tracking-[0.14em] transition-colors",
            selectedCategory === category.id
              ? "text-ink link-underline-active"
              : "text-ink-55 hover:text-ink",
          )}
        >
          {category.name}
          {typeof category.product_count === "number" && (
            <span className="ml-1.5 text-ink-55">({category.product_count})</span>
          )}
        </Link>
      ))}
    </nav>
  )
}
