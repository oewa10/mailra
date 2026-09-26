import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brandFull,
    short_name: siteConfig.brandShort,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F5",
    theme_color: "#283123",
    icons: [
      { src: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
