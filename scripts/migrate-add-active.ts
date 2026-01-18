import { sql } from '@vercel/postgres'

async function migrateAddActive() {
  try {
    console.log('Adding active column to products table...')
    
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true`
    
    console.log('✓ Active column added successfully')
  } catch (error) {
    console.error('❌ Migration error:', error)
    process.exit(1)
  }
}

migrateAddActive()
