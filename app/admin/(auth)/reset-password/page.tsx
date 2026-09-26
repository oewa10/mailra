"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError('Invalid reset link')
    }
  }, [token])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to reset password")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/admin/login")
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">Invalid Link</h1>
            <p className="text-muted-foreground mb-6">This password reset link is invalid or has expired.</p>
            <Link href="/admin/login">
              <Button className="rounded-full">Back to Login</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border p-8">
          <h1 className="font-serif text-3xl text-foreground mb-2">Wachtwoord Opnieuw Instellen</h1>
          <p className="text-muted-foreground mb-8">Voer uw nieuwe wachtwoord in</p>

          {success ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 text-green-600 text-sm">
                Wachtwoord succesvol gewijzigd! U wordt omgeleid naar de inlogpagina...
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nieuw Wachtwoord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bevestig Wachtwoord
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? "Bezig..." : "Wachtwoord Wijzigen"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
