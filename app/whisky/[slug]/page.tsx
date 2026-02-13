import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import DisqusComments from '@/components/DisqusComments'

async function getWhisky(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const decodedSlug = decodeURIComponent(slug)

  const res = await fetch(`${baseUrl}/api/whiskies`, {
    cache: 'no-store',
  })
  if (!res.ok) return null

  const whiskies = await res.json()
  return whiskies.find((w: any) => w.slug === decodedSlug)
}

interface Whisky {
  id: string
  title: string
  slug: string
  distillery: string | null
  category: string
  age: number | null
  abv: number | null
  rating: number | null
  coverImage: string | null
  nose: string | null
  palate: string | null
  finish: string | null
  impression: string | null
  price: number | null
  purchaseDate: string | null
  description: string | null
  notes: string | null
  createdAt: string
  tags: { tag: { name: string } }[]
}

export default async function WhiskyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const whisky: Whisky | null = await getWhisky(slug)

  if (!whisky) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {whisky.title}
          </h1>

          {/* 태그 */}
          {whisky.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {whisky.tags.map((wt) => (
                <span
                  key={wt.tag.name}
                  className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-sm"
                >
                  #{wt.tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 평점 */}
          {whisky.rating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-2xl">
                {'⭐'.repeat(Math.round(whisky.rating))}
              </span>
              <span className="text-lg font-medium text-gray-700">
                {whisky.rating.toFixed(1)} / 5.0
              </span>
            </div>
          )}

          {/* 날짜 */}
          <p className="text-sm text-gray-500 mb-8">
            {new Date(whisky.createdAt).toLocaleDateString('ko-KR')}
          </p>

          {/* 이미지 + 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* 왼쪽: 이미지 */}
            <div>
              {whisky.coverImage ? (
                <img
                  src={whisky.coverImage}
                  alt={whisky.title}
                  className="w-full max-h-[60vh] object-contain rounded-lg sticky top-4 bg-white"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-6xl">🥃</span>
                </div>
              )}
            </div>

            {/* 오른쪽: 기본 정보 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">기본 정보</h2>
              <ul className="space-y-2">
                {whisky.distillery && (
                  <li className="flex items-center text-gray-700 text-lg">
                    <span className="font-medium w-24">증류소:</span>
                    <span>{whisky.distillery}</span>
                  </li>
                )}
                <li className="flex items-center text-gray-700 text-lg">
                  <span className="font-medium w-24">카테고리:</span>
                  <span>{whisky.category}</span>
                </li>
                {whisky.age && (
                  <li className="flex items-center text-gray-700 text-lg">
                    <span className="font-medium w-24">연수:</span>
                    <span>{whisky.age}년</span>
                  </li>
                )}
                {whisky.abv && (
                  <li className="flex items-center text-gray-700 text-lg">
                    <span className="font-medium w-24">도수:</span>
                    <span>{whisky.abv}%</span>
                  </li>
                )}
                {whisky.price && (
                  <li className="flex items-center text-gray-700 text-lg">
                    <span className="font-medium w-24">가격:</span>
                    <span>¥{whisky.price.toLocaleString()}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* 설명 */}
          {whisky.description && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">설명</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {whisky.description}
              </p>
            </section>
          )}

          {/* 테이스팅 노트 */}
          {(whisky.nose || whisky.palate || whisky.finish) && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">테이스팅 노트</h2>
              <div className="space-y-4">
                {whisky.nose && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">👃 Nose (향)</h3>
                    <p className="text-gray-700 leading-relaxed">{whisky.nose}</p>
                  </div>
                )}
                {whisky.palate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">👅 Palate (맛)</h3>
                    <p className="text-gray-700 leading-relaxed">{whisky.palate}</p>
                  </div>
                )}
                {whisky.finish && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">✨ Finish (피니시)</h3>
                    <p className="text-gray-700 leading-relaxed">{whisky.finish}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 추가 감상 */}
          {whisky.impression && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">감상</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {whisky.impression}
                </p>
              </div>
            </section>
          )}

          {/* 개인 메모 */}
          {whisky.notes && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">메모</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {whisky.notes}
              </p>
            </section>
          )}

          {/* 목록으로 버튼 */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              목록으로 돌아가기
            </Link>
          </div>

          {/* Disqus 댓글 */}
          <DisqusComments
            identifier={whisky.id}
            title={whisky.title}
            url={`https://whisky-blog-bufgix.vercel.app/whisky/${whisky.slug}`}
          />
        </article>
      </main>
    </div>
  )
}