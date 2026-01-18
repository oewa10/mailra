import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory, deleteCategory, updateCategory } from '@/lib/db'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Category fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const category = await request.json()
    const result = await createCategory(category)
    if (!result) {
      return NextResponse.json({ error: 'Failed to create category in database' }, { status: 500 })
    }
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }
    
    const category = await request.json()
    const result = await updateCategory(id, category)
    if (!result) {
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }
    
    const success = await deleteCategory(id)
    return NextResponse.json({ success })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
