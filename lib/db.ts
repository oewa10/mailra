import { sql } from '@vercel/postgres'

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

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

export async function getProducts() {
  try {
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
