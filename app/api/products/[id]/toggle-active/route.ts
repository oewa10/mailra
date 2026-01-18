import { NextRequest, NextResponse } from 'next/server'
import { toggleProductActive } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await toggleProductActive(params.id)
    
    if (!result) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error toggling product active status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle product active status' },
      { status: 500 }
    )
  }
}
