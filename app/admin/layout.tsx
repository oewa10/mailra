"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

// These admin routes are reachable without a session (see middleware.ts) and
// render their own centered auth card — they should not be wrapped in the
// authenticated dashboard chrome (sidebar, "Uitloggen", etc).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isPublicAuthPage = PUBLIC_ADMIN_PATHS.some((p) => pathname?.startsWith(p))

  if (isPublicAuthPage) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div style={{ height: "var(--header-h)" }}></div>
        {children}
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Spacer to prevent content from being hidden under the fixed header */}
      <div style={{ height: "var(--header-h)" }}></div>

      <div className="flex pt-4">
        {/* Responsive Sidebar */}
        <AdminSidebar
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 w-full lg:ml-64">
          {children}
        </div>
      </div>
      <Footer />

      {/* Mobile menu toggle - positioned at bottom */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-14 flex items-center justify-center"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </main>
  )
}
