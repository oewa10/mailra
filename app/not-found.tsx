import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Container, Sprig } from "@/components/site/primitives"

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-canvas outline-none">
        <section
          className="flex min-h-screen items-center justify-center text-center"
          style={{ paddingTop: "var(--header-h)" }}
        >
          <Container size="text">
            <Sprig className="mx-auto text-sage" />
            <p className="text-display-1 mt-6 !text-7xl text-ink">404</p>
            <h1 className="text-h2 !text-2xl mt-4 text-ink">Deze pagina bestaat niet</h1>
            <p className="mt-4 text-ink-70">
              De pagina die u zoekt is verplaatst of bestaat niet meer. Ga terug naar de
              homepage of bekijk onze collectie.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button className="group rounded-[2px] px-8" asChild>
                <Link href="/">
                  Naar de homepage
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Link href="/producten" className="link-underline text-sm font-medium text-ink">
                Bekijk producten
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
