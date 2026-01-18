"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tag, LogOut } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen pt-20">
      <div className="p-6">
        <h2 className="font-serif text-2xl text-foreground mb-8">Admin Panel</h2>
        
        <nav className="space-y-2">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          
          <Link
            href="/admin/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/products")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Package className="h-5 w-5" />
            Producten
          </Link>
          
          <Link
            href="/admin/categories"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/categories")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Tag className="h-5 w-5" />
            Categorieën
          </Link>
        </nav>

        <div className="mt-12 pt-6 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Terug naar Website
          </Link>
        </div>
      </div>
    </aside>
  )
}
