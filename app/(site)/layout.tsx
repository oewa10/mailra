import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

/** Shared chrome for the public site; <main> holds only the page's own content. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-canvas outline-none">
        {children}
      </main>
      <Footer />
    </>
  )
}
