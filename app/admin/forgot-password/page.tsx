"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Er is een fout opgetreden")
        return
      }

      setSubmitted(true)
      setMessage(data.message)
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het later opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border p-8">
          <h1 className="font-serif text-3xl text-foreground mb-2">Wachtwoord Vergeten</h1>
          <p className="text-muted-foreground mb-8">Voer uw e-mailadres in om uw wachtwoord opnieuw in te stellen</p>

          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 text-green-600 text-sm">
                {message}
              </div>
              <p className="text-sm text-muted-foreground">
                Controleer uw e-mail voor verdere instructies.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  E-mailadres
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mailra.nl"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full"
              >
                {loading ? "Bezig..." : "Verstuur Reset Link"}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              href="/admin/login"
              className="text-sm text-primary hover:underline"
            >
              Terug naar inloggen
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
