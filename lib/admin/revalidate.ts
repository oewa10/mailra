import { revalidatePath } from "next/cache"

export function revalidatePublicSite() {
  revalidatePath("/")
  revalidatePath("/producten")
  revalidatePath("/sitemap.xml")
}
