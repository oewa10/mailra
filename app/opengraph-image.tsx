import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site-config"

export const alt = `${siteConfig.brandFull} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#1A2216",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(206,172,109,0.22), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: "#CEAC6D",
            }}
          />
          <span
            style={{
              color: "#CEAC6D",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.brandFull}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            color: "#FBF9F5",
            fontSize: 84,
            lineHeight: 1.05,
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            color: "rgba(251,249,245,0.7)",
            fontSize: 28,
            marginTop: 28,
            maxWidth: 780,
          }}
        >
          Verhuur van stoelen, tafels en decoratie voor bruiloften en feesten
        </div>
      </div>
    ),
    { ...size },
  )
}
