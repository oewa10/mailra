import { revalidatePath } from "next/cache"

/**
 * Catalog data appears on the home page, the catalog pages and in the footer of every page, so
 * each admin mutation refreshes the whole site. Pages regenerate lazily on their next visit.
 */
export function revalidatePublicSite() {
  revalidatePath("/", "layout")
  revalidatePath("/sitemap.xml")
}
