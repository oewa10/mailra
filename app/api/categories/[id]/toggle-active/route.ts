import { NextRequest, NextResponse } from 'next/server'
import { toggleCategoryActive, updateProductsCategoryActive } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }
    
    const updatedCategory = await toggleCategoryActive(id)
    if (!updatedCategory) {
      return NextResponse.json({ error: 'Failed to toggle category' }, { status: 500 })
    }

    // Update all products in this category to match the new active status
    await updateProductsCategoryActive(id, updatedCategory.active)

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error toggling category active status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle category active status' },
      { status: 500 }
    )
  }
}
