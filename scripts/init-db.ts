import { sql } from '@vercel/postgres'

// Safe to run repeatedly: creates what is missing and upgrades older databases in place.
async function initializeDatabase() {
  try {
    console.log('Initializing database...')

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
    console.log('✓ Tables')

    // Databases created before visibility switches existed.
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true`
    await sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true`
    await sql`UPDATE products SET active = true WHERE active IS NULL`
    await sql`UPDATE categories SET active = true WHERE active IS NULL`
    console.log('✓ Visibility columns')

    await sql`CREATE INDEX IF NOT EXISTS products_category_idx ON products (category)`
    await sql`CREATE INDEX IF NOT EXISTS products_created_at_idx ON products (created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS password_reset_tokens_user_idx ON password_reset_tokens (user_id)`
    console.log('✓ Indexes')

    await sql`
      INSERT INTO categories (id, name, description) VALUES
      ('stoelen', 'Stoelen', 'Elegante stoelen voor elke gelegenheid'),
      ('tafels', 'Tafels', 'Tafels in diverse maten en stijlen'),
      ('decoratie', 'Decoratie', 'Decoratieve items voor de perfecte sfeer')
      ON CONFLICT (id) DO NOTHING
    `
    console.log('✓ Default categories')

    // Starter collection for a brand-new database only, so products deleted in the admin never return.
    const { rows: existing } = await sql`SELECT COUNT(*)::int AS count FROM products`
    if (existing[0].count === 0) {
      await sql`
          INSERT INTO products (id, name, category, description, dimensions, image) VALUES
          ('chiavari-stoel', 'Chiavari Stoel', 'stoelen', 'Elegante chiavari stoel, perfect voor bruiloften en formele evenementen.', '40 x 40 x 92 cm', '/products/chiavari-chair.jpg'),
          ('crossback-stoel', 'Crossback Stoel', 'stoelen', 'Rustieke crossback stoel met karakteristieke X-vormige rugleuning.', '45 x 45 x 88 cm', '/products/crossback-chair.jpg'),
          ('ghost-stoel', 'Ghost Stoel', 'stoelen', 'Moderne transparante stoel voor een stijlvol en eigentijds effect.', '38 x 40 x 90 cm', '/products/ghost-chair.jpg'),
          ('velvet-stoel', 'Velvet Stoel', 'stoelen', 'Luxe velvet stoel met zachte bekleding voor extra comfort.', '50 x 50 x 85 cm', '/products/velvet-chair.jpg'),
          ('ronde-tafel-150', 'Ronde Tafel 150cm', 'tafels', 'Klassieke ronde tafel, ideaal voor dineropstellingen.', '150 cm diameter, 76 cm hoog', '/products/round-table.jpg'),
          ('rechthoekige-tafel', 'Rechthoekige Tafel', 'tafels', 'Veelzijdige rechthoekige tafel voor diverse opstellingen.', '180 x 80 x 76 cm', '/products/rectangular-table.jpg'),
          ('cocktail-tafel', 'Cocktail Tafel', 'tafels', 'Statafel perfect voor recepties en netwerkevenementen.', '60 cm diameter, 110 cm hoog', '/products/cocktail-table.jpg'),
          ('lange-tafel', 'Lange Tafel', 'tafels', 'Imposante lange tafel voor feestelijke diners.', '240 x 90 x 76 cm', '/products/long-table.jpg'),
          ('bloemenvaas', 'Glazen Bloemenvaas', 'decoratie', 'Elegante glazen vaas voor bloemstukken en tafeldecoratie.', '15 x 15 x 30 cm', '/products/vase.jpg'),
          ('kandelaar', 'Kandelaar Set', 'decoratie', 'Set van 3 gouden kandelaars voor sfeervolle verlichting.', 'Verschillende hoogtes', '/products/candle-holder.jpg'),
          ('tafelloper', 'Tafelloper', 'decoratie', 'Luxe tafelloper beschikbaar in diverse kleuren.', '30 x 200 cm', '/products/table-runner.jpg'),
          ('backdrop', 'Backdrop Frame', 'decoratie', 'Decoratief backdrop frame voor foto-opstellingen.', '200 x 220 cm', '/products/backdrop.jpg')
          ON CONFLICT (id) DO NOTHING
      `
      console.log('✓ Starter products')
    }

    console.log('✅ Database ready')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    process.exit(1)
  }
}

initializeDatabase()
