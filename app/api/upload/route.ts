import { put, del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const oldUrl = formData.get('oldUrl') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 기존 이미지 삭제
    if (oldUrl) {
      try {
        await del(oldUrl)
        console.log('기존 이미지 삭제:', oldUrl)
      } catch (error) {
        console.error('기존 이미지 삭제 실패:', error)
      }
    }

    // 새 이미지 업로드
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
