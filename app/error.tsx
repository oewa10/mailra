"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container, Sprig } from "@/components/site/primitives"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas text-center">
      <Container size="text">
        <Sprig className="mx-auto text-sage" />
        <h1 className="text-h2 !text-2xl mt-6 text-ink">Er ging even iets mis</h1>
        <p className="mt-4 text-ink-70">
          Deze pagina kon niet worden geladen. Probeer het opnieuw, of neem direct contact met ons op.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button className="rounded-[2px] px-8" onClick={reset}>
            Opnieuw proberen
          </Button>
          <Link href="/contact" className="link-underline text-sm font-medium text-ink">
            Contact opnemen
          </Link>
        </div>
      </Container>
    </main>
  )
}
