"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/admin/password-input"
import { apiRequest, errorMessage } from "@/lib/admin/api-client"

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    if (newPassword.length < 10) return setError("Het nieuwe wachtwoord moet minimaal 10 tekens hebben.")
    if (newPassword !== confirmPassword) return setError("De nieuwe wachtwoorden komen niet overeen.")
    if (newPassword === currentPassword) return setError("Kies een ander wachtwoord dan uw huidige.")

    setSaving(true)
    try {
      await apiRequest("/api/admin/password", { method: "POST", body: { currentPassword, newPassword } })
      toast.success("Uw wachtwoord is gewijzigd")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="current-password" className="mb-2 block text-sm text-ink">
          Huidig wachtwoord
        </Label>
        <PasswordInput
          id="current-password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="new-password" className="mb-2 block text-sm text-ink">
          Nieuw wachtwoord
        </Label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          aria-describedby="new-password-hint"
        />
        <p id="new-password-hint" className="mt-1.5 text-xs text-ink-55">
          Minimaal 10 tekens. Een zin van een paar woorden is sterk én makkelijk te onthouden.
        </p>
      </div>
      <div>
        <Label htmlFor="confirm-password" className="mb-2 block text-sm text-ink">
          Herhaal nieuw wachtwoord
        </Label>
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={saving || !currentPassword || !newPassword || !confirmPassword}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Wachtwoord wijzigen
      </Button>
    </form>
  )
}
