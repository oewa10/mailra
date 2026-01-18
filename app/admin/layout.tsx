import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  )
}
