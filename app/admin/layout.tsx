"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile menu toggle */}
      <div className="fixed top-24 left-4 z-30 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-full shadow-md bg-card hover:bg-card/80"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex">
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
    </main>
  )
}
