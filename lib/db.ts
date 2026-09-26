import { cache } from 'react'
import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'crypto'
import { slugify } from './slug'
import type { AdminCategory, AdminProduct, AdminStats } from './admin/types'

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

// Uploaded photos live in the image column as data URLs (hundreds of KB each). List queries never
// select that column; they return a short URL instead and /media/products/... streams the bytes.
export const MEDIA_PREFIX = '/media/products/'

// Changes whenever the row changes, so a media URL can be cached forever.
const VERSION_SQL = `floor(extract(epoch from p.updated_at) * 1000)::bigint`

const PRODUCT_COLUMNS = `
  p.id, p.name, p.category, p.description, p.dimensions, p.capacity, p.active,
  p.created_at, p.updated_at,
  substr(p.image, 1, 5) = 'data:' AS image_inline,
  CASE WHEN substr(p.image, 1, 5) = 'data:' THEN NULL ELSE p.image END AS image_path,
  ${VERSION_SQL} AS image_version
`

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  return value ? new Date(String(value)).toISOString() : new Date(0).toISOString()
}

export function mediaUrl(id: string, version: string | number) {
  return `${MEDIA_PREFIX}${encodeURIComponent(id)}/${Number(version).toString(36)}`
}

function imageUrl(row: any): string {
  if (row.image_inline) return mediaUrl(row.id, row.image_version)
  return row.image_path ?? ''
}

function toProduct(row: any): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description ?? '',
    dimensions: row.dimensions ?? '',
    capacity: row.capacity ?? '',
    image: imageUrl(row),
    active: row.active !== false,
    created_at: iso(row.created_at),
    updated_at: iso(row.updated_at),
  }
}

function toCategory(row: any): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    active: row.active !== false,
    product_count: Number(row.product_count ?? 0),
    active_product_count: Number(row.active_product_count ?? 0),
  }
}

async function uniqueId(table: 'products' | 'categories', name: string): Promise<string> {
  const base = slugify(name)
  const pattern = `${base}-%`
  const result =
    table === 'products'
      ? await sql`SELECT id FROM products WHERE id = ${base} OR id LIKE ${pattern}`
      : await sql`SELECT id FROM categories WHERE id = ${base} OR id LIKE ${pattern}`
  const taken = new Set(result.rows.map((r) => r.id as string))
  if (!taken.has(base)) return base
  for (let i = 2; ; i++) {
    if (!taken.has(`${base}-${i}`)) return `${base}-${i}`
  }
}

function isUniqueViolation(error: unknown) {
  return (error as { code?: string })?.code === '23505'
}

/** Two saves with the same name can race for the same slug; the loser picks the next free one. */
async function insertWithUniqueId<T>(
  table: 'products' | 'categories',
  name: string,
  insert: (id: string) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const id = await uniqueId(table, name)
    try {
      return await insert(id)
    } catch (error) {
      if (!isUniqueViolation(error) || attempt >= 4) throw error
    }
  }
}

// ---------------------------------------------------------------------------
// Public catalog
// ---------------------------------------------------------------------------

export type CatalogProduct = Pick<
  AdminProduct,
  'id' | 'name' | 'category' | 'description' | 'dimensions' | 'capacity' | 'image'
>

export type CatalogCategory = {
  id: string
  name: string
  description: string
  productCount: number
  /** First product photo in the category, for tiles without dedicated artwork. */
  coverImage: string
}

export type Catalog = { categories: CatalogCategory[]; products: CatalogProduct[] }

/**
 * Everything the public site shows: products that are switched on and whose category is too, plus
 * the categories that have at least one such product. Returns null when no database is configured
 * (local builds); real query errors are thrown so a failed ISR refresh keeps serving the last good
 * page instead of caching an empty catalog.
 */
export const getPublicCatalog = cache(async (): Promise<Catalog | null> => {
  if (!process.env.POSTGRES_URL) return null

  const [productRows, categoryRows] = await Promise.all([
    sql.query(`
      SELECT ${PRODUCT_COLUMNS}
      FROM products p
      LEFT JOIN categories c ON c.id = p.category
      WHERE p.active AND c.active IS NOT FALSE
      ORDER BY p.created_at DESC, p.name ASC
    `),
    sql`SELECT id, name, description FROM categories WHERE active ORDER BY name ASC`,
  ])

  const products: CatalogProduct[] = productRows.rows.map((row) => {
    const { id, name, category, description, dimensions, capacity, image } = toProduct(row)
    return { id, name, category, description, dimensions, capacity, image }
  })

  const categories: CatalogCategory[] = categoryRows.rows
    .map((row) => {
      const inCategory = products.filter((p) => p.category === row.id)
      return {
        id: row.id as string,
        name: row.name as string,
        description: (row.description as string) ?? '',
        productCount: inCategory.length,
        coverImage: inCategory.find((p) => p.image)?.image ?? '',
      }
    })
    .filter((c) => c.productCount > 0)

  return { categories, products }
})

// ---------------------------------------------------------------------------
// Products (admin)
// ---------------------------------------------------------------------------

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const result = await sql.query(`SELECT ${PRODUCT_COLUMNS} FROM products p ORDER BY p.created_at DESC`)
  return result.rows.map(toProduct)
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const result = await sql.query(`SELECT ${PRODUCT_COLUMNS} FROM products p WHERE p.id = $1`, [id])
  return result.rows[0] ? toProduct(result.rows[0]) : null
}

/** Raw bytes for /media/products/[id]; null when the product has no uploaded photo. */
export async function getProductImage(id: string) {
  const result = await sql.query(
    `SELECT p.image, ${VERSION_SQL} AS image_version FROM products p WHERE p.id = $1`,
    [id],
  )
  const row = result.rows[0]
  if (!row?.image) return null
  return { image: row.image as string, version: Number(row.image_version).toString(36) }
}

type ProductInput = {
  name: string
  category: string
  description: string
  dimensions: string
  capacity: string
  image: string
  active?: boolean
}

export async function createProduct(input: ProductInput): Promise<AdminProduct> {
  // A media URL only makes sense for the product it belongs to.
  const image = input.image.startsWith(MEDIA_PREFIX) ? '' : input.image
  return insertWithUniqueId('products', input.name, async (id) => {
    const result = await sql.query(
      `WITH p AS (
         INSERT INTO products (id, name, category, description, dimensions, capacity, image, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *
       )
       SELECT ${PRODUCT_COLUMNS} FROM p`,
      [id, input.name, input.category, input.description, input.dimensions, input.capacity, image, input.active ?? true],
    )
    return toProduct(result.rows[0])
  })
}

export async function updateProduct(id: string, input: ProductInput): Promise<AdminProduct | null> {
  // The editor echoes the current media URL back when the photo wasn't touched: keep the stored bytes.
  const keepImage = input.image.startsWith(MEDIA_PREFIX)
  const result = await sql.query(
    `WITH p AS (
       UPDATE products
       SET name = $2, category = $3, description = $4, dimensions = $5, capacity = $6,
           image = CASE WHEN $7::boolean THEN image ELSE $8 END,
           active = COALESCE($9::boolean, active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *
     )
     SELECT ${PRODUCT_COLUMNS} FROM p`,
    [
      id, input.name, input.category, input.description, input.dimensions, input.capacity,
      keepImage, keepImage ? null : input.image, input.active ?? null,
    ],
  )
  return result.rows[0] ? toProduct(result.rows[0]) : null
}

export async function setProductActive(id: string, active: boolean): Promise<AdminProduct | null> {
  const result = await sql.query(
    `WITH p AS (
       UPDATE products SET active = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *
     )
     SELECT ${PRODUCT_COLUMNS} FROM p`,
    [id, active],
  )
  return result.rows[0] ? toProduct(result.rows[0]) : null
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM products WHERE id = ${id}`
  return (result.rowCount ?? 0) > 0
}

export async function setProductsActive(ids: string[], active: boolean): Promise<number> {
  const result = await sql.query(
    'UPDATE products SET active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = ANY($2::text[]) AND active <> $1',
    [active, ids],
  )
  return result.rowCount ?? 0
}

export async function deleteProducts(ids: string[]): Promise<number> {
  const result = await sql.query('DELETE FROM products WHERE id = ANY($1::text[])', [ids])
  return result.rowCount ?? 0
}

// ---------------------------------------------------------------------------
// Categories (admin)
// ---------------------------------------------------------------------------

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const result = await sql`
    SELECT c.id, c.name, c.description, c.active,
           COUNT(p.id) AS product_count,
           COUNT(p.id) FILTER (WHERE p.active) AS active_product_count
    FROM categories c
    LEFT JOIN products p ON p.category = c.id
    GROUP BY c.id
    ORDER BY c.name ASC
  `
  return result.rows.map(toCategory)
}

async function getAdminCategory(id: string): Promise<AdminCategory | null> {
  const result = await sql`
    SELECT c.id, c.name, c.description, c.active,
           COUNT(p.id) AS product_count,
           COUNT(p.id) FILTER (WHERE p.active) AS active_product_count
    FROM categories c
    LEFT JOIN products p ON p.category = c.id
    WHERE c.id = ${id}
    GROUP BY c.id
  `
  return result.rows[0] ? toCategory(result.rows[0]) : null
}

export async function categoryExists(id: string): Promise<boolean> {
  const result = await sql`SELECT 1 FROM categories WHERE id = ${id}`
  return result.rows.length > 0
}

export async function createCategory(input: { name: string; description: string }) {
  const id = await insertWithUniqueId('categories', input.name, async (id) => {
    await sql`
      INSERT INTO categories (id, name, description, active)
      VALUES (${id}, ${input.name}, ${input.description}, true)
    `
    return id
  })
  return getAdminCategory(id)
}

export async function updateCategory(id: string, input: { name: string; description: string }) {
  const result = await sql`
    UPDATE categories
    SET name = ${input.name}, description = ${input.description}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `
  return (result.rowCount ?? 0) > 0 ? getAdminCategory(id) : null
}

/** Hiding a category hides its products publicly without touching their own visibility flag. */
export async function setCategoryActive(id: string, active: boolean) {
  const result = await sql`
    UPDATE categories SET active = ${active}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `
  return (result.rowCount ?? 0) > 0 ? getAdminCategory(id) : null
}

export async function countProductsInCategory(id: string): Promise<number> {
  const result = await sql`SELECT COUNT(*) AS count FROM products WHERE category = ${id}`
  return Number(result.rows[0]?.count ?? 0)
}

export async function deleteCategory(id: string): Promise<boolean> {
  // Guarded in SQL too, so a product added in the meantime can't be orphaned.
  const result = await sql`
    DELETE FROM categories
    WHERE id = ${id} AND NOT EXISTS (SELECT 1 FROM products WHERE category = ${id})
  `
  return (result.rowCount ?? 0) > 0
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export async function getAdminStats(): Promise<AdminStats> {
  const result = await sql`
    SELECT
      (SELECT COUNT(*) FROM products) AS products,
      (SELECT COUNT(*) FROM products p LEFT JOIN categories c ON c.id = p.category
        WHERE p.active AND c.active IS NOT FALSE) AS active_products,
      (SELECT COUNT(*) FROM categories) AS categories,
      (SELECT COUNT(*) FROM products WHERE image IS NULL OR image = '') AS without_image,
      (SELECT COUNT(*) FROM products WHERE description IS NULL OR description = '') AS without_description,
      (SELECT COUNT(*) FROM products p JOIN categories c ON c.id = p.category
        WHERE p.active AND NOT c.active) AS hidden_by_category
  `
  const row = result.rows[0] ?? {}
  return {
    products: Number(row.products ?? 0),
    activeProducts: Number(row.active_products ?? 0),
    categories: Number(row.categories ?? 0),
    withoutImage: Number(row.without_image ?? 0),
    withoutDescription: Number(row.without_description ?? 0),
    hiddenByCategory: Number(row.hidden_by_category ?? 0),
  }
}

export async function getRecentlyUpdatedProducts(limit = 5): Promise<AdminProduct[]> {
  const result = await sql.query(
    `SELECT ${PRODUCT_COLUMNS} FROM products p ORDER BY p.updated_at DESC LIMIT $1`,
    [limit],
  )
  return result.rows.map(toProduct)
}

// ---------------------------------------------------------------------------
// Admin authentication
// ---------------------------------------------------------------------------

// Compared against when the e-mail is unknown, so response time doesn't reveal which accounts exist.
const DUMMY_HASH = '$2b$10$ayI6suTvIPWPcr91owVwP.xIOyfDiPCLuzd/geViqs9K1t7cCDL.O'

export async function getAdminByEmail(email: string) {
  const result = await sql`SELECT * FROM admin_users WHERE lower(email) = lower(${email.trim()})`
  return result.rows[0] ?? null
}

export async function verifyAdminPassword(email: string, password: string) {
  const user = await getAdminByEmail(email)
  const isValid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH)
  return user && isValid ? user : null
}

export async function changeAdminPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<'ok' | 'wrong-password' | 'not-found'> {
  const result = await sql`SELECT password_hash FROM admin_users WHERE id = ${userId}`
  const user = result.rows[0]
  if (!user) return 'not-found'
  if (!(await bcrypt.compare(currentPassword, user.password_hash))) return 'wrong-password'

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await sql`
    UPDATE admin_users SET password_hash = ${passwordHash}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `
  await sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}`
  return 'ok'
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url')
  const id = `reset_${randomBytes(8).toString('hex')}`
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

  await sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}`
  await sql`
    INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
    VALUES (${id}, ${userId}, ${hashToken(token)}, ${expiresAt})
  `
  return token
}

export async function verifyResetToken(token: string) {
  const result = await sql`
    SELECT * FROM password_reset_tokens
    WHERE token = ${hashToken(token)} AND expires_at > NOW()
  `
  return result.rows[0] ?? null
}

export async function resetAdminPassword(userId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await sql`
    UPDATE admin_users SET password_hash = ${passwordHash}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `
  await sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}`
  return true
}
