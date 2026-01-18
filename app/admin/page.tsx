"use client"

import { useState, useEffect } from "react"
import { Package, Tag, TrendingUp } from "lucide-react"
import { products, categories } from "@/lib/products"

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)

  useEffect(() => {
    setProductCount(products.length)
    setCategoryCount(categories.length)
  }, [])

  const stats = [
    {
      icon: Package,
      label: "Totaal Producten",
      value: productCount,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: Tag,
      label: "Categorieën",
      value: categoryCount,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Actieve Items",
      value: productCount,
      color: "bg-green-500/10 text-green-600",
    },
  ]

  return (
    <div className="flex-1 p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welkom in het Mailra admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-card rounded-lg border border-border p-6">
                <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-card rounded-lg border border-border p-8">
          <h2 className="font-serif text-2xl text-foreground mb-4">Aan de slag</h2>
          <p className="text-muted-foreground mb-6">
            Beheer uw producten, categorieën en meer via het admin panel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/products"
              className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-2">Producten Beheren</h3>
              <p className="text-sm text-muted-foreground">Voeg, bewerk of verwijder producten</p>
            </a>
            <a
              href="/admin/categories"
              className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-2">Categorieën Beheren</h3>
              <p className="text-sm text-muted-foreground">Beheer uw productcategorieën</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
