# Vercel Postgres Setup Guide

## Overview
This guide walks you through setting up Vercel Postgres for the Mailra admin panel to persist product and category data.

## Step 1: Create a Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in or create an account
3. Click "New Project"
4. Import your GitHub repository: `https://github.com/oewa10/mailra`
5. Click "Import"

## Step 2: Add Vercel Postgres Database

1. In your Vercel project dashboard, go to **Storage**
2. Click **Create Database** → **Postgres**
3. Name it: `mailra-db`
4. Select your region (closest to your users)
5. Click **Create**

## Step 3: Set Environment Variables

After creating the database, Vercel will automatically add these environment variables:
- `POSTGRES_URLSTATE`
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DATABASE`

These are automatically available in your Next.js app.

## Step 4: Initialize the Database

Run the initialization script to create tables:

```bash
npm run db:init
```

Or manually run this in your Vercel dashboard's SQL editor:

```sql
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  dimensions VARCHAR(255),
  capacity VARCHAR(255),
  image BYTEA,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 5: Seed Initial Data

To populate the database with your existing products and categories, use the admin panel to add them or run a seed script.

## API Endpoints

The following API endpoints are now available:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products?id=[id]` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories?id=[id]` - Delete category

## Local Development

For local development, you need to set up environment variables:

1. Create a `.env.local` file in your project root:

```
POSTGRES_URL=postgresql://user:password@localhost:5432/mailra
```

2. Or use Vercel's local development with:

```bash
vercel env pull
```

This downloads your production environment variables for local testing.

## Deployment

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Add Vercel Postgres integration"
git push origin main
```

2. Vercel will automatically deploy your changes
3. The database will be ready to use immediately

## Troubleshooting

### "POSTGRES_URL not found"
- Make sure you've created the Postgres database in Vercel
- Check that environment variables are properly set in Vercel dashboard
- Redeploy after adding the database

### "Connection refused"
- Verify the database is running in Vercel dashboard
- Check that you're using the correct connection string
- Try using `POSTGRES_URL_NON_POOLING` for direct connections

### Images not storing
- Currently using BYTEA for image storage (base64 encoded)
- For production, consider using Vercel Blob Storage for images
- Update the image field to store URLs instead of binary data

## Next Steps

1. **Image Storage**: Migrate to Vercel Blob Storage for better performance
2. **Authentication**: Add admin authentication to protect the admin panel
3. **Backups**: Set up automated database backups
4. **Monitoring**: Enable query logging and performance monitoring

## File Structure

```
app/
├── api/
│   ├── products/
│   │   ├── route.ts          # GET/POST/DELETE products
│   │   └── [id]/route.ts     # GET/PUT product by ID
│   └── categories/
│       ├── route.ts          # GET/POST/DELETE categories
│       └── [id]/route.ts     # PUT category by ID
lib/
└── db.ts                      # Database functions
```

## Database Functions (lib/db.ts)

- `initializeDatabase()` - Create tables
- `getProducts()` - Fetch all products
- `getProductById(id)` - Fetch single product
- `createProduct(product)` - Create new product
- `updateProduct(id, product)` - Update product
- `deleteProduct(id)` - Delete product
- `getCategories()` - Fetch all categories
- `createCategory(category)` - Create new category
- `updateCategory(id, category)` - Update category
- `deleteCategory(id)` - Delete category

## Support

For issues with Vercel Postgres:
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Support](https://vercel.com/support)
