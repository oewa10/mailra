"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard, FormError } from "@/components/admin/auth-card"
import { PasswordInput } from "@/components/admin/password-input"

function safeNext(value: string | null) {
  return value && value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin"
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.error || "Inloggen is mislukt.")
        setLoading(false)
        return
      }
      router.replace(safeNext(searchParams.get("next")))
      router.refresh()
    } catch {
      setError("Geen verbinding. Controleer uw internet en probeer het opnieuw.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <Label htmlFor="email" className="mb-2 block text-sm text-ink">
          E-mailadres
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <Label htmlFor="password" className="text-sm text-ink">
            Wachtwoord
          </Label>
          <Link href="/admin/forgot-password" className="link-underline text-xs text-gold-ink">
            Vergeten?
          </Link>
        </div>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <FormError>{error}</FormError>}

      <Button type="submit" disabled={loading} className="h-10 w-full">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Bezig met inloggen…" : "Inloggen"}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <AuthCard
      title="Welkom terug"
      description="Log in om de collectie op de website te beheren."
      footer={
        <Link href="/" className="link-underline">
          ← Terug naar de website
        </Link>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  )
}
