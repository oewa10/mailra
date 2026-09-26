import React from "react"
import type { Metadata } from 'next'
import { Instrument_Sans, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { siteConfig } from '@/lib/site-config'
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brandFull} — Verhuur voor Bruiloften & Evenementen`,
    template: `%s | ${siteConfig.brandFull}`,
  },
  description: siteConfig.description,
  keywords: [
    "bruiloft aankleding huren",
    "decoratie verhuur bruiloft",
    "stoelen huren evenement",
    "tafels huren bruiloft",
    "bruiloft styling verhuur",
    "event verhuur Nederland",
  ],
  authors: [{ name: siteConfig.brandFull }],
  creator: siteConfig.brandFull,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteConfig.url,
    siteName: siteConfig.brandFull,
    title: `${siteConfig.brandFull} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandFull} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.brandFull,
    alternateName: siteConfig.brandShort,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone.href.replace("tel:", ""),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    areaServed: siteConfig.serviceAreas.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    openingHours: "Mo-Sa 09:00-18:00",
    priceRange: "€€",
    image: `${siteConfig.url}/opengraph-image`,
  }

  return (
    <html lang="nl" className={`${sans.variable} ${display.variable}`}>
      <body className="antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-olive-ink focus:px-4 focus:py-2 focus:text-canvas"
        >
          Ga naar hoofdinhoud
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
