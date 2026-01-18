# Admin Panel Setup Guide

## Overview
The admin panel is a professional dashboard for managing Mailra products and categories. It's built with Next.js, React, and Tailwind CSS.

## Access the Admin Panel
- **URL**: `http://localhost:3000/admin`
- **Dashboard**: View product and category statistics
- **Products**: Add, edit, and delete products with full details
- **Categories**: Manage product categories

## Features

### Dashboard (`/admin`)
- Overview statistics (total products, categories, active items)
- Quick links to product and category management

### Product Management (`/admin/products`)
**Editable Fields:**
- **Productnaam** (Name) - Required
- **Categorie** (Category) - Required, dropdown selection
- **Beschrijving** (Description) - Full product description
- **Afmetingen** (Dimensions) - e.g., "40 x 40 x 92 cm"
- **Capaciteit** (Capacity) - e.g., "8 personen"
- **Afbeelding** (Image) - Upload and preview functionality

**Actions:**
- Add new products with the "+ Nieuw Product" button
- Edit existing products with the edit icon
- Delete products with the delete icon
- Search products by name or category

### Category Management (`/admin/categories`)
**Editable Fields:**
- **Categorienaam** (Category Name) - Required
- **Beschrijving** (Description) - Category description

**Actions:**
- Add new categories with the "+ Nieuwe Categorie" button
- Edit categories with the edit button
- Delete categories with the delete button

## Current Data Storage
Products and categories are currently stored in:
- `lib/products.ts` - Static data file

## Next Steps: Database Integration

### Recommended: Supabase (PostgreSQL)
1. Create a free account at https://supabase.com
2. Create a new project
3. Set up tables for products and categories
4. Install Supabase client: `npm install @supabase/supabase-js`
5. Create environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

### Alternative: Vercel Postgres
1. Link your Vercel project to your repository
2. Add Vercel Postgres database
3. Install client: `npm install @vercel/postgres`
4. Use SQL queries to manage data

### Alternative: Firebase
1. Create a Firebase project at https://firebase.google.com
2. Set up Firestore database
3. Install Firebase: `npm install firebase`
4. Configure authentication and storage

## File Structure
```
app/
├── admin/
│   ├── layout.tsx          # Admin layout with sidebar
│   ├── page.tsx            # Dashboard
│   ├── products/
│   │   └── page.tsx        # Products management
│   └── categories/
│       └── page.tsx        # Categories management
components/
├── admin/
│   ├── product-form.tsx    # Product form component
│   ├── product-table.tsx   # Products table display
│   └── admin-sidebar.tsx   # Navigation sidebar
lib/
└── products.ts             # Product data and types
```

## UI Components Used
- Lucide React icons
- shadcn/ui Button component
- Tailwind CSS for styling
- Custom form inputs with validation

## Features Ready for Implementation
- ✅ Product CRUD operations (add/edit/delete)
- ✅ Category management
- ✅ Image upload with preview
- ✅ Search and filter
- ✅ Professional dashboard UI
- ⏳ Database persistence (ready for integration)
- ⏳ Authentication (ready for implementation)
- ⏳ User roles and permissions
- ⏳ Bulk operations
- ⏳ Product import/export

## Notes
- Images are currently stored as base64 data URLs (suitable for demo)
- For production, use cloud storage (Supabase Storage, Firebase Storage, or AWS S3)
- All data is currently in-memory; refresh the page will reset changes
- Ready to connect to any database backend
