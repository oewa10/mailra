import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: 'Mailra - Verhuur voor Evenementen',
  description: 'Mailra biedt hoogwaardige verhuur van stoelen, tafels en decoratie voor uw evenementen in Nederland.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body className={`${dmSans.className} ${instrumentSerif.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
