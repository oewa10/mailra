// Regenerates the favicon, Apple touch icon and web-app icons from the brand monogram.
// Run: node scripts/generate-icons.mjs
import { readFile, writeFile } from "node:fs/promises"
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js"

const OLIVE_DEEP = "#1A2216"
const GOLD = "#CEAC6D"
const font = await readFile(new URL("../lib/fonts/fraunces-500.woff", import.meta.url))

// Plain element objects, so this runs in Node without a JSX build step.
const h = (type, style, children) => ({ type, props: { style, children } })

async function monogram(size) {
  const image = new ImageResponse(
    h(
      "div",
      {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: OLIVE_DEEP,
        color: GOLD,
        fontFamily: "Fraunces",
        fontSize: size * 0.68,
        // Optical centring: the serif M sits a little high in its em box.
        paddingTop: size * 0.04,
      },
      "M",
    ),
    { width: size, height: size, fonts: [{ name: "Fraunces", data: font, weight: 500 }] },
  )
  return Buffer.from(await image.arrayBuffer())
}

/** ICO container holding PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = 6 + 16 * images.length
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)])
}

const [png16, png32, png48] = await Promise.all([16, 32, 48].map(monogram))
await writeFile(new URL("../app/favicon.ico", import.meta.url), ico([
  { size: 16, png: png16 },
  { size: 32, png: png32 },
  { size: 48, png: png48 },
]))
await writeFile(new URL("../app/icon.png", import.meta.url), await monogram(96))
await writeFile(new URL("../app/apple-icon.png", import.meta.url), await monogram(180))
await writeFile(new URL("../public/icon-192.png", import.meta.url), await monogram(192))
await writeFile(new URL("../public/icon-512.png", import.meta.url), await monogram(512))
console.log("Icons written")
