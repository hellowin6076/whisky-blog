import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/whiskies - 위스키 목록
export async function GET() {
  try {
    const whiskies = await prisma.whisky.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(whiskies)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch whiskies' }, { status: 500 })
  }
}

// POST /api/whiskies - 위스키 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      distillery,
      category,
      age,
      abv,
      rating,
      coverImage,
      nose,
      palate,
      finish,
      impression,
      price,
      purchaseDate,
      description,
      notes,
      tags,
    } = body

    // slug 생성 (한글 지원)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // 위스키 생성
    const whisky = await prisma.whisky.create({
      data: {
        title,
        slug,
        distillery: distillery || null,
        category,
        age: age ? parseInt(age) : null,
        abv: abv ? parseFloat(abv) : null,
        rating: rating ? parseFloat(rating) : null,
        coverImage: coverImage || null,
        nose: nose || null,
        palate: palate || null,
        finish: finish || null,
        impression: impression || null,
        price: price ? parseInt(price) : null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        description: description || null,
        notes: notes || null,
        tags: {
          create: await Promise.all(
            (tags || []).map(async (tagName: string) => {
              let tag = await prisma.whiskyTagMaster.findUnique({
                where: { name: tagName },
              })

              if (!tag) {
                tag = await prisma.whiskyTagMaster.create({
                  data: { name: tagName },
                })
              }

              return {
                tag: {
                  connect: { id: tag.id },
                },
              }
            })
          ),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(whisky, { status: 201 })
  } catch (error) {
    console.error('Whisky creation error:', error)
    return NextResponse.json({ error: 'Failed to create whisky' }, { status: 500 })
  }
}
