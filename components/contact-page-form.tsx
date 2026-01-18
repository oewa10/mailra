"use client"

import React from "react"

import { useState } from "react"
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

interface ContactPageFormProps {
  preselectedProduct?: string
}

export function ContactPageForm({ preselectedProduct }: ContactPageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Bedankt voor uw bericht!
        </h3>
        <p className="mt-2 text-muted-foreground">
          Wij nemen binnen 24 uur contact met u op om uw evenement te bespreken.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Voornaam *</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Uw voornaam"
            required
            className="rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Achternaam *</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Uw achternaam"
            required
            className="rounded-lg"
          />
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
            className="rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefoonnummer</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+31 6 1234 5678"
            className="rounded-lg"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Datum evenement</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            className="rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventType">Type evenement</Label>
          <Select name="eventType">
            <SelectTrigger className="rounded-lg">
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
        <Input
          id="location"
          name="location"
          placeholder="Stad of adres"
          className="rounded-lg"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="guestCount">Aantal gasten (geschat)</Label>
        <Select name="guestCount">
          <SelectTrigger className="rounded-lg">
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
          className="rounded-lg resize-none"
          defaultValue={
            preselectedProduct
              ? `Ik ben geïnteresseerd in: ${preselectedProduct}\n\n`
              : ""
          }
        />
      </div>
      
      <Button
        type="submit"
        className="w-full rounded-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Verzenden..." : "Verstuur Aanvraag"}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        Door dit formulier te versturen gaat u akkoord met onze privacyvoorwaarden.
      </p>
    </form>
  )
}
