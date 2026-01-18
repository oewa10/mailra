"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string
}

interface CategoryFilterProps {
  categories: readonly Category[]
  selectedCategory: string
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams()

  return (
    <nav className="flex gap-1 py-4 overflow-x-auto scrollbar-hide">
      <Link
        href="/producten"
        className={cn(
          "shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors",
          selectedCategory === "all"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        Alle Producten
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/producten?category=${category.id}`}
          className={cn(
            "shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors",
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  )
}
