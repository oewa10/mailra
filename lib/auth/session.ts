// Edge- and Node-compatible (Web Crypto only) so the proxy and route handlers share it.

export const SESSION_COOKIE = "admin_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

/** `pv` fingerprints the password the session was issued under; see passwordVersion() in lib/db. */
export type Session = { uid: string; email: string; pv: string; exp: number }

const encoder = new TextEncoder()

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (secret && secret.length >= 32) return secret
  if (secret) console.warn("ADMIN_SESSION_SECRET is shorter than 32 characters; falling back to POSTGRES_URL")
  return process.env.POSTGRES_URL || null
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(base64 + "===".slice((base64.length + 3) % 4))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

export async function createSessionToken(uid: string, email: string, pv: string): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error("ADMIN_SESSION_SECRET (or POSTGRES_URL) is not configured")

  const session: Session = { uid, email, pv, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE }
  const payload = toBase64Url(encoder.encode(JSON.stringify(session)))
  const signature = await crypto.subtle.sign("HMAC", await getKey(secret), encoder.encode(payload))
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<Session | null> {
  const secret = getSecret()
  if (!token || !secret) return null

  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(secret),
      fromBase64Url(signature),
      encoder.encode(payload),
    )
    if (!valid) return null

    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as Session
    if (typeof session.uid !== "string" || typeof session.pv !== "string" || typeof session.exp !== "number") return null
    if (session.exp < Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}
