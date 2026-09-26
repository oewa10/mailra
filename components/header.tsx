"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Producten", href: "/producten" },
  { name: "Over Ons", href: "/over-ons" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const menuId = "mobile-nav"

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
      firstLinkRef.current?.focus()
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  // The homepage opens on a dark hero; until the header turns solid its type has to be light.
  const [atTop, setAtTop] = useState(true)
  useEffect(() => {
    const update = () => setAtTop(window.scrollY < 120)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])
  const onDark = pathname === "/" && atTop && !mobileMenuOpen

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 right-0 z-50 border-b border-hairline/60 bg-canvas/85 backdrop-blur-md transition-colors ${
          onDark ? "site-header--on-dark" : ""
        }`}
        style={{ height: "var(--header-h)" }}
      >
        <nav
          className="mx-auto flex h-full items-center justify-between"
          style={{
            maxWidth: "88rem",
            paddingInline: "var(--gutter)",
          }}
          aria-label="Hoofdnavigatie"
        >
          <div className="flex flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image
                src="/logo.png"
                alt={`${siteConfig.brandFull} logo`}
                width={120}
                height={60}
                className="h-12 w-auto sm:h-14"
                priority
              />
            </Link>
          </div>

          <div className="flex lg:hidden z-50">
            <button
              className="relative p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls={menuId}
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${onDark ? "text-canvas" : "text-ink"} ${mobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
                  aria-hidden="true"
                />
                <X
                  className={`h-6 w-6 absolute inset-0 text-ink transition-all duration-300 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
                  aria-hidden="true"
                />
              </div>
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-10">
            {navigation.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`link-underline text-eyebrow !tracking-[0.14em] transition-colors ${
                    onDark
                      ? active
                        ? "!text-canvas link-underline-active"
                        : "!text-canvas/75 hover:!text-canvas"
                      : active
                        ? "!text-ink link-underline-active"
                        : "!text-ink-70 hover:!text-ink"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button className="rounded-[2px] px-6" variant={onDark ? "secondary" : "default"} asChild>
              <Link href="/contact">Offerte Aanvragen</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile navigation */}
      <div
        id={menuId}
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-500 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobiel menu"
      >
        <div
          className={`absolute inset-0 bg-linen transition-opacity duration-500 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <nav className="relative h-full flex flex-col items-center justify-center px-8">
          <div
            className={`flex flex-col items-center gap-7 transition-all duration-500 ${
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                ref={index === 0 ? firstLinkRef : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="text-display-2 !text-4xl text-ink hover:text-gold-ink transition-colors"
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 80 + 150}ms` : "0ms",
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div
            className={`absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-xs px-6 transition-all duration-500 ${
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Button className="w-full rounded-[2px] py-6 text-base" asChild>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                Offerte Aanvragen
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  )
}
