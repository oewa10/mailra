import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"
import { getCategoriesWithProductCounts } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/producten`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/over-ons`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/verhuurbeleid`, changeFrequency: "yearly", priority: 0.4 },
  ]

  try {
    const categories = (await getCategoriesWithProductCounts(true)) as any[]
    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((c) => Number(c.product_count) > 0)
      .map((c) => ({
        url: `${siteConfig.url}/producten?category=${c.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    return [...staticRoutes, ...categoryRoutes]
  } catch {
    return staticRoutes
  }
}
