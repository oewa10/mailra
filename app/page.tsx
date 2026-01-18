import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Phone, Mail, Clock, Users, Award, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"

const categories = [
  {
    name: "Stoelen",
    description: "Elegante stoelen voor elke gelegenheid",
    image: "/category-chairs.jpg",
    href: "/producten?category=stoelen",
  },
  {
    name: "Tafels",
    description: "Tafels in diverse maten en stijlen",
    image: "/category-tables.jpg",
    href: "/producten?category=tafels",
  },
  {
    name: "Decoratie",
    description: "Decoratieve items voor de perfecte sfeer",
    image: "/category-decoration.jpg",
    href: "/producten?category=decoratie",
  },
]

const stats = [
  { icon: Users, value: "50+", label: "Tevreden Klanten" },
  { icon: Award, value: "100%", label: "Persoonlijke Service" },
  { icon: Truck, value: "100%", label: "Betrouwbare Levering" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-event.jpg"
            alt="Prachtig gedecoreerd evenement met Mailra verhuur"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center lg:px-8">
          <h1 className="font-serif text-5xl tracking-tight text-card sm:text-6xl md:text-7xl lg:text-8xl text-balance">
            Maak uw evenement onvergetelijk
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-card/90 leading-relaxed sm:text-xl">
            Hoogwaardige verhuur van stoelen, tafels en decoratie voor bruiloften, 
            feesten en zakelijke evenementen door heel Nederland.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/producten">
              <Button size="lg" className="rounded-full px-8 text-base">
                Bekijk Producten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base bg-card/10 text-card border-card/30 hover:bg-card/20 hover:text-card">
                Neem Contact Op
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-4 font-serif text-4xl text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
              Onze Collectie
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ontdek ons uitgebreide assortiment voor uw perfecte evenement
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-[4/5] relative">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-card">{category.name}</h3>
                  <p className="mt-2 text-sm text-card/80">{category.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-card">
                    <span>Bekijk collectie</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Preview Section */}
      <section className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
                Waarom kiezen voor Mailra?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Elke speciale gelegenheid verdient elegantie en verfijning. Bij Mailra geloven 
                we dat kwaliteit en persoonlijke service het verschil maken. Wij bieden een 
                exclusieve collectie van hoogwaardige decoraties, stoelen, tafels en caftans 
                die uw evenement tot iets onvergetelijks maken.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Onze zorgvuldig samengestelde selectie combineert tijdloze schoonheid met 
                uitzonderlijke kwaliteit. Met persoonlijke aandacht en professionele service 
                denken we graag met u mee om uw wensen werkelijkheid te maken.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Exclusieve collectie met elegante designs",
                  "Persoonlijke service en advies op maat",
                  "Levering en opbouw door heel Nederland",
                  "Moeiteloze ervaring van begin tot eind",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link href="/over-ons">
                  <Button variant="outline" className="rounded-full px-8 bg-transparent">
                    Meer over ons
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-[4/5]">
              <Image
                src="/hero-event.jpg"
                alt="Mailra evenement opzet"
                fill
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-24 bg-background" id="contact">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
                Neem contact op
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Heeft u vragen of wilt u een vrijblijvende offerte ontvangen? 
                Wij helpen u graag bij het plannen van uw evenement.
              </p>
              
              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefoon</p>
                    <a href="tel:+31612345678" className="text-lg font-medium text-foreground hover:text-primary">
                      +31 6 1234 5678
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <a href="mailto:info@mailra.nl" className="text-lg font-medium text-foreground hover:text-primary">
                      info@mailra.nl
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bereikbaar</p>
                    <p className="text-lg font-medium text-foreground">Ma - Za: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
              
              {/* WhatsApp Button */}
              <div className="mt-10">
                <a
                  href="https://wa.me/31612345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-card font-medium transition-transform hover:scale-105"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat via WhatsApp
                </a>
              </div>
            </div>
            
            <div className="rounded-2xl bg-card p-8 shadow-sm border border-border">
              <h3 className="text-xl font-semibold text-foreground">Stuur ons een bericht</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
