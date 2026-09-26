"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { buildWhatsAppLink } from "@/lib/site-config"

interface ContactPageFormProps {
  preselectedProduct?: string
}

const eventTypeLabels: Record<string, string> = {
  wedding: "Bruiloft",
  party: "Feest",
  corporate: "Zakelijk evenement",
  other: "Anders",
}

/**
 * Full contact-page enquiry form. There is no backend — submitting builds a
 * pre-filled WhatsApp message from every field and opens it in a new tab,
 * addressed to Mailra's coupled WhatsApp number (see lib/site-config.ts).
 */
export function ContactPageForm({ preselectedProduct }: ContactPageFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)
  const [eventType, setEventType] = useState<string>("")
  const [guestCount, setGuestCount] = useState<string>("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const data = new FormData(form)
    const firstName = String(data.get("firstName") || "")
    const lastName = String(data.get("lastName") || "")
    const email = String(data.get("email") || "")
    const phone = String(data.get("phone") || "")
    const eventDate = String(data.get("eventDate") || "")
    const location = String(data.get("location") || "")
    const message = String(data.get("message") || "")

    const lines = [
      `Hallo Mailra! Ik heb een offerte-aanvraag via de website.`,
      ``,
      `Naam: ${firstName} ${lastName}`.trim(),
      `E-mail: ${email}`,
      phone && `Telefoon: ${phone}`,
      eventDate && `Datum evenement: ${eventDate}`,
      eventType && `Type evenement: ${eventTypeLabels[eventType] || eventType}`,
      location && `Locatie: ${location}`,
      guestCount && `Aantal gasten: ${guestCount}`,
      ``,
      `Bericht: ${message}`,
    ].filter(Boolean)

    const url = buildWhatsAppLink(lines.join("\n"))
    setFallbackUrl(url)
    window.open(url, "_blank", "noopener,noreferrer")
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10">
          <svg className="h-8 w-8 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        <h3 className="text-h3 mt-6 !text-xl text-ink">WhatsApp is geopend</h3>
        <p className="mt-2 text-ink-70">
          We hebben je aanvraag klaargezet in WhatsApp. Verstuur het bericht daar om
          direct met ons in contact te komen.
        </p>
        {fallbackUrl && (
          <a href={fallbackUrl} className="link-underline mt-4 inline-block text-sm text-gold-ink">
            WhatsApp niet geopend? Klik hier
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Voornaam *</Label>
          <Input id="firstName" name="firstName" placeholder="Uw voornaam" required className="rounded-[2px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Achternaam *</Label>
          <Input id="lastName" name="lastName" placeholder="Uw achternaam" required className="rounded-[2px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="uw@email.nl"
            required
            className="rounded-[2px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefoonnummer</Label>
          <Input id="phone" name="phone" type="tel" placeholder="06 12345678" className="rounded-[2px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Datum evenement</Label>
          <Input id="eventDate" name="eventDate" type="date" className="rounded-[2px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventType">Type evenement</Label>
          <Select name="eventType" value={eventType} onValueChange={setEventType}>
            <SelectTrigger id="eventType" className="w-full rounded-[2px]">
              <SelectValue placeholder="Selecteer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wedding">Bruiloft</SelectItem>
              <SelectItem value="party">Feest</SelectItem>
              <SelectItem value="corporate">Zakelijk evenement</SelectItem>
              <SelectItem value="other">Anders</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Locatie evenement</Label>
        <Input id="location" name="location" placeholder="Stad of adres" className="rounded-[2px]" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="guestCount">Aantal gasten (geschat)</Label>
        <Select name="guestCount" value={guestCount} onValueChange={setGuestCount}>
          <SelectTrigger id="guestCount" className="w-full rounded-[2px]">
            <SelectValue placeholder="Selecteer aantal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-25">1 - 25</SelectItem>
            <SelectItem value="26-50">26 - 50</SelectItem>
            <SelectItem value="51-100">51 - 100</SelectItem>
            <SelectItem value="101-200">101 - 200</SelectItem>
            <SelectItem value="200+">200+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Bericht *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={
            preselectedProduct
              ? `Ik ben geïnteresseerd in: ${preselectedProduct}\n\nVertel ons meer over uw evenement en wensen...`
              : "Vertel ons over uw evenement en welke producten u nodig heeft..."
          }
          rows={5}
          required
          className="rounded-[2px] resize-none"
          defaultValue={preselectedProduct ? `Ik ben geïnteresseerd in: ${preselectedProduct}\n\n` : ""}
        />
      </div>

      <Button type="submit" className="w-full rounded-[2px]" size="lg">
        Verstuur via WhatsApp
      </Button>

      <p className="text-xs text-center text-ink-55">
        Bij versturen wordt WhatsApp geopend met een vooraf ingevuld bericht — er wordt
        niets automatisch verzonden of opgeslagen.
      </p>
    </form>
  )
}

export function ContactPageFormFromUrl() {
  const product = useSearchParams().get("product")?.trim().slice(0, 120)
  return <ContactPageForm preselectedProduct={product || undefined} />
}
