"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { buildWhatsAppLink } from "@/lib/site-config"
import { formatDutchDate } from "@/lib/utils"

/**
 * Short home-page enquiry form. There is no backend — submitting builds a
 * pre-filled WhatsApp message and opens it in a new tab, addressed to
 * Mailra's coupled WhatsApp number (see lib/site-config.ts).
 */
export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const data = new FormData(form)
    const name = String(data.get("name") || "")
    const email = String(data.get("email") || "")
    const phone = String(data.get("phone") || "")
    const eventDate = String(data.get("eventDate") || "")
    const message = String(data.get("message") || "")

    // Built as paragraphs (not a label: value dump), joined with blank lines so it reads like a
    // message someone would actually send.
    const intro = `Hoi Mailra! Mijn naam is ${name} en ik neem contact op via de website.`
    const eventLine = eventDate && `Datum evenement: ${formatDutchDate(eventDate)}`
    const contactLine = `Je kunt mij bereiken via ${email}${phone ? ` of ${phone}` : ""}.`
    const paragraphs = [intro, message, eventLine, contactLine].filter((p): p is string => Boolean(p?.trim()))

    const url = buildWhatsAppLink(paragraphs.join("\n\n"))
    setFallbackUrl(url)
    window.open(url, "_blank", "noopener,noreferrer")
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="rounded-[2px] border border-hairline bg-linen p-6 text-center">
        <p className="text-h3 !text-lg text-ink">WhatsApp is geopend</p>
        <p className="mt-2 text-sm text-ink-70">
          We hebben je bericht klaargezet in WhatsApp. Verstuur het daar om je aanvraag
          bij ons binnen te krijgen.
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
          <Label htmlFor="name">Naam</Label>
          <Input id="name" name="name" placeholder="Uw naam" required className="rounded-[2px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="uw@email.nl"
            required
            className="rounded-[2px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefoonnummer (optioneel)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="06 12345678" className="rounded-[2px]" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventDate">Datum evenement (optioneel)</Label>
        <Input id="eventDate" name="eventDate" type="date" className="rounded-[2px]" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Bericht</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Vertel ons over uw evenement en wensen..."
          rows={4}
          required
          className="rounded-[2px] resize-none"
        />
      </div>

      <Button type="submit" className="w-full rounded-[2px]">
        Verstuur via WhatsApp
      </Button>
    </form>
  )
}
