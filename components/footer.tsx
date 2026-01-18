import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Producten", href: "/producten" },
    { name: "Over Ons", href: "/over-ons" },
    { name: "Contact", href: "/contact" },
  ],
  categories: [
    { name: "Stoelen", href: "/producten?category=stoelen" },
    { name: "Tafels", href: "/producten?category=tafels" },
    { name: "Decoratie", href: "/producten?category=decoratie" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-4xl tracking-tight">
              Mailra
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/80 leading-relaxed">
              Uw partner voor hoogwaardige verhuur van meubilair en decoratie voor evenementen door heel Nederland.
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Navigatie</h3>
            <ul className="mt-4 space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Producten</h3>
            <ul className="mt-4 space-y-3">
              {navigation.categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <a href="tel:+31612345678" className="hover:text-primary-foreground">
                  +31 6 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@mailra.nl" className="hover:text-primary-foreground">
                  info@mailra.nl
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Amsterdam, Nederland</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Mailra. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  )
}
