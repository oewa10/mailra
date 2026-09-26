import Link from "next/link"
import { ArrowRight, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Container, Section, Eyebrow, Hairline, Sprig } from "@/components/site/primitives"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { photos, gallery, type PhotoSlot } from "@/lib/photos"
import { Photo } from "@/components/site/photo"
import { getPublicCatalog, type Catalog, type CatalogCategory } from "@/lib/db"

// Dedicated photos for the original categories (lib/photos.ts); others use their first product photo.
const categoryArt: Record<string, { photo: PhotoSlot; description: string }> = {
  stoelen: { photo: photos.categoryStoelen, description: "Elegante stoelen voor elke gelegenheid" },
  tafels: { photo: photos.categoryTafels, description: "Tafels in diverse maten en stijlen" },
  decoratie: { photo: photos.categoryDecoratie, description: "Decoratieve items voor de perfecte sfeer" },
}
const artOrder = Object.keys(categoryArt)

type Tile = { id: string; name: string; description: string; photo: PhotoSlot; count?: number }

// Shown only when the site runs without a database (e.g. a local build).
const fallbackTiles: Tile[] = [
  { id: "stoelen", name: "Stoelen", ...categoryArt.stoelen },
  { id: "tafels", name: "Tafels", ...categoryArt.tafels },
  { id: "decoratie", name: "Decoratie", ...categoryArt.decoratie },
]

function rank(c: CatalogCategory) {
  const i = artOrder.indexOf(c.id)
  return i === -1 ? artOrder.length : i
}

function collectionTiles(catalog: Catalog | null): Tile[] {
  if (!catalog) return fallbackTiles
  return [...catalog.categories]
    .sort((a, b) => rank(a) - rank(b) || b.productCount - a.productCount)
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description || categoryArt[c.id]?.description || "",
      photo: categoryArt[c.id]?.photo ?? {
        id: `category-${c.id}`,
        label: `Categorie ${c.name}`,
        brief: `Sfeerfoto van ${c.name.toLowerCase()} in een echte opstelling.`,
        format: "Liggend 16:10 · min. 1600 × 1000 px",
        alt: `${c.name} huren bij Mailra`,
        src: c.coverImage || undefined,
      },
      count: c.productCount,
    }))
}

const marqueeWords = [
  "Bruiloften",
  "Feesten",
  "Styling",
  "Decoratie",
  "Bezorging door heel Nederland",
]

const processSteps = [
  {
    step: "01",
    title: "Neem Contact Op",
    description: "Vertel ons over uw evenement, datum en wensen. Wij denken graag met u mee.",
  },
  {
    step: "02",
    title: "Offerte op Maat",
    description: "U ontvangt een gedetailleerde offerte afgestemd op uw specifieke behoeften.",
  },
  {
    step: "03",
    title: "Levering & Opbouw",
    description: "Wij leveren en bouwen op de gewenste locatie op het afgesproken tijdstip.",
  },
  {
    step: "04",
    title: "Ophaal Service",
    description: "Na uw evenement halen wij alles weer netjes op. U hoeft niets te doen.",
  },
]

// Admin edits refresh this page on demand; the interval is only a safety net.
export const revalidate = 3600

export default async function HomePage() {
  const tiles = collectionTiles(await getPublicCatalog())
  const featured = tiles.length === 3

  return (
    <main className="min-h-screen bg-canvas">
      <Header />

      {/* Hero — type lives in the quiet left half; gradients keep it legible on any photo. */}
      <section className="relative overflow-hidden bg-olive-deep">
        <div className="relative h-[92svh] min-h-[640px] w-full">
          <Photo slot={photos.hero} priority sizes="100vw" tone="dark" captionAt="hero" />
          {photos.hero.src && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-olive-deep/80 via-olive-deep/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-olive-deep/70 via-transparent to-transparent sm:hidden" />
            </>
          )}
          <div className="arch absolute inset-x-0 bottom-0 h-10 bg-canvas sm:h-14" aria-hidden="true" />

          <div className="absolute inset-0 flex items-end sm:items-center">
            <Container size="wide" className="w-full pb-20 pt-[calc(var(--header-h)+2rem)] sm:pb-0">
              <div className="max-w-2xl">
                <Eyebrow className="!text-gold">{siteConfig.brandFull}</Eyebrow>
                <h1 className="text-display-1 mt-4 text-canvas">{siteConfig.tagline}</h1>
                <p className="text-lead mt-6 max-w-lg !text-canvas/85">
                  Hoogwaardige verhuur van stoelen, tafels, styling en decoratie voor
                  bruiloften, feesten en zakelijke evenementen — door heel Nederland.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button size="lg" variant="secondary" className="group w-full rounded-[2px] px-8 sm:w-auto" asChild>
                    <Link href="/producten">
                      Bekijk de collectie
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Link href="/contact" className="link-underline text-sm font-medium text-canvas">
                    Vraag een offerte aan
                  </Link>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* Marquee proof — replaces unverifiable stat counters */}
      <div className="border-y border-hairline bg-canvas py-6 overflow-hidden" aria-hidden="true">
        <div className="marquee-track flex w-max gap-16 whitespace-nowrap">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="text-eyebrow flex items-center gap-16 !text-ink-55">
              {word}
              <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Collectie — asymmetric grid, live counts */}
      <Section className="bg-canvas">
        <Container size="wide">
          <div className="max-w-xl">
            <Eyebrow>Onze collectie</Eyebrow>
            <h2 className="text-h2 mt-4 text-ink">Meubilair, styling en decoratie</h2>
            <p className="text-lead mt-4">
              Van elegante chiavari stoelen tot sfeervolle tafeldecoratie — ontdek het
              assortiment dat uw evenement compleet maakt.
            </p>
          </div>

          {tiles.length > 0 && (
            <div
              className={cn(
                "mt-14 grid grid-cols-1 gap-6",
                featured ? "md:grid-cols-2 md:grid-rows-2" : tiles.length === 2 && "md:grid-cols-2",
              )}
            >
              {tiles.map((category, index) => {
                const hero = featured && index === 0
                return (
                  <Link
                    key={category.id}
                    href={`/producten/${category.id}`}
                    className={cn("u-hover-zoom group relative overflow-hidden", hero && "md:row-span-2")}
                  >
                    <div
                      className={cn(
                        "relative bg-linen",
                        hero ? "aspect-[4/5] md:h-full" : tiles.length === 1 ? "aspect-[16/9]" : "aspect-[16/10]",
                      )}
                    >
                      <Photo
                        slot={category.photo}
                        captionAt="top"
                        sizes={tiles.length === 1 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                      />
                      {category.photo.src && (
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "absolute inset-x-0 bottom-0 p-6 sm:p-8",
                        category.photo.src ? "text-canvas" : "text-ink",
                      )}
                    >
                      <h3 className="text-h3 !text-2xl">{category.name}</h3>
                      {category.description && (
                        <p className="mt-1 line-clamp-2 text-sm opacity-80">{category.description}</p>
                      )}
                      <div className="link-underline-active mt-4 inline-flex items-center gap-2 text-sm font-medium">
                        {category.count
                          ? `${category.count} ${category.count === 1 ? "item" : "items"}`
                          : "Bekijk collectie"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <Button size="lg" variant="outline" className="group rounded-[2px] px-8" asChild>
              <Link href="/producten">
                Bekijk alle producten
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Zo werkt het */}
      <Section className="bg-linen">
        <Container size="wide">
          <div className="max-w-xl">
            <Eyebrow>Hoe het werkt</Eyebrow>
            <h2 className="text-h2 mt-4 text-ink">In vier stappen naar uw evenement</h2>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item) => (
              <li key={item.step} className="border-t border-gold-ink/30 pt-6">
                <span className="text-display-2 !text-4xl text-gold-ink" aria-hidden="true">
                  {item.step}
                </span>
                <h3 className="text-h3 !text-lg mt-4 text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-70">{item.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Pull quote — the page's emotional pause */}
      <Section rhythm="sm" className="bg-canvas">
        <Container size="text" className="flex flex-col items-center text-center">
          <Sprig className="text-sage" />
          <p className="text-quote mt-6 text-ink">
            &ldquo;Elke speciale gelegenheid verdient een vleugje elegantie en verfijning.&rdquo;
          </p>
          <p className="text-eyebrow mt-6">{siteConfig.brandFull}</p>
        </Container>
      </Section>

      {/* Uit ons werk — real events, not stock */}
      <Section className="bg-canvas !pt-0">
        <Container size="wide">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <Eyebrow>Uit ons werk</Eyebrow>
              <h2 className="text-h2 mt-4 text-ink">Feesten die wij mochten aankleden</h2>
            </div>
            <Link href="/contact" className="link-underline self-start text-sm font-medium text-gold-ink sm:self-auto">
              Plan uw eigen feest
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:h-[min(44rem,62vw)] md:grid-cols-4 md:grid-rows-2 lg:gap-6">
            {gallery.map((photo, i) => (
              <figure
                key={photo.id}
                className={cn(
                  "u-hover-zoom group relative overflow-hidden bg-linen md:aspect-auto",
                  i === 0 && "col-span-2 aspect-[4/5] md:row-span-2",
                  i === 1 && "col-span-2 aspect-[16/10]",
                  i > 1 && "aspect-[4/5]",
                )}
              >
                <Photo
                  slot={photo}
                  sizes={i < 2 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent px-4 pb-3 pt-10 text-xs font-medium tracking-wide text-canvas">
                  {photo.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact — the one other dark moment on the page */}
      <Section className="bg-olive-deep text-canvas" id="contact">
        <Container size="wide">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow className="!text-gold">Neem contact op</Eyebrow>
              <h2 className="text-h2 mt-4 text-canvas">Laten we uw evenement plannen</h2>
              <p className="text-lead mt-6 max-w-md !text-canvas/75">
                Heeft u vragen of wilt u een vrijblijvende offerte ontvangen? Wij helpen u
                graag verder.
              </p>

              <div className="mt-10 space-y-1">
                <Hairline className="bg-canvas/15" />
                <a
                  href={siteConfig.phone.href}
                  className="flex items-center gap-4 py-4 text-canvas transition-colors hover:text-gold"
                >
                  <Phone className="h-5 w-5 text-gold" aria-hidden="true" />
                  <span className="text-lg font-medium">{siteConfig.phone.display}</span>
                </a>
                <Hairline className="bg-canvas/15" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-4 py-4 text-canvas transition-colors hover:text-gold"
                >
                  <Mail className="h-5 w-5 text-gold" aria-hidden="true" />
                  <span className="text-lg font-medium">{siteConfig.email}</span>
                </a>
                <Hairline className="bg-canvas/15" />
                <div className="flex items-center gap-4 py-4">
                  <Clock className="h-5 w-5 text-gold" aria-hidden="true" />
                  <span className="text-lg font-medium">{siteConfig.hours.display}</span>
                </div>
                <Hairline className="bg-canvas/15" />
              </div>

              <a
                href={`https://wa.me/${siteConfig.whatsapp.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 rounded-[2px] bg-[#25D366] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat via WhatsApp
              </a>
            </div>

            <div className="rounded-[2px] bg-surface p-6 text-ink sm:p-8">
              <h3 className="text-h3 !text-xl text-ink">Stuur ons een bericht</h3>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  )
}
