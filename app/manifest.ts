import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brandFull,
    short_name: siteConfig.brandShort,
    description: siteConfig.description,
    lang: "nl-NL",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F5",
    theme_color: "#283123",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // The monogram sits well inside the safe zone, so the same art works as a maskable icon.
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
