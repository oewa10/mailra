"use client"

import { useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
      <h1 className="font-display text-2xl text-ink">Er ging iets mis</h1>
      <p className="mt-2 max-w-prose text-sm text-ink-70">
        Deze pagina kon niet worden geladen. Controleer uw internetverbinding en probeer het opnieuw. Blijft het
        misgaan, dan is de database mogelijk tijdelijk niet bereikbaar.
      </p>
      {error.digest && <p className="mt-3 font-mono text-xs text-ink-55">Foutcode: {error.digest}</p>}
      <Button className="mt-6" onClick={reset}>
        <RefreshCw className="h-4 w-4" />
        Opnieuw proberen
      </Button>
    </div>
  )
}
