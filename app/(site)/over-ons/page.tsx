import { Photo } from "@/components/site/photo"
import { photos } from "@/lib/photos"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NetherlandsMap } from "@/components/netherlands-map"
import { Container, Section, Eyebrow, Hairline, ArchFrame } from "@/components/site/primitives"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Over ons: eventverhuur uit Amersfoort",
  description:
    "Caftan by Mailra uit Amersfoort verhuurt stijlvolle decoratie, caftans, stoelen en tafels voor bruiloften en feesten door heel Nederland. Lees ons verhaal.",
  path: "/over-ons",
})

const values = [
  {
    number: "01",
    title: "Persoonlijke Service",
    description: "Elke klant is uniek. Wij luisteren naar uw wensen en bieden advies op maat.",
  },
  {
    number: "02",
    title: "Betrouwbare Levering",
    description: "Wij zorgen ervoor dat alles op tijd en in perfecte staat wordt geleverd.",
  },
  {
    number: "03",
    title: "Flexibiliteit",
    description: "Van kleine intieme feesten tot grote evenementen — wij passen ons aan.",
  },
]

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Over ons", path: "/over-ons" }])} />

      {/* Hero */}
      <section
        className="bg-linen"
        style={{ paddingTop: "calc(var(--header-h) + var(--space-section-sm))" }}
      >
        <Container size="wide">
          <div className="grid grid-cols-1 items-center gap-12 pb-16 lg:grid-cols-2 lg:gap-20 lg:pb-0">
            <div className="lg:pb-16">
              <Eyebrow>Ons verhaal</Eyebrow>
              <h1 className="text-display-2 mt-4 text-ink">Over {siteConfig.brandFull}</h1>
              <p className="text-lead mt-6">
                Bij {siteConfig.brandShort} geloven we dat elke speciale gelegenheid een
                vleugje elegantie en verfijning verdient. Wij bieden een exclusieve
                collectie van hoogwaardige stijlvolle decoraties, caftans, stoelen en
                tafels, perfect afgestemd op bruiloften, feesten en andere bijzondere
                momenten.
              </p>
              <p className="mt-4 leading-relaxed text-ink-70">
                Onze zorgvuldig samengestelde selectie combineert tijdloze schoonheid met
                uitzonderlijke kwaliteit. Klanttevredenheid staat centraal — met
                persoonlijke en professionele service denken we graag met u mee om uw
                wensen werkelijkheid te maken.
              </p>
            </div>
            <ArchFrame className="relative -mb-px aspect-[4/3] bg-linen lg:aspect-[4/5]">
              <Photo slot={photos.about} priority sizes="(min-width: 1024px) 50vw, 100vw" />
            </ArchFrame>
          </div>
        </Container>
      </section>

      {/* Values */}
      <Section className="bg-canvas">
        <Container size="wide">
          <div className="max-w-xl">
            <Eyebrow>Onze waarden</Eyebrow>
            <h2 className="text-h2 mt-4 text-ink">Wat ons onderscheidt</h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.number}>
                <span className="text-display-2 !text-5xl text-gold-ink">{value.number}</span>
                <Hairline className="my-5 w-10" />
                <h3 className="text-h3 !text-xl text-ink">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-70">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Service area */}
      <Section className="bg-linen">
        <Container size="wide">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow>Werkgebied</Eyebrow>
              <h2 className="text-h2 mt-4 text-ink">Wij leveren door heel Nederland</h2>
              <p className="text-lead mt-6">
                Vanuit Amersfoort bezorgen wij in de provincie Utrecht, de Randstad en ver
                daarbuiten. Neem contact met ons op om te bespreken of wij ook bij u kunnen
                leveren.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {siteConfig.serviceAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 border border-hairline bg-canvas px-4 py-2 text-sm text-ink"
                  >
                    <MapPin className="h-3.5 w-3.5 text-gold-ink" aria-hidden="true" />
                    {area}
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button className="rounded-[2px] px-8" asChild>
                  <Link href="/contact">
                    Neem Contact Op
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-square overflow-hidden bg-canvas">
              <NetherlandsMap />
            </div>
          </div>
        </Container>
      </Section>

      {/* Goed om te weten */}
      <Section rhythm="sm" className="bg-canvas">
        <Container size="text" className="text-center">
          <Eyebrow>Goed om te weten</Eyebrow>
          <h2 className="text-h2 !text-3xl mt-4 text-ink">Ons verhuurbeleid</h2>
          <p className="mt-4 text-ink-70">
            Van aanbetaling tot annulering en de huurperiode — alles over hoe huren bij
            ons werkt staat overzichtelijk op één pagina.
          </p>
          <Link
            href="/verhuurbeleid"
            className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-ink"
          >
            Bekijk het verhuurbeleid
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </Section>

      {/* CTA */}
      <section className="bg-olive-deep py-24 text-center">
        <Container>
          <h2 className="text-h2 text-canvas">Klaar om uw evenement te plannen?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-canvas/75">
            Neem vandaag nog contact met ons op voor een vrijblijvende offerte. Wij helpen
            u graag bij het realiseren van uw dromen.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="rounded-[2px] px-8" asChild>
              <Link href="/contact">
                Vraag Offerte Aan
              </Link>
            </Button>
            <Button
                size="lg"
                variant="outline"
                className="rounded-[2px] border-canvas/30 bg-transparent px-8 text-canvas hover:bg-canvas/10 hover:text-canvas"
               asChild>
              <Link href="/producten">
              Bekijk Producten
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
