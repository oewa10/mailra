import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

async function createAdminUser() {
  try {
    console.log('Creating admin user...')

    const email = process.env.ADMIN_EMAIL || 'admin@mailra.nl'
    const password = process.env.ADMIN_PASSWORD || 'Mailra2024!'
    const name = process.env.ADMIN_NAME || 'Admin'

    // Check if user already exists
    const existing = await sql`SELECT * FROM admin_users WHERE email = ${email}`
    if (existing.rows.length > 0) {
      console.log('✓ Admin user already exists')
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)
    const id = `admin_${Date.now()}`

    // Create admin user
    await sql`
      INSERT INTO admin_users (id, email, password_hash, name)
      VALUES (${id}, ${email}, ${passwordHash}, ${name})
    `

    console.log('✅ Admin user created successfully!')
    console.log(`Email: ${email}`)
    if (!process.env.ADMIN_PASSWORD) {
      console.log(`Password: ${password}`)
      console.log('\n⚠️  Default password used — change it under Admin → Account after first login.')
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  }
}

createAdminUser()
