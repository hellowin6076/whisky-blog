import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://whisky-blog-bufgix.vercel.app'

  // 모든 위스키 가져오기
  const whiskies = await prisma.whisky.findMany({
    select: {
      slug: true,
      createdAt: true,
    },
  })

  const whiskyUrls = whiskies.map((whisky) => ({
    url: `${baseUrl}/whisky/${whisky.slug}`,
    lastModified: whisky.createdAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...whiskyUrls,
  ]
}
