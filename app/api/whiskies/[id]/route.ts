import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/whiskies/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const whisky = await prisma.whisky.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!whisky) {
      return NextResponse.json({ error: 'Whisky not found' }, { status: 404 })
    }

    return NextResponse.json(whisky)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch whisky' }, { status: 500 })
  }
}

// PUT /api/whiskies/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    await prisma.whiskyTag.deleteMany({ where: { whiskyId: id } })

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const whisky = await prisma.whisky.update({
      where: { id },
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

    return NextResponse.json(whisky)
  } catch (error) {
    console.error('Whisky update error:', error)
    return NextResponse.json({ error: 'Failed to update whisky' }, { status: 500 })
  }
}

// DELETE /api/whiskies/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.whisky.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Whisky deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete whisky' }, { status: 500 })
  }
}
