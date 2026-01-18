import { Phone, Mail, Clock, MapPin } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactPageForm } from "@/components/contact-page-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact - Mailra Verhuur",
  description: "Neem contact op met Mailra voor een vrijblijvende offerte of meer informatie over onze verhuurservice.",
}

const contactInfo = [
  {
    icon: Phone,
    title: "Telefoon",
    value: "+31 6 1234 5678",
    href: "tel:+31612345678",
    description: "Bel ons direct voor snelle vragen",
  },
  {
    icon: Mail,
    title: "E-mail",
    value: "info@mailra.nl",
    href: "mailto:info@mailra.nl",
    description: "Stuur ons een e-mail",
  },
  {
    icon: Clock,
    title: "Openingstijden",
    value: "Ma - Za: 9:00 - 18:00",
    href: null,
    description: "Zondag gesloten",
  },
  {
    icon: MapPin,
    title: "Locatie",
    value: "Amsterdam, Nederland",
    href: null,
    description: "Levering door heel Nederland",
  },
]

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>
}) {
  const { product } = await searchParams

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-secondary pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Contact
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Heeft u vragen of wilt u een vrijblijvende offerte ontvangen? 
            Wij staan klaar om u te helpen bij het plannen van uw perfecte evenement.
          </p>
        </div>
      </section>
      
      {/* Contact Info Cards */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-medium text-foreground">{item.title}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-2 block text-lg font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
                Stuur ons een bericht
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Vul het formulier in met uw gegevens en wensen. Wij nemen binnen 
                24 uur contact met u op om uw evenement te bespreken.
              </p>
              
              <div className="mt-10">
                <h3 className="font-medium text-foreground">Direct contact via WhatsApp</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Liever direct chatten? Stuur ons een bericht via WhatsApp voor 
                  snelle antwoorden op uw vragen.
                </p>
                <a
                  href="https://wa.me/31612345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-white font-medium transition-transform hover:scale-105"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat via WhatsApp
                </a>
              </div>
              
              <div className="mt-10 rounded-xl bg-secondary p-6">
                <h3 className="font-medium text-foreground">Werkgebied</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Wij leveren door heel Nederland, met speciale focus op Amsterdam, 
                  Rotterdam, Den Haag, Utrecht en omstreken. Neem contact op om te 
                  bespreken of wij ook bij u kunnen leveren.
                </p>
              </div>
            </div>
            
            <div className="rounded-2xl border border-border bg-background p-8">
              <ContactPageForm preselectedProduct={product} />
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Preview */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-serif text-3xl tracking-tight text-foreground text-center sm:text-4xl">
            Veelgestelde Vragen
          </h2>
          
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-foreground">Wat zijn de minimale huurperiodes?</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Onze standaard huurperiode is 3 dagen, maar wij bieden ook flexibele 
                opties voor kortere of langere periodes. Neem contact op voor maatwerk.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Leveren jullie ook op zondag?</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Ja, wij kunnen ook op zondag leveren en ophalen. Dit kan wel invloed 
                hebben op de prijs. Bespreek uw wensen met ons.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Moet ik een aanbetaling doen?</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Bij bevestiging van uw reservering vragen wij een aanbetaling van 30%. 
                Het resterende bedrag wordt gefactureerd na afloop van het evenement.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Wat als er iets beschadigd raakt?</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Normale slijtage is inbegrepen. Bij schade brengen wij alleen de 
                werkelijke reparatie- of vervangingskosten in rekening.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
