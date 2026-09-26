import type { MetadataRoute } from "next"
import { getPublicCatalog } from "@/lib/db"
import { photos, gallery } from "@/lib/photos"
import { absoluteUrl } from "@/lib/seo"

export const revalidate = 3600

const photoUrls = (...slots: { src?: string }[]) =>
  slots.flatMap((slot) => (slot.src ? [absoluteUrl(encodeURI(slot.src))] : []))

// Google ignores priority and changefreq; lastModified (when accurate) and images are what count.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      images: photoUrls(photos.hero, photos.categoryStoelen, photos.categoryTafels, photos.categoryDecoratie, ...gallery),
    },
    { url: absoluteUrl("/producten") },
    { url: absoluteUrl("/over-ons"), images: photoUrls(photos.about) },
    { url: absoluteUrl("/contact"), images: photoUrls(photos.contact) },
    { url: absoluteUrl("/verhuurbeleid") },
  ]

  try {
    const catalog = await getPublicCatalog()
    if (!catalog) return staticRoutes

    const latest = catalog.categories.map((c) => c.updatedAt).sort().at(-1)
    const catalogRoutes = new Set(["/", "/producten"])
    for (const route of staticRoutes) {
      if (latest && catalogRoutes.has(new URL(route.url).pathname)) route.lastModified = latest
    }

    const categoryRoutes: MetadataRoute.Sitemap = catalog.categories.map((c) => ({
      url: absoluteUrl(`/producten/${c.id}`),
      lastModified: c.updatedAt,
      images: catalog.products
        .filter((p) => p.category === c.id && p.image)
        .map((p) => absoluteUrl(encodeURI(p.image))),
    }))
    return [...staticRoutes, ...categoryRoutes]
  } catch {
    return staticRoutes
  }
}
