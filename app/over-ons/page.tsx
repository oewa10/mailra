import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Truck, HeartHandshake, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Over Ons - Mailra Verhuur",
  description: "Leer meer over Mailra, uw betrouwbare partner voor evenementverhuur in Nederland.",
}

const process = [
  {
    step: "1",
    title: "Neem Contact Op",
    description: "Vertel ons over uw evenement, datum en wensen. Wij denken graag met u mee.",
  },
  {
    step: "2",
    title: "Offerte op Maat",
    description: "U ontvangt een gedetailleerde offerte afgestemd op uw specifieke behoeften.",
  },
  {
    step: "3",
    title: "Levering & Opbouw",
    description: "Wij leveren en bouwen op de gewenste locatie op het afgesproken tijdstip.",
  },
  {
    step: "4",
    title: "Ophaal Service",
    description: "Na uw evenement halen wij alles weer netjes op. U hoeft niets te doen.",
  },
]

const values = [
  {
    icon: HeartHandshake,
    title: "Persoonlijke Service",
    description: "Elke klant is uniek. Wij luisteren naar uw wensen en bieden advies op maat.",
  },
  {
    icon: Truck,
    title: "Betrouwbare Levering",
    description: "Wij zorgen ervoor dat alles op tijd en in perfecte staat wordt geleverd.",
  },
  {
    icon: Clock,
    title: "Flexibiliteit",
    description: "Van kleine intieme feesten tot grote evenementen - wij passen ons aan.",
  },
]

const serviceAreas = [
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Utrecht",
  "Noord-Holland",
  "Zuid-Holland",
  "Noord-Brabant",
  "Gelderland",
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-secondary pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Over Mailra
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Bij Mailra geloven we dat elke speciale gelegenheid een vleugje elegantie en 
                verfijning verdient. Wij bieden een exclusieve collectie van hoogwaardige 
                stijlvolle decoraties, caftans, stoelen en tafels, perfect afgestemd op 
                bruiloften, feesten en andere bijzondere momenten.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Onze zorgvuldig samengestelde selectie combineert tijdloze schoonheid met 
                uitzonderlijke kwaliteit. Klanttevredenheid staat centraal - met persoonlijke 
                en professionele service denken we graag met u mee om uw wensen werkelijkheid 
                te maken. Wij zorgen voor een moeiteloze ervaring en een resultaat dat uw 
                verwachtingen overtreft.
              </p>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-square">
              <Image
                src="/team.jpg"
                alt="Het Mailra team"
                fill
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              Onze Waarden
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Wat ons onderscheidt van de rest
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{value.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-24 bg-card">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              Hoe het werkt
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              In vier eenvoudige stappen naar uw perfecte evenement
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <div key={step.step} className="relative">
                {index < process.length - 1 && (
                  <div className="absolute top-8 left-1/2 hidden h-px w-full bg-border lg:block" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-serif text-primary-foreground">
                    {step.step}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Service Area Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
                Ons Werkgebied
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Wij leveren door heel Nederland, met speciale focus op de Randstad en omgeving. 
                Neem contact met ons op om te bespreken of wij ook bij u kunnen leveren.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                {serviceAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-foreground"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    {area}
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link href="/contact">
                  <Button className="rounded-full px-8">
                    Neem Contact Op
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-2xl bg-secondary overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="font-serif text-6xl text-primary">NL</p>
                  <p className="mt-4 text-muted-foreground">Landelijke dekking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
            Klaar om uw evenement te plannen?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Neem vandaag nog contact met ons op voor een vrijblijvende offerte. 
            Wij helpen u graag bij het realiseren van uw dromen.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="rounded-full px-8 text-base">
                Vraag Offerte Aan
              </Button>
            </Link>
            <Link href="/producten">
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Bekijk Producten
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
