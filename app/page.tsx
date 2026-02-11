import Link from 'next/link'
import Header from '@/components/Header'
import WhiskyCard from '@/components/WhiskyCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getWhiskies() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/whiskies`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

interface Whisky {
  id: string
  title: string
  slug: string
  coverImage: string | null
  category: string
  age: number | null
  rating: number | null
  createdAt: string
  tags: { tag: { name: string } }[]
}

export default async function HomePage() {
  const whiskies: Whisky[] = await getWhiskies()
  const recentWhiskies = whiskies.slice(0, 6) // 최신 6개만

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-amber-100 to-orange-100 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              🥃
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700">LuvWhisky</p>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 tracking-wide">
          RECENT WHISKIES
        </h2>
        
        {recentWhiskies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">아직 위스키가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {recentWhiskies.map((whisky) => (
              <WhiskyCard key={whisky.id} whisky={whisky} />
            ))}
          </div>
        )}

        {/* All Posts Button */}
        {whiskies.length > 6 && (
          <div className="text-center mt-10 sm:mt-12">
            <Link
              href="/blog"
              className="inline-block bg-black text-white px-8 sm:px-10 py-2.5 sm:py-3 hover:bg-gray-800 transition-colors duration-300 font-semibold tracking-wide text-sm sm:text-base"
            >
              All Posts
            </Link>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-white py-12 sm:py-16 mt-12 sm:mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">ABOUT</h3>
          <div className="w-16 h-1 bg-black mb-6 mx-auto"></div>
          <p className="text-gray-600 leading-relaxed mb-6 max-w-xl mx-auto text-sm sm:text-base">
            오사카에서 위스키 테이스팅 노트를 기록하는 블로그입니다.
            개인적으로 마신 위스키들의 솔직한 감상을 담고 있습니다.
          </p>
          
          {/* GitHub Link */}
          <a 
            href="https://github.com/hellowin6076" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-sm sm:text-base">GitHub</span>
          </a>
        </div>
      </section>
    </div>
  )
}
