'use client'

import { useState, useEffect } from 'react'
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

export default function BlogPage() {
  const [whiskies, setWhiskies] = useState<Whisky[]>([])
  const [filteredWhiskies, setFilteredWhiskies] = useState<Whisky[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // 필터 섹션 열림/닫힘 상태
  const [showCategoryFilter, setShowCategoryFilter] = useState(true) // 웹: 기본 열림
  const [showRatingFilter, setShowRatingFilter] = useState(true)
  const [showTagFilter, setShowTagFilter] = useState(true)

  useEffect(() => {
    async function fetchWhiskies() {
      const res = await fetch('/api/whiskies', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setWhiskies(data)
        setFilteredWhiskies(data)
      }
    }
    fetchWhiskies()
  }, [])

  // 카테고리와 태그 추출
  const categories = Array.from(new Set(whiskies.map(w => w.category).filter(Boolean))) as string[]
  const allTags = Array.from(
    new Set(whiskies.flatMap(w => w.tags.map(t => t.tag.name)))
  )

  // 카테고리별 개수
  const getCategoryCount = (category: string) => {
    return whiskies.filter(w => w.category === category).length
  }

  // 평점별 개수
  const getRatingCount = (rating: number) => {
    return whiskies.filter(w => w.rating && Math.round(w.rating) === rating).length
  }

  // 태그별 개수
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
  }, [selectedCategory, selectedRating, selectedTag, whiskies])

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
            {filteredWhiskies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {whiskies.length === 0 ? '아직 위스키가 없습니다.' : '조건에 맞는 위스키가 없습니다.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWhiskies.map((whisky) => (
                  <WhiskyCard key={whisky.id} whisky={whisky} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}