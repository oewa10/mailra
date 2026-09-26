import React from "react"
import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { siteConfig } from '@/lib/site-config'
import { JsonLd, siteJsonLd } from '@/lib/seo'
import './globals.css'

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
})

const display = Fraunces({
  subsets: ["latin"],
  // Only the optical-size axis is used; SOFT and WONK stay at their defaults, so they aren't downloaded.
  axes: ["opsz"],
  variable: "--font-display-loaded",
  display: "swap",
})

// Page-specific fields (canonical, Open Graph, Twitter) come from pageMetadata() in each page:
// anything set here is inherited by pages that don't override it, including 404s.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.brandFull,
    template: `%s | ${siteConfig.brandFull}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brandFull,
  robots: { googleBot: { "max-image-preview": "large" } },
  // Search Console / Bing Webmaster ownership, set per environment on Vercel.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
}

export const viewport: Viewport = {
  themeColor: "#283123",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${sans.variable} ${display.variable}`}>
      <body className="antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-olive-ink focus:px-4 focus:py-2 focus:text-canvas"
        >
          Ga naar hoofdinhoud
        </a>
        <JsonLd data={siteJsonLd()} />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
