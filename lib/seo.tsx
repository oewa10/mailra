import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

/** Absolute URL for a site path ("/producten" → "https://mailra.nl/producten"). */
export function absoluteUrl(path: string) {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`
}

// Rendered by app/opengraph-image.tsx. Listed explicitly: a page that sets `openGraph` no longer
// inherits the image Next.js adds for that file.
const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.brandFull}: decoratie, stoelen en tafels huren voor uw bruiloft of feest`,
}

/**
 * Metadata for one public page. Next.js doesn't merge nested objects such as `openGraph`, so each
 * page states its own canonical, Open Graph and Twitter fields here instead of inheriting the
 * homepage's.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string
  description: string
  path: string
  /** Use the title as is, without the "| Caftan by Mailra" suffix. */
  absoluteTitle?: boolean
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.brandFull}`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      siteName: siteConfig.brandFull,
      url: path,
      title: fullTitle,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SHARE_IMAGE],
    },
  }
}

export const BUSINESS_ID = `${siteConfig.url}/#business`
const WEBSITE_ID = `${siteConfig.url}/#website`

/** Site-wide LocalBusiness + WebSite graph, rendered once in the root layout. */
export function siteJsonLd() {
  const sameAs = Object.values(siteConfig.social).filter(Boolean)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": BUSINESS_ID,
        name: siteConfig.brandFull,
        alternateName: siteConfig.brandShort,
        description: siteConfig.description,
        slogan: siteConfig.tagline,
        url: siteConfig.url,
        logo: absoluteUrl("/logo.png"),
        image: absoluteUrl("/images/site/hero.webp"),
        telephone: siteConfig.phone.href.replace("tel:", ""),
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.address.locality,
          addressRegion: siteConfig.address.region,
          addressCountry: siteConfig.address.country,
        },
        areaServed: siteConfig.serviceAreas.map((name) => ({ "@type": "Place", name })),
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "18:00",
        },
        priceRange: "€€",
        currenciesAccepted: "EUR",
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: siteConfig.url,
        name: siteConfig.brandFull,
        inLanguage: "nl-NL",
        publisher: { "@id": BUSINESS_ID },
      },
    ],
  }
}

/** BreadcrumbList starting at Home; pass the trail after it, ending with the current page. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** Renders JSON-LD; `<` is escaped so text from the database can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
