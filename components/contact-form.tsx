"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
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
      <div className="mt-6 rounded-lg bg-primary/10 p-6 text-center">
        <p className="text-lg font-medium text-foreground">Bedankt voor uw bericht!</p>
        <p className="mt-2 text-muted-foreground">
          Wij nemen zo spoedig mogelijk contact met u op.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Naam</Label>
          <Input
            id="name"
            name="name"
            placeholder="Uw naam"
            required
            className="rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="uw@email.nl"
            required
            className="rounded-lg"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefoonnummer (optioneel)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+31 6 1234 5678"
          className="rounded-lg"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eventDate">Datum evenement (optioneel)</Label>
        <Input
          id="eventDate"
          name="eventDate"
          type="date"
          className="rounded-lg"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Bericht</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Vertel ons over uw evenement en wensen..."
          rows={4}
          required
          className="rounded-lg resize-none"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Verzenden..." : "Verstuur Bericht"}
      </Button>
    </form>
  )
}
