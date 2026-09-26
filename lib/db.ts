import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'
import { createHash, randomBytes } from 'crypto'
import { slugify } from './slug'
import type { AdminCategory, AdminProduct, AdminStats } from './admin/types'

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        dimensions VARCHAR(255),
        capacity VARCHAR(255),
        image TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  return value ? new Date(String(value)).toISOString() : new Date(0).toISOString()
}

function toProduct(row: any): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description ?? '',
    dimensions: row.dimensions ?? '',
    capacity: row.capacity ?? '',
    image: row.image ?? '',
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

// ---------------------------------------------------------------------------
// Products — public reads swallow errors so the site still renders without a DB
// ---------------------------------------------------------------------------

export async function getProducts(activeOnly: boolean = false): Promise<AdminProduct[]> {
  try {
    // Public visibility needs both the product and its category switched on.
    const result = activeOnly
      ? await sql`
          SELECT p.* FROM products p
          LEFT JOIN categories c ON c.id = p.category
          WHERE p.active AND c.active IS NOT FALSE
          ORDER BY p.created_at DESC
        `
      : await sql`SELECT * FROM products ORDER BY created_at DESC`
    return result.rows.map(toProduct)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const result = await sql`SELECT * FROM products ORDER BY created_at DESC`
  return result.rows.map(toProduct)
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const result = await sql`SELECT * FROM products WHERE id = ${id}`
  return result.rows[0] ? toProduct(result.rows[0]) : null
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
  const id = await uniqueId('products', input.name)
  const result = await sql`
    INSERT INTO products (id, name, category, description, dimensions, capacity, image, active)
    VALUES (${id}, ${input.name}, ${input.category}, ${input.description}, ${input.dimensions},
            ${input.capacity}, ${input.image}, ${input.active ?? true})
    RETURNING *
  `
  return toProduct(result.rows[0])
}

export async function updateProduct(id: string, input: ProductInput): Promise<AdminProduct | null> {
  const result = await sql`
    UPDATE products
    SET name = ${input.name}, category = ${input.category}, description = ${input.description},
        dimensions = ${input.dimensions}, capacity = ${input.capacity}, image = ${input.image},
        active = COALESCE(${input.active ?? null}::boolean, active),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `
  return result.rows[0] ? toProduct(result.rows[0]) : null
}

export async function setProductActive(id: string, active: boolean): Promise<AdminProduct | null> {
  const result = await sql`
    UPDATE products SET active = ${active}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `
  return result.rows[0] ? toProduct(result.rows[0]) : null
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM products WHERE id = ${id}`
  return (result.rowCount ?? 0) > 0
}

export async function setProductsActive(ids: string[], active: boolean): Promise<number> {
  const result = await sql.query(
    'UPDATE products SET active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = ANY($2::text[])',
    [active, ids],
  )
  return result.rowCount ?? 0
}

export async function deleteProducts(ids: string[]): Promise<number> {
  const result = await sql.query('DELETE FROM products WHERE id = ANY($1::text[])', [ids])
  return result.rowCount ?? 0
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategories() {
  try {
    const result = await sql`SELECT * FROM categories ORDER BY created_at DESC`
    return result.rows
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoriesWithProductCounts(activeOnly: boolean = true) {
  try {
    const result = activeOnly
      ? await sql`
          SELECT c.*, COUNT(p.id) AS product_count
          FROM categories c
          LEFT JOIN products p ON p.category = c.id AND p.active
          WHERE c.active
          GROUP BY c.id
          ORDER BY c.created_at DESC
        `
      : await sql`
          SELECT c.*, COUNT(p.id) AS product_count
          FROM categories c
          LEFT JOIN products p ON p.category = c.id
          GROUP BY c.id
          ORDER BY c.created_at DESC
        `
    return result.rows
  } catch (error) {
    console.error('Error fetching categories with product counts:', error)
    return []
  }
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const result = await sql`
    SELECT c.*,
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
    SELECT c.*,
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
  const id = await uniqueId('categories', input.name)
  await sql`
    INSERT INTO categories (id, name, description, active)
    VALUES (${id}, ${input.name}, ${input.description}, true)
  `
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
  const result = await sql`DELETE FROM categories WHERE id = ${id}`
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
  const result = await sql`SELECT * FROM products ORDER BY updated_at DESC LIMIT ${limit}`
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
