"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard, FormError } from "@/components/admin/auth-card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) setError(data.error || "Er ging iets mis.")
      else setMessage(data.message)
    } catch {
      setError("Geen verbinding. Probeer het later opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Wachtwoord vergeten"
      description={message ? undefined : "Vul het e-mailadres van uw beheeraccount in. We maken een herstellink voor u aan."}
      footer={
        <Link href="/admin/login" className="link-underline">
          ← Terug naar inloggen
        </Link>
      }
    >
      {message ? (
        <div className="space-y-4">
          <div className="flex gap-3 border border-hairline bg-linen/60 p-4">
            <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-olive-ink" aria-hidden="true" />
            <p className="text-sm text-ink">{message}</p>
          </div>
          <p className="text-xs leading-relaxed text-ink-55">
            Geen link ontvangen? De herstellink wordt vastgelegd in de serverlogboeken van de website. Vraag
            degene die de website technisch beheert om de link aan u door te sturen.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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
          {error && <FormError>{error}</FormError>}
          <Button type="submit" disabled={loading} className="h-10 w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Herstellink aanvragen
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
