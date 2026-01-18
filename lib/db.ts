import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

export async function initializeDatabase() {
  try {
    // Create products table
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

    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create admin users table
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

    // Create password reset tokens table
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

export async function getProducts(activeOnly: boolean = false) {
  try {
    if (activeOnly) {
      const result = await sql`SELECT * FROM products WHERE active = true ORDER BY created_at DESC`
      return result.rows
    }
    const result = await sql`SELECT * FROM products ORDER BY created_at DESC`
    return result.rows
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const result = await sql`SELECT * FROM products WHERE id = ${id}`
    return result.rows[0]
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function createProduct(product: any) {
  try {
    const result = await sql`
      INSERT INTO products (id, name, category, description, dimensions, capacity, image)
      VALUES (${product.id}, ${product.name}, ${product.category}, ${product.description}, ${product.dimensions}, ${product.capacity}, ${product.image})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error creating product:', error)
    return null
  }
}

export async function updateProduct(id: string, product: any) {
  try {
    const result = await sql`
      UPDATE products
      SET name = ${product.name}, category = ${product.category}, description = ${product.description}, 
          dimensions = ${product.dimensions}, capacity = ${product.capacity}, image = ${product.image},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error updating product:', error)
    return null
  }
}

export async function deleteProduct(id: string) {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    return false
  }
}

export async function toggleProductActive(id: string) {
  try {
    const result = await sql`
      UPDATE products 
      SET active = NOT active, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error toggling product active status:', error)
    return null
  }
}

export async function getCategories() {
  try {
    const result = await sql`SELECT * FROM categories ORDER BY created_at DESC`
    return result.rows
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function createCategory(category: any) {
  try {
    const result = await sql`
      INSERT INTO categories (id, name, description)
      VALUES (${category.id}, ${category.name}, ${category.description})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error creating category:', error)
    return null
  }
}

export async function updateCategory(id: string, category: any) {
  try {
    const result = await sql`
      UPDATE categories
      SET name = ${category.name}, description = ${category.description}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error updating category:', error)
    return null
  }
}

export async function deleteCategory(id: string) {
  try {
    await sql`DELETE FROM categories WHERE id = ${id}`
    return true
  } catch (error) {
    console.error('Error deleting category:', error)
    return false
  }
}

// Admin authentication functions
export async function getAdminByEmail(email: string) {
  try {
    const result = await sql`SELECT * FROM admin_users WHERE email = ${email}`
    return result.rows[0]
  } catch (error) {
    console.error('Error fetching admin user:', error)
    return null
  }
}

export async function verifyAdminPassword(email: string, password: string) {
  try {
    const user = await getAdminByEmail(email)
    if (!user) return null
    
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) return null
    
    return user
  } catch (error) {
    console.error('Error verifying password:', error)
    return null
  }
}

export async function createPasswordResetToken(userId: string) {
  try {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const id = `reset_${Date.now()}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    
    await sql`
      INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
      VALUES (${id}, ${userId}, ${token}, ${expiresAt})
    `
    
    return token
  } catch (error) {
    console.error('Error creating reset token:', error)
    return null
  }
}

export async function verifyResetToken(token: string) {
  try {
    const result = await sql`
      SELECT * FROM password_reset_tokens 
      WHERE token = ${token} AND expires_at > NOW()
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error verifying reset token:', error)
    return null
  }
}

export async function resetAdminPassword(userId: string, newPassword: string) {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10)
    
    await sql`
      UPDATE admin_users 
      SET password_hash = ${passwordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `
    
    // Delete all reset tokens for this user
    await sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}`
    
    return true
  } catch (error) {
    console.error('Error resetting password:', error)
    return false
  }
}
