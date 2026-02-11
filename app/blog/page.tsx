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
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false) // 모바일 필터 토글

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

    if (selectedTag) {
      filtered = filtered.filter(w => w.tags.some(t => t.tag.name === selectedTag))
    }

    setFilteredWhiskies(filtered)
  }, [selectedCategory, selectedTag, whiskies])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 tracking-wide">
          ALL WHISKIES
        </h1>

        {/* 모바일 필터 토글 버튼 */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-3 font-medium"
          >
            <span className="flex items-center gap-2">
              🔍 필터
              {(selectedCategory || selectedTag) && (
                <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                  {[selectedCategory, selectedTag].filter(Boolean).length}
                </span>
              )}
            </span>
            <span className="text-xl">{showFilters ? '▲' : '▼'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">카테고리</h3>
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
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-bold text-lg mb-4">태그</h3>
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
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedTag) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedTag(null)
                  }}
                  className="w-full mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
                >
                  필터 초기화
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