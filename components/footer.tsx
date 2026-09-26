import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Hairline } from "@/components/site/primitives"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Producten", href: "/producten" },
  { name: "Over Ons", href: "/over-ons" },
  { name: "Contact", href: "/contact" },
]

const categories = [
  { name: "Stoelen", href: "/producten?category=stoelen" },
  { name: "Tafels", href: "/producten?category=tafels" },
  { name: "Decoratie", href: "/producten?category=decoratie" },
]

export function Footer() {
  return (
    <footer className="bg-olive-deep text-canvas">
      <div className="u-wide section-y-sm">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="text-display-2 !text-3xl text-canvas">
              {siteConfig.brandShort}
            </Link>
            <p className="mt-2 text-eyebrow !text-gold">{siteConfig.tagline}</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-canvas/70">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-eyebrow !text-canvas/50">Navigatie</h3>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="link-underline text-sm text-canvas/80 hover:text-canvas"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow !text-canvas/50">Producten</h3>
            <ul className="mt-5 space-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="link-underline text-sm text-canvas/80 hover:text-canvas"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow !text-canvas/50">Contact</h3>
            <ul className="mt-5 space-y-3">
              <li className="flex items-center gap-3 text-sm text-canvas/80">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={siteConfig.phone.href} className="hover:text-canvas">
                  {siteConfig.phone.display}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-canvas/80">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-canvas">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-canvas/80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span>{siteConfig.address.display}</span>
              </li>
            </ul>
          </div>
        </div>

        <Hairline className="mt-14 mb-6 bg-canvas/20" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-canvas/50">
            &copy; {new Date().getFullYear()} {siteConfig.brandFull}. Alle rechten voorbehouden.
          </p>
          <Link
            href="/verhuurbeleid"
            className="link-underline text-xs text-canvas/50 hover:text-canvas"
          >
            Verhuurbeleid
          </Link>
        </div>
      </div>
    </footer>
  )
}
