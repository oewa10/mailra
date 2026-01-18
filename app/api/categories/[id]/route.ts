import { NextRequest, NextResponse } from 'next/server'
import { updateCategory } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await request.json()
    const result = await updateCategory(params.id, category)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}
