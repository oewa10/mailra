import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site-config"

export const alt = `${siteConfig.brandFull}: decoratie, stoelen en tafels huren voor uw bruiloft of feest`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Rendered once at build time and shared by every page (see SHARE_IMAGE in lib/seo.tsx).
export default async function OpengraphImage() {
  const [photo, fraunces] = await Promise.all([
    readFile(join(process.cwd(), "lib/og/background.jpg")),
    readFile(join(process.cwd(), "lib/fonts/fraunces-500.woff")),
  ])

  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${photo.toString("base64")}`}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, rgba(26,34,22,0.95) 0%, rgba(26,34,22,0.85) 55%, rgba(26,34,22,0.2) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            maxWidth: 820,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: "#CEAC6D" }} />
            <span style={{ color: "#CEAC6D", fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
              {siteConfig.brandFull}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              color: "#FBF9F5",
              fontFamily: "Fraunces",
              fontSize: 80,
              lineHeight: 1.05,
              marginTop: 28,
            }}
          >
            {siteConfig.tagline}
          </div>
          <div style={{ display: "flex", color: "rgba(251,249,245,0.85)", fontSize: 30, marginTop: 28, lineHeight: 1.35 }}>
            Decoratie, stoelen &amp; tafels huren voor bruiloften en feesten. Vanuit Amersfoort, door heel
            Nederland.
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Fraunces", data: fraunces, weight: 500, style: "normal" }] },
  )
}
