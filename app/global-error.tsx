"use client"

// Last resort when the root layout itself fails; it has to render its own document.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="nl">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#FAF8F4", color: "#1F1D1A" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 500 }}>Er ging even iets mis</h1>
            <p style={{ opacity: 0.7 }}>Probeer het opnieuw of kom later terug.</p>
            <button
              onClick={reset}
              style={{ marginTop: 16, padding: "10px 24px", border: 0, background: "#1A2216", color: "#FAF8F4", cursor: "pointer" }}
            >
              Opnieuw proberen
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
