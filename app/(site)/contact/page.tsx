import Link from "next/link"
import { Phone, Mail, Clock, MapPin } from "lucide-react"
import { Suspense } from "react"
import { Photo } from "@/components/site/photo"
import { photos } from "@/lib/photos"
import { ContactPageForm, ContactPageFormFromUrl } from "@/components/contact-page-form"
import { Container, Eyebrow, Hairline } from "@/components/site/primitives"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { siteConfig, whatsAppChatUrl } from "@/lib/site-config"
import type { Metadata } from "next"
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Contact & offerte aanvragen",
  description:
    `Vraag een vrijblijvende offerte aan bij Caftan by Mailra in Amersfoort voor uw bruiloft of feest. Bel, mail of app ons direct op ${siteConfig.phone.display}.`,
  path: "/contact",
})

const contactInfo = [
  {
    icon: Phone,
    title: "Telefoon",
    value: siteConfig.phone.display,
    href: siteConfig.phone.href,
    description: "Bel ons direct voor snelle vragen",
  },
  {
    icon: Mail,
    title: "E-mail",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    description: "Stuur ons een e-mail",
  },
  {
    icon: Clock,
    title: "Openingstijden",
    value: siteConfig.hours.display,
    href: null,
    description: siteConfig.hours.closed,
  },
  {
    icon: MapPin,
    title: "Locatie",
    value: siteConfig.address.display,
    href: null,
    description: "Levering door heel Nederland",
  },
]

// Sourced from het verhuurbeleid (/verhuurbeleid) — the canonical policy document.
const faqs = [
  {
    q: "Wat is de standaard huurperiode?",
    a: "De standaard huurperiode is 24 uur, tenzij anders overeengekomen. Verlenging is mogelijk op basis van beschikbaarheid en tegen een extra vergoeding. Bloemenbogen zijn enkel voor één dag te huur.",
  },
  {
    q: "Moet ik een aanbetaling doen?",
    a: "Ja, bij bevestiging van uw reservering vragen wij een aanbetaling van 50% van de totale huurprijs. Het resterende bedrag dient uiterlijk 7 dagen voor aanvang van de huurperiode te worden voldaan.",
  },
  {
    q: "Leveren jullie ook op zondag?",
    a: "Neem contact met ons op om uw gewenste leverdatum te bespreken — wij kijken graag wat mogelijk is. De bezorgkosten liggen tussen de €20 en €100 (brengen en ophalen), afhankelijk van de afstand.",
  },
  {
    q: "Wat als er iets beschadigd raakt?",
    a: "Bij aanvang van de huurperiode wordt een borgsom in rekening gebracht. Deze wordt terugbetaald na inspectie, mits de items in dezelfde staat worden geretourneerd. Eventuele reparatie- of vervangingskosten worden verrekend met de borg.",
  },
  {
    q: "Kan ik mijn reservering annuleren?",
    a: "Tot 30 dagen voor de huurdatum is annulering kosteloos. Tussen 30 en 14 dagen wordt 50% van de aanbetaling terugbetaald; binnen 14 dagen vervalt de aanbetaling. Bekijk het volledige verhuurbeleid voor alle details.",
  },
]

export default function ContactPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />

      {/* Hero */}
      <section
        className="bg-linen"
        style={{ paddingTop: "calc(var(--header-h) + var(--space-section-sm))", paddingBottom: "var(--space-section-sm)" }}
      >
        <Container size="wide" className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Eyebrow>Offerte aanvragen</Eyebrow>
            <h1 className="text-display-2 mt-4 max-w-2xl text-ink">
              Laten we uw evenement bespreken
            </h1>
            <p className="text-lead mt-6 max-w-xl">
              Heeft u vragen of wilt u een vrijblijvende offerte ontvangen? Wij staan klaar
              om u te helpen bij het plannen van uw perfecte evenement.
            </p>
          </div>
          <div className="relative hidden aspect-[5/4] overflow-hidden bg-canvas lg:block">
            <Photo slot={photos.contact} priority sizes="(min-width: 1024px) 40vw, 1px" />
          </div>
        </Container>
      </section>

      {/* Form + channels */}
      <section className="section-y bg-canvas">
        <Container size="wide">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="order-2 border border-hairline bg-surface p-8 lg:order-1">
              <h2 className="text-h3 !text-xl text-ink">Stuur ons een bericht</h2>
              <p className="mt-2 text-sm text-ink-70">
                Vul het formulier in — wij openen WhatsApp met uw gegevens al ingevuld,
                zodat u het direct kunt versturen.
              </p>
              <div className="mt-8">
                {/* Static page: the ?product= prefill is read in the browser. */}
                <Suspense fallback={<ContactPageForm />}>
                  <ContactPageFormFromUrl />
                </Suspense>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="space-y-1">
                {contactInfo.map((item) => (
                  <div key={item.title}>
                    <Hairline />
                    <div className="flex items-center gap-4 py-5">
                      <item.icon className="h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-ink-55">{item.title}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="link-underline text-lg font-medium text-ink"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-lg font-medium text-ink">{item.value}</p>
                        )}
                        <p className="text-xs text-ink-55">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Hairline />
              </div>

              <a
                href={whatsAppChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-[2px] bg-[#25D366] px-6 py-3 font-medium text-ink transition-opacity hover:opacity-90"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat direct via WhatsApp
              </a>

              <div className="mt-8 border border-hairline bg-linen p-6">
                <h3 className="font-medium text-ink">Werkgebied</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-70">
                  Vanuit Amersfoort leveren wij door heel Nederland: van Utrecht en
                  Amsterdam tot Rotterdam, Den Haag en Gelderland.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-y-sm bg-linen">
        <Container size="text">
          <div className="text-center">
            <Eyebrow>Veelgestelde vragen</Eyebrow>
            <h2 className="text-h2 !text-3xl mt-4 text-ink">Goed om te weten</h2>
          </div>

          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-hairline">
                <AccordionTrigger className="text-left text-base font-medium text-ink hover:no-underline [&>svg]:text-gold-ink">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-ink-70">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-8 text-center text-sm text-ink-55">
            Meer details?{" "}
            <Link href="/verhuurbeleid" className="link-underline text-gold-ink">
              Bekijk het volledige verhuurbeleid
            </Link>
          </p>
        </Container>
      </section>
    </>
  )
}
