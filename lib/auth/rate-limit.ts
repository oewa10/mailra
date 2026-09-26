import "server-only"
import { createHash } from "crypto"
import { sql } from "@vercel/postgres"

export type RateRule = { key: string; limit: number }

// Created on first use, so the limiter also works on databases set up before it existed.
let ready: Promise<unknown> | null = null
function ensureTable() {
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS auth_attempts (
        bucket CHAR(43) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS auth_attempts_bucket_idx ON auth_attempts (bucket, created_at)`
  })().catch((error) => {
    ready = null
    throw error
  })
  return ready
}

// Keys contain e-mail addresses and IPs; only their hashes are stored.
const bucket = (key: string) => createHash("sha256").update(key).digest("base64url")

/**
 * Seconds until the caller may try again, or null when no rule is exceeded. Fails open: a database
 * problem must never lock the owner out of their own admin.
 */
export async function retryAfter(rules: RateRule[], windowSeconds: number): Promise<number | null> {
  try {
    await ensureTable()
    const result = await sql.query(
      `SELECT bucket, COUNT(*)::int AS attempts,
              EXTRACT(EPOCH FROM (MIN(created_at) + make_interval(secs => $2) - NOW()))::int AS wait
       FROM auth_attempts
       WHERE bucket = ANY($1) AND created_at > NOW() - make_interval(secs => $2)
       GROUP BY bucket`,
      [rules.map((r) => bucket(r.key)), windowSeconds],
    )
    let wait: number | null = null
    for (const rule of rules) {
      const row = result.rows.find((r) => r.bucket === bucket(rule.key))
      if (row && row.attempts >= rule.limit) wait = Math.max(wait ?? 0, row.wait, 1)
    }
    return wait
  } catch (error) {
    console.error("Rate limit check failed:", error)
    return null
  }
}

export async function recordAttempt(rules: RateRule[]) {
  try {
    await ensureTable()
    await sql.query(`INSERT INTO auth_attempts (bucket) SELECT unnest($1::text[])`, [rules.map((r) => bucket(r.key))])
    // Keep the table small without a scheduled job.
    if (Math.random() < 0.05) await sql`DELETE FROM auth_attempts WHERE created_at < NOW() - INTERVAL '1 day'`
  } catch (error) {
    console.error("Rate limit record failed:", error)
  }
}

export async function clearAttempts(rules: RateRule[]) {
  try {
    await ensureTable()
    await sql.query(`DELETE FROM auth_attempts WHERE bucket = ANY($1)`, [rules.map((r) => bucket(r.key))])
  } catch (error) {
    console.error("Rate limit clear failed:", error)
  }
}

export function clientIp(request: Request) {
  // Set by the Vercel edge, which overwrites any value the client sends.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || "unknown"
}

export function tooManyAttempts(seconds: number, action: string) {
  const minutes = Math.max(1, Math.ceil(seconds / 60))
  return Response.json(
    { error: `Te veel pogingen. ${action} over ${minutes} ${minutes === 1 ? "minuut" : "minuten"} opnieuw.` },
    { status: 429, headers: { "Retry-After": String(seconds) } },
  )
}
