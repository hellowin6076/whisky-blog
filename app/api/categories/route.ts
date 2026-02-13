import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 모든 카테고리 조회
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST: 새 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, order } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        order: order ?? 0,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create category:', error)
    
    // 중복 이름 에러 처리
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 })
    }
    
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

