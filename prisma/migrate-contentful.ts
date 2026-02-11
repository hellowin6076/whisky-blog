import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Contentful JSON 타입
interface ContentfulWhisky {
  sys: {
    id: string
    contentType: { sys: { id: string } }
  }
  fields: {
    title: { 'en-US': string }
    types: { 'en-US': string }
    years?: { 'en-US': string }
    price?: { 'en-US': string }
    description?: { 'en-US': string }
    url: { 'en-US': string }
    image?: {
      'en-US': {
        sys: {
          id: string
        }
      }
    }
    content?: {
      'en-US': {
        tags?: string[]
        impression?: string[]
      }
    }
  }
}

interface ContentfulAsset {
  sys: { id: string }
  fields: {
    file: {
      'en-US': {
        url: string
      }
    }
  }
}

// 연수 파싱: "10" → 10, "NAS" → null
function parseAge(years?: string): number | null {
  if (!years || years === 'NAS') return null
  const parsed = parseInt(years)
  return isNaN(parsed) ? null : parsed
}

// 가격 파싱: "4000円" → 4000, "2200円" → 2200
function parsePrice(price?: string): number | null {
  if (!price) return null
  const match = price.match(/\d+/)
  return match ? parseInt(match[0]) : null
}

async function main() {
  console.log('🚀 Contentful 데이터 마이그레이션 시작...\n')

  // JSON 파일 읽기
  const jsonPath = path.join(__dirname, '../data/contentful-export.json')
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ contentful-export.json 파일을 찾을 수 없습니다.')
    console.log('💡 data/contentful-export.json 경로에 파일을 넣어주세요.')
    return
  }

  const contentfulData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  
  // Assets 매핑 (이미지 URL)
  const assets: Map<string, string> = new Map()
  if (contentfulData.assets) {
    contentfulData.assets.forEach((asset: ContentfulAsset) => {
      const url = asset.fields?.file?.['en-US']?.url
      if (url) {
        assets.set(asset.sys.id, url.startsWith('//') ? `https:${url}` : url)
      }
    })
  }

  // Whisky 엔트리 필터링
  const whiskies: ContentfulWhisky[] = contentfulData.entries.filter(
    (entry: any) => entry.sys.contentType.sys.id === 'whisky'
  )

  console.log(`📦 발견된 위스키: ${whiskies.length}개\n`)

  let successCount = 0
  let errorCount = 0

  for (const contentfulWhisky of whiskies) {
    const fields = contentfulWhisky.fields
    
    try {
      const title = fields.title['en-US']
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, '-')
        .replace(/(^-|-$)/g, '')
      const category = fields.types['en-US']
      const age = parseAge(fields.years?.['en-US'])
      const price = parsePrice(fields.price?.['en-US'])
      const description = fields.description?.['en-US'] || null
      
      // 이미지 URL
      const imageId = fields.image?.['en-US']?.sys?.id
      const coverImage = imageId ? assets.get(imageId) || null : null
      
      // 태그 & 감상
      const contentData = fields.content?.['en-US']
      const tags = contentData?.tags || []
      const impressionText = contentData?.impression?.[0] || null

      // Whisky 생성
      const whisky = await prisma.whisky.create({
        data: {
          title,
          slug,
          category,
          age,
          price,
          description,
          coverImage: null,  // 이미지는 나중에 관리자에서 직접 업로드
          impression: impressionText,
          // 나머지는 null (나중에 직접 입력)
          distillery: null,
          abv: null,
          rating: null,
          nose: null,
          palate: null,
          finish: null,
          purchaseDate: null,
          notes: null,
        },
      })

      // 태그 생성 및 연결
      for (const tagName of tags) {
        // 위스키 태그 찾거나 생성
        let tag = await prisma.whiskyTagMaster.findUnique({
          where: { name: tagName },
        })

        if (!tag) {
          tag = await prisma.whiskyTagMaster.create({
            data: { name: tagName },
          })
        }

        // WhiskyTag 연결
        await prisma.whiskyTag.create({
          data: {
            whiskyId: whisky.id,
            tagId: tag.id,
          },
        })
      }

      console.log(`✅ ${title} (태그: ${tags.length}개)`)
      successCount++

    } catch (error) {
      console.error(`❌ ${fields.title['en-US']} 실패:`, error)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✨ 마이그레이션 완료!`)
  console.log(`   성공: ${successCount}개`)
  console.log(`   실패: ${errorCount}개`)
  console.log('='.repeat(50))
}

main()
  .catch((e) => {
    console.error('💥 마이그레이션 오류:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
