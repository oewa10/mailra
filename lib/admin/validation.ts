import { NextResponse } from "next/server"
import { z } from "zod"

// ~1.5 MB of base64; client-side resizing keeps real uploads far below this.
const MAX_IMAGE_LENGTH = 2_000_000

// Uploaded photo, or a same-site path (a file in /public or the product's own media URL echoed
// back). Remote and protocol-relative URLs are refused: next/image would fail to render them.
const DATA_URL = /^data:image\/(?:webp|jpeg|png|avif);base64,[A-Za-z0-9+/]+={0,2}$/
const LOCAL_PATH = /^\/(?![/\\])[\w\-./%() ]+$/

function isAllowedImage(value: string) {
  return value === "" || DATA_URL.test(value) || (LOCAL_PATH.test(value) && !value.includes(".."))
}

// Largest legitimate body: a product with a photo at the image limit.
const MAX_BODY_BYTES = 2_200_000

const optionalText = (max: number) =>
  z
    .string()
    .max(max, `Maximaal ${max} tekens`)
    .nullish()
    .transform((v) => v?.trim() ?? "")

export const productSchema = z.object({
  name: z.string().trim().min(1, "Vul een productnaam in").max(120, "Maximaal 120 tekens"),
  category: z.string().trim().min(1, "Kies een categorie"),
  description: optionalText(2000),
  dimensions: optionalText(120),
  capacity: optionalText(120),
  image: z
    .string()
    .max(MAX_IMAGE_LENGTH, "De afbeelding is te groot")
    .nullish()
    .transform((v) => v ?? "")
    .refine(isAllowedImage, "Ongeldige afbeelding"),
  active: z.boolean().optional(),
})

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Vul een categorienaam in").max(60, "Maximaal 60 tekens"),
  description: optionalText(500),
})

export const activeSchema = z.object({ active: z.boolean() })

export const bulkSchema = z.object({
  action: z.enum(["activate", "deactivate", "delete"]),
  ids: z.array(z.string().min(1)).min(1, "Selecteer minimaal één product").max(500),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Vul uw huidige wachtwoord in"),
  newPassword: z.string().min(10, "Het nieuwe wachtwoord moet minimaal 10 tekens hebben").max(200),
})

type Parsed<T> = { data: T; error?: never } | { data?: never; error: NextResponse }

export async function parseJson<T extends z.ZodTypeAny>(
  request: Request,
  schema: T,
): Promise<Parsed<z.infer<T>>> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return { error: NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 415 }) }
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return { error: NextResponse.json({ error: "De gegevens zijn te groot." }, { status: 413 }) }
  }

  let body: unknown
  try {
    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) {
      return { error: NextResponse.json({ error: "De gegevens zijn te groot." }, { status: 413 }) }
    }
    body = JSON.parse(text)
  } catch {
    return { error: NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 }) }
  }
  const result = schema.safeParse(body)
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Ongeldige invoer"
    return { error: NextResponse.json({ error: message }, { status: 400 }) }
  }
  return { data: result.data }
}
