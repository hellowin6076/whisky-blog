import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 기존 하드코딩된 카테고리들
const INITIAL_CATEGORIES = [
  { name: '싱글몰트', order: 1 },
  { name: '블렌디드', order: 2 },
  { name: '버번', order: 3 },
  { name: '라이', order: 4 },
  { name: '아이리시', order: 5 },
  { name: '재패니즈', order: 6 },
  { name: '아메리칸', order: 7 },
  { name: '기타', order: 8 },
]

async function main() {
  console.log('🌱 Seeding categories...')

  for (const category of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
    console.log(`✅ Category: ${category.name}`)
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
