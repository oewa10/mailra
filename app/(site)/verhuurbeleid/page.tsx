import Link from "next/link"
import { Container, Eyebrow, Hairline } from "@/components/site/primitives"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Verhuurbeleid",
  description:
    "Het verhuurbeleid van Caftan by Mailra: reservering, aanbetaling, annulering, huurperiode, bezorgkosten, borg en schade. Alles over huren bij ons op één pagina.",
  path: "/verhuurbeleid",
})

const sections = [
  {
    title: "1. Algemeen",
    items: [
      "Dit verhuurbeleid is van toepassing op alle verhuurtransacties.",
      "Door een product te huren, gaat u akkoord met de voorwaarden zoals hieronder beschreven.",
      "Lees ook onze algemene voorwaarden zorgvuldig door voordat u een reservering maakt.",
    ],
  },
  {
    title: "2. Reservering en Betaling",
    items: [
      "Reserveringen kunnen telefonisch, via e-mail, via WhatsApp of via onze website worden gemaakt.",
      "Een aanbetaling van 50% van de totale huurprijs is vereist om de reservering te bevestigen.",
      "Het resterende bedrag dient uiterlijk 7 dagen voor de aanvang van de huurperiode te worden voldaan, tenzij anders overeengekomen.",
    ],
  },
  {
    title: "3. Annulering en Wijzigingen",
    items: [
      "Tot 30 dagen voor de huurdatum: kosteloze annulering en volledige terugbetaling van de aanbetaling.",
      "Tussen 30 en 14 dagen voor de huurdatum: 50% van de aanbetaling wordt terugbetaald.",
      "Binnen 14 dagen voor de huurdatum: de aanbetaling wordt niet terugbetaald.",
      "Binnen 7 dagen voor de huurdatum: het volledige huurbedrag blijft verschuldigd, tenzij anders overeengekomen.",
      "In geval van overmacht (ernstige ziekte, overlijden van een naaste of andere uitzonderlijke omstandigheden) kijken wij in overleg naar een passende oplossing — schriftelijk aan te vragen met bewijs van de situatie.",
      "Tot 14 dagen voor de huurdatum zijn wijzigingen in datum of aantal artikelen mogelijk, afhankelijk van beschikbaarheid. Binnen 14 dagen kunnen wijzigingen niet meer worden gegarandeerd.",
    ],
  },
  {
    title: "4. Huurperiode",
    items: [
      "De standaard huurperiode is 24 uur, tenzij anders overeengekomen. Bloemenbogen zijn enkel voor één dag te huur.",
      "Verlenging van de huurperiode is mogelijk op basis van beschikbaarheid en tegen een extra vergoeding.",
    ],
  },
  {
    title: "5. Ophalen en Terugbrengen",
    items: [
      "Gehuurde items kunnen worden opgehaald vanaf 09:00 uur op de afgesproken datum.",
      "Gehuurde items dienen teruggebracht te worden voor 12:00 uur op de afgesproken retourdatum. Te laat terugbrengen kan resulteren in extra kosten.",
      "Wij bieden ook een bezorgservice aan. De kosten hiervoor liggen tussen de €20,00 en €100,00 (brengen en ophalen), afhankelijk van de afstand.",
      "Zonder specifieke afspraken worden goederen bij een eengezinswoning bij de voordeur overhandigd, of bij een flatgebouw bij de ingang. Wij leveren of halen geen goederen binnenshuis of op verdiepingen op, tenzij vooraf anders overeengekomen.",
    ],
  },
  {
    title: "6. Gebruik en Verantwoordelijkheid",
    items: [
      "De huurder is verantwoordelijk voor het correcte gebruik van de gehuurde items.",
      "Schade aan of verlies van gehuurde items dient onmiddellijk gemeld te worden.",
      "De huurder is aansprakelijk voor reparatie- of vervangingskosten in geval van schade of verlies.",
    ],
  },
  {
    title: "7. Terugbetaling van de Borg",
    items: [
      "Bij aanvang van de huurperiode wordt een borgsom in rekening gebracht, afhankelijk van het gehuurde item.",
      "De borgsom wordt terugbetaald na inspectie van de gehuurde items, mits deze in dezelfde staat worden geretourneerd als waarin ze werden ontvangen.",
      "Eventuele kosten voor reparaties of vervanging worden verrekend met de borg.",
    ],
  },
  {
    title: "8. Producten op Maat",
    items: [
      "Producten waar ‘koop mogelijkheid’ op staat, worden op maat gemaakt.",
      "Aangezien deze producten op maat worden gemaakt, kunnen ze niet geretourneerd of geannuleerd worden.",
    ],
  },
  {
    title: "9. Overmacht",
    items: [
      "Wij zijn niet aansprakelijk voor vertragingen of het niet leveren van gehuurde items als gevolg van overmacht, zoals extreme weersomstandigheden, natuurrampen of andere onvoorziene gebeurtenissen.",
    ],
  },
  {
    title: "10. Klachten en Geschillen",
    items: [
      "Klachten dienen binnen 48 uur na het einde van de huurperiode schriftelijk te worden ingediend.",
      "Geschillen zullen in eerste instantie in der minne worden opgelost. Indien dit niet mogelijk is, worden geschillen voorgelegd aan een bevoegde rechtbank.",
    ],
  },
]

export default function VerhuurbeleidPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Verhuurbeleid", path: "/verhuurbeleid" }])} />

      <section
        className="bg-linen"
        style={{ paddingTop: "calc(var(--header-h) + var(--space-section-sm))", paddingBottom: "var(--space-section-sm)" }}
      >
        <Container size="text" className="text-center">
          <Eyebrow>Goed om te weten</Eyebrow>
          <h1 className="text-display-2 mt-4 text-ink">Verhuurbeleid</h1>
          <p className="text-lead mt-6">
            Huurperiode, borg, bezorging en annulering — alles over hoe huren bij{" "}
            {siteConfig.brandShort} werkt.
          </p>
        </Container>
      </section>

      <section className="section-y">
        <Container size="text">
          <nav aria-label="Inhoudsopgave" className="mb-16 border border-hairline p-6">
            <p className="text-eyebrow">Inhoud</p>
            <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sections.map((s) => (
                <li key={s.title}>
                  <a href={`#${slugify(s.title)}`} className="link-underline text-sm text-ink-70">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-14">
            {sections.map((section) => (
              <div key={section.title} id={slugify(section.title)} className="scroll-mt-32">
                <h2 className="text-h3 !text-xl text-ink">{section.title}</h2>
                <Hairline className="my-5 w-10" />
                <ul className="space-y-4">
                  {section.items.map((item, i) => (
                    <li key={i} className="leading-relaxed text-ink-70">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-16 border-t border-hairline pt-8 text-sm text-ink-55">
            Door een reservering te maken bij {siteConfig.brandFull}, gaat u akkoord met
            dit verhuurbeleid. Vragen? Neem gerust{" "}
            <Link href="/contact" className="link-underline text-gold-ink">
              contact met ons op
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  )
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}
