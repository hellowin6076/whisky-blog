'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '@/components/Header'
import WhiskyCard from '@/components/WhiskyCard'

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

const ITEMS_PER_PAGE = 12

export default function BlogPage() {
  const [whiskies, setWhiskies] = useState<Whisky[]>([])
  const [filteredWhiskies, setFilteredWhiskies] = useState<Whisky[]>([])
  const [displayedWhiskies, setDisplayedWhiskies] = useState<Whisky[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // 필터 섹션 열림/닫힘 상태 (기본값: 닫힘)
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)
  const [showRatingFilter, setShowRatingFilter] = useState(false)
  const [showTagFilter, setShowTagFilter] = useState(false)

  const observer = useRef<IntersectionObserver>()
  const lastWhiskyRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  useEffect(() => {
    async function fetchWhiskies() {
      setLoading(true)
      const res = await fetch('/api/whiskies', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setWhiskies(data)
        setFilteredWhiskies(data)
      }
      setLoading(false)
    }
    fetchWhiskies()
  }, [])

  // 카테고리와 태그 추출
  const categories = Array.from(new Set(whiskies.map(w => w.category).filter(Boolean))) as string[]
  const allTags = Array.from(
    new Set(whiskies.flatMap(w => w.tags.map(t => t.tag.name)))
  )

  const getCategoryCount = (category: string) => {
    return whiskies.filter(w => w.category === category).length
  }

  const getRatingCount = (rating: number) => {
    return whiskies.filter(w => w.rating && Math.round(w.rating) === rating).length
  }

  const getTagCount = (tag: string) => {
    return whiskies.filter(w => w.tags.some(t => t.tag.name === tag)).length
  }

  // 필터링
  useEffect(() => {
    let filtered = whiskies

    if (selectedCategory) {
      filtered = filtered.filter(w => w.category === selectedCategory)
    }

    if (selectedRating) {
      filtered = filtered.filter(w => w.rating && Math.round(w.rating) === selectedRating)
    }

    if (selectedTag) {
      filtered = filtered.filter(w => w.tags.some(t => t.tag.name === selectedTag))
    }

    setFilteredWhiskies(filtered)
    setPage(1) // 필터 변경 시 첫 페이지로
    setDisplayedWhiskies([])
  }, [selectedCategory, selectedRating, selectedTag, whiskies])

  // 페이징 (무한 스크롤)
  useEffect(() => {
    const startIndex = 0
    const endIndex = page * ITEMS_PER_PAGE
    const newDisplayed = filteredWhiskies.slice(startIndex, endIndex)
    
    setDisplayedWhiskies(newDisplayed)
    setHasMore(endIndex < filteredWhiskies.length)
  }, [page, filteredWhiskies])

  const activeFilterCount = [selectedCategory, selectedRating, selectedTag].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 tracking-wide">
          ALL WHISKIES
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 lg:sticky lg:top-20">
              
              {/* 카테고리 필터 */}
              <div className="mb-6">
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="w-full flex items-center justify-between font-bold text-lg mb-3 text-gray-900"
                >
                  <span>카테고리</span>
                  <span className="text-xl">{showCategoryFilter ? '▲' : '▼'}</span>
                </button>
                
                {showCategoryFilter && (
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded transition ${
                          selectedCategory === null
                            ? 'bg-amber-50 text-amber-600 font-medium'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        전체 ({whiskies.length})
                      </button>
                    </li>
                    {categories.map(category => (
                      <li key={category}>
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded transition ${
                            selectedCategory === category
                              ? 'bg-amber-50 text-amber-600 font-medium'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {category} ({getCategoryCount(category)})
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 평점 필터 */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button
                  onClick={() => setShowRatingFilter(!showRatingFilter)}
                  className="w-full flex items-center justify-between font-bold text-lg mb-3 text-gray-900"
                >
                  <span>평점</span>
                  <span className="text-xl">{showRatingFilter ? '▲' : '▼'}</span>
                </button>
                
                {showRatingFilter && (
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setSelectedRating(null)}
                        className={`w-full text-left px-3 py-2 rounded transition ${
                          selectedRating === null
                            ? 'bg-amber-50 text-amber-600 font-medium'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        전체
                      </button>
                    </li>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <li key={rating}>
                        <button
                          onClick={() => setSelectedRating(rating)}
                          className={`w-full text-left px-3 py-2 rounded transition flex items-center justify-between ${
                            selectedRating === rating
                              ? 'bg-amber-50 text-amber-600 font-medium'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-yellow-500">{'⭐'.repeat(rating)}</span>
                          </span>
                          <span className="text-sm text-gray-500">({getRatingCount(rating)})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 태그 필터 */}
              <div className="mb-6">
                <button
                  onClick={() => setShowTagFilter(!showTagFilter)}
                  className="w-full flex items-center justify-between font-bold text-lg mb-3 text-gray-900"
                >
                  <span>태그</span>
                  <span className="text-xl">{showTagFilter ? '▲' : '▼'}</span>
                </button>
                
                {showTagFilter && (
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className={`px-3 py-1 rounded-full text-sm transition ${
                          selectedTag === tag
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        #{tag} ({getTagCount(tag)})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 필터 초기화 */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedRating(null)
                    setSelectedTag(null)
                  }}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
                >
                  필터 초기화 ({activeFilterCount})
                </button>
              )}
            </div>
          </aside>

          {/* Whisky Grid */}
          <div className="flex-1">
            {displayedWhiskies.length === 0 && !loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {whiskies.length === 0 ? '아직 위스키가 없습니다.' : '조건에 맞는 위스키가 없습니다.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedWhiskies.map((whisky, index) => {
                    if (displayedWhiskies.length === index + 1) {
                      return (
                        <div ref={lastWhiskyRef} key={whisky.id}>
                          <WhiskyCard whisky={whisky} />
                        </div>
                      )
                    } else {
                      return <WhiskyCard key={whisky.id} whisky={whisky} />
                    }
                  })}
                </div>
                
                {/* 로딩 인디케이터 */}
                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  </div>
                )}
                
                {/* 마지막 페이지 */}
                {!hasMore && displayedWhiskies.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">모든 위스키를 불러왔습니다.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}