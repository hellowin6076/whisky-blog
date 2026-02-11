'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Whisky { id: string; title: string; category: string; rating: number | null; createdAt: string }

export default function AdminPage() {
  const [whiskies, setWhiskies] = useState<Whisky[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchWhiskies() }, [])

  const fetchWhiskies = async () => {
    try { const res = await fetch('/api/whiskies'); const data = await res.json(); setWhiskies(data) } catch (error) { console.error('Failed to fetch:', error) } finally { setLoading(false) }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}"을(를) 삭제하시겠습니까?`)) return
    try { const res = await fetch(`/api/whiskies/${id}`, { method: 'DELETE' }); if (res.ok) { alert('삭제되었습니다.'); fetchWhiskies() } else { alert('삭제 실패') } } catch (error) { console.error('Delete error:', error); alert('오류 발생') }
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">위스키 관리</h1>
          <div className="flex gap-2">
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">사이트 보기</Link>
            <Link href="/admin/whisky/new" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">+ 새 위스키</Link>
          </div>
        </div>
        {loading ? <p className="text-center py-12 text-gray-500">로딩 중...</p> : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">평점</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {whiskies.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{w.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{w.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{w.rating ? `⭐ ${w.rating.toFixed(1)}` : '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium space-x-3">
                      <Link href={`/whisky/${w.id}`} className="text-amber-600 hover:text-amber-900" target="_blank">보기</Link>
                      <Link href={`/admin/whisky/${w.id}`} className="text-blue-600 hover:text-blue-900">수정</Link>
                      <button onClick={() => handleDelete(w.id, w.title)} className="text-red-600 hover:text-red-900">삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && whiskies.length === 0 && <p className="text-center py-12 text-gray-500">위스키가 없습니다.</p>}
      </div>
    </div>
  )
}
