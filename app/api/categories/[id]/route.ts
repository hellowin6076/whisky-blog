import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT: 카테고리 수정
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body = await request.json()
    const { name, order } = body

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Failed to update category:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 })
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE: 카테고리 삭제
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    
    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    console.error('Failed to delete category:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}