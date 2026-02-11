import Link from 'next/link'

interface WhiskyCardProps {
  whisky: {
    id: string
    title: string
    slug: string
    category: string
    age: number | null
    rating: number | null
    coverImage: string | null
    tags: { tag: { name: string } }[]
  }
}

export default function WhiskyCard({ whisky }: WhiskyCardProps) {
  return (
    <Link href={`/whisky/${whisky.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {/* 이미지 - 세로 비율, 여백 없이 꽉 차게 */}
        <div className="relative h-80 sm:h-96 bg-gray-100">
          {whisky.coverImage ? (
            <img
              src={whisky.coverImage}
              alt={whisky.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🥃
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {whisky.title}
          </h3>
          
          <div className="space-y-1 mb-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">카테고리:</span> {whisky.category}
            </p>
            {whisky.age && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">연수:</span> {whisky.age}년
              </p>
            )}
          </div>

          {whisky.rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              {'⭐'.repeat(Math.round(whisky.rating))}
              <span className="text-sm text-gray-600 ml-1">
                {whisky.rating.toFixed(1)}
              </span>
            </div>
          )}

          {whisky.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {whisky.tags.slice(0, 3).map((wt) => (
                <span
                  key={wt.tag.name}
                  className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs"
                >
                  #{wt.tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}