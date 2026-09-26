"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { CatalogCategory } from "@/lib/db"

const linkClass = (active: boolean) =>
  cn(
    "link-underline shrink-0 text-eyebrow !tracking-[0.14em] transition-colors",
    active ? "text-ink link-underline-active" : "text-ink-55 hover:text-ink",
  )

export function CategoryFilter({
  categories,
  selectedCategory,
  total,
}: {
  categories: readonly CatalogCategory[]
  selectedCategory: string | null
  total: number
}) {
  const nav = useRef<HTMLElement>(null)

  // On narrow screens the active tab can sit past the fold of the scroller; bring it into view.
  useEffect(() => {
    const el = nav.current
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!el || !active) return
    const overflow = active.offsetLeft + active.offsetWidth - el.clientWidth
    if (overflow > 0 || active.offsetLeft < el.scrollLeft) {
      el.scrollLeft = Math.max(0, active.offsetLeft - 24)
    }
  }, [selectedCategory])

  return (
    <nav
      ref={nav}
      className="relative flex gap-8 overflow-x-auto py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Filter producten op categorie"
    >
      <Link
        href="/producten"
        scroll={false}
        aria-current={selectedCategory === null ? "page" : undefined}
        className={linkClass(selectedCategory === null)}
      >
        Alle Producten
        <span className="ml-1.5 text-ink-55">({total})</span>
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/producten/${category.id}`}
          scroll={false}
          aria-current={selectedCategory === category.id ? "page" : undefined}
          className={linkClass(selectedCategory === category.id)}
        >
          {category.name}
          <span className="ml-1.5 text-ink-55">({category.productCount})</span>
        </Link>
      ))}
    </nav>
  )
}
