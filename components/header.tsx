"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Producten", href: "/producten" },
  { name: "Over Ons", href: "/over-ons" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image
                src="/logo.png"
                alt="Mailra Logo"
                width={120}
                height={60}
                className="h-14 w-auto"
                priority
              />
            </Link>
          </div>
          
          <div className="flex lg:hidden z-50">
            <button
              className="relative p-2 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu className={`h-6 w-6 absolute inset-0 text-foreground transition-all duration-300 ${mobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`} />
                <X className={`h-6 w-6 absolute inset-0 text-foreground transition-all duration-300 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`} />
              </div>
            </button>
          </div>
          
          <div className="hidden lg:flex lg:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/contact">
              <Button className="rounded-full px-6">
                Offerte Aanvragen
              </Button>
            </Link>
          </div>
        </nav>
      </header>
      
      {/* Full-screen Mobile Navigation */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-background/95 via-background to-primary/10 backdrop-blur-md transition-all duration-500 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu content */}
        <nav className="relative h-full flex flex-col items-center justify-center px-8">
          {/* Logo at top */}
          <div 
            className={`absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-500 ${
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/logo.png"
                alt="Mailra Logo"
                width={120}
                height={60}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Menu items */}
          <div className="flex flex-col items-center gap-8">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-3xl sm:text-4xl font-serif text-foreground hover:text-primary transition-all duration-500 ${
                  mobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
                style={{ 
                  transitionDelay: mobileMenuOpen ? `${index * 100 + 200}ms` : "0ms"
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* CTA Button */}
          <div 
            className={`absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xs px-6 transition-all duration-700 ${
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ 
              transitionDelay: mobileMenuOpen ? "600ms" : "0ms"
            }}
          >
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-full py-6 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">
                Offerte Aanvragen
              </Button>
            </Link>
          </div>
          
          {/* Decorative element */}
          <div 
            className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700 ${
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ 
              transitionDelay: mobileMenuOpen ? "700ms" : "0ms"
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-1 bg-primary/50" />
              <p className="text-muted-foreground text-sm">Mailra Verhuur</p>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
