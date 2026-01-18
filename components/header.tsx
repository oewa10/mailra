"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                console.log('Menu button clicked, opening menu')
                setMobileMenuOpen(true)
              }}
              aria-label="Open menu"
              className="h-10 w-10"
            >
              <Menu className="h-6 w-6" />
            </Button>
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
      
      {/* Mobile menu - rendered outside header */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-300" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-background via-background to-secondary/20 lg:hidden pt-20 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-6 border-b border-border/50 backdrop-blur-sm">
              <Link href="/" className="-m-1.5 p-1.5 hover:scale-110 transition-transform" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/logo.png"
                  alt="Mailra Logo"
                  width={100}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  console.log('Close button clicked')
                  setMobileMenuOpen(false)
                }}
                aria-label="Close menu"
                className="h-10 w-10 hover:bg-secondary/50 transition-all hover:rotate-90 duration-300"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="px-6 py-12">
              <nav className="space-y-3">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-xl px-6 py-4 text-xl font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 transform hover:translate-x-2 animate-in slide-in-from-left duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-12 pt-12 border-t border-border/30">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full py-6 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105">
                    Offerte Aanvragen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
