"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Tag, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose()
    }
  }

  // Base sidebar content
  const sidebarContent = (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl text-foreground">Admin Panel</h2>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <nav className="space-y-2">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin")
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary"
          }`}
          onClick={handleLinkClick}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        <Link
          href="/admin/products"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/products")
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary"
          }`}
          onClick={handleLinkClick}
        >
          <Package className="h-5 w-5" />
          <span>Producten</span>
        </Link>
        
        <Link
          href="/admin/categories"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/categories")
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary"
          }`}
          onClick={handleLinkClick}
        >
          <Tag className="h-5 w-5" />
          <span>Categorieën</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-border space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
          onClick={handleLinkClick}
        >
          <LogOut className="h-5 w-5" />
          <span>Terug naar Website</span>
        </Link>
        
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
          <span>{loggingOut ? "Uitloggen..." : "Uitloggen"}</span>
        </button>
      </div>
    </div>
  )

  // For mobile: render a slide-in sidebar when open
  if (isMobile) {
    return (
      <>
        {isMobileOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" 
              onClick={onMobileClose}
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border pt-20 animate-in slide-in-from-left duration-300">
              {sidebarContent}
            </aside>
          </>
        )}
      </>
    )
  }

  // For desktop: render a regular sidebar
  return (
    <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-screen pt-20">
      {sidebarContent}
    </aside>
  )
}
