"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Tag, LogOut } from "lucide-react"
import { useState } from "react"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
      setLoggingOut(false)
    }
  }

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen pt-20">
      <div className="p-6 flex flex-col h-screen">
        <div>
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
        </div>

        <div className="mt-auto pt-6 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Terug naar Website
          </Link>
          
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            {loggingOut ? "Uitloggen..." : "Uitloggen"}
          </button>
        </div>
      </div>
    </aside>
  )
}
