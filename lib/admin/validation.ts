import { NextResponse } from "next/server"
import { z } from "zod"

// ~1.5 MB of base64; client-side resizing keeps real uploads far below this.
const MAX_IMAGE_LENGTH = 2_000_000

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
    .refine(
      (v) => v === "" || v.startsWith("/") || v.startsWith("https://") || /^data:image\/(webp|jpeg|png|avif);base64,/.test(v),
      "Ongeldige afbeelding",
    ),
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
  let body: unknown
  try {
    body = await request.json()
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
