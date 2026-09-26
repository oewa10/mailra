"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AuthCard, FormError } from "@/components/admin/auth-card"
import { PasswordInput } from "@/components/admin/password-input"

function ResetPasswordForm() {
  const token = useSearchParams().get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <div className="space-y-5">
        <FormError>Deze herstellink is onvolledig. Open de link opnieuw of vraag een nieuwe aan.</FormError>
        <Button asChild variant="outline" className="h-10 w-full">
          <Link href="/admin/forgot-password">Nieuwe herstellink aanvragen</Link>
        </Button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="space-y-5">
        <div className="flex gap-3 border border-hairline bg-linen/60 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-olive-ink" aria-hidden="true" />
          <p className="text-sm text-ink">Uw wachtwoord is gewijzigd. U kunt nu inloggen met uw nieuwe wachtwoord.</p>
        </div>
        <Button asChild className="h-10 w-full">
          <Link href="/admin/login">Naar inloggen</Link>
        </Button>
      </div>
    )
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 10) return setError("Het wachtwoord moet minimaal 10 tekens hebben.")
    if (password !== confirmPassword) return setError("De wachtwoorden komen niet overeen.")

    setLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) setError(data.error || "Wachtwoord wijzigen is mislukt.")
      else setDone(true)
    } catch {
      setError("Geen verbinding. Probeer het later opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleReset} className="space-y-5">
      <div>
        <Label htmlFor="password" className="mb-2 block text-sm text-ink">
          Nieuw wachtwoord
        </Label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="mt-1.5 text-xs text-ink-55">
          Minimaal 10 tekens.
        </p>
      </div>
      <div>
        <Label htmlFor="confirm-password" className="mb-2 block text-sm text-ink">
          Herhaal wachtwoord
        </Label>
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {error && <FormError>{error}</FormError>}
      <Button type="submit" disabled={loading} className="h-10 w-full">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Wachtwoord opslaan
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Nieuw wachtwoord"
      description="Kies een nieuw wachtwoord voor uw beheeraccount. De herstellink is één uur geldig."
      footer={
        <Link href="/admin/login" className="link-underline">
          ← Terug naar inloggen
        </Link>
      }
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  )
}
