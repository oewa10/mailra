import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

async function createAdminUser() {
  try {
    console.log('Creating admin user...')

    // Default admin credentials
    const email = 'admin@mailra.nl'
    const password = 'Mailra2024!' // Change this to a secure password
    const name = 'Admin'

    // Check if user already exists
    const existing = await sql`SELECT * FROM admin_users WHERE email = ${email}`
    if (existing.rows.length > 0) {
      console.log('✓ Admin user already exists')
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    const id = `admin_${Date.now()}`

    // Create admin user
    await sql`
      INSERT INTO admin_users (id, email, password_hash, name)
      VALUES (${id}, ${email}, ${passwordHash}, ${name})
    `

    console.log('✅ Admin user created successfully!')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('\n⚠️  IMPORTANT: Change this password after first login!')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  }
}

createAdminUser()
