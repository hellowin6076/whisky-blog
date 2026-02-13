'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  order: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editOrder, setEditOrder] = useState(0)
  const [newName, setNewName] = useState('')
  const [newOrder, setNewOrder] = useState(0)

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async () => {
    if (!newName.trim()) {
      alert('카테고리 이름을 입력하세요')
      return
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, order: newOrder }),
      })

      if (res.ok) {
        alert('카테고리가 추가되었습니다')
        setNewName('')
        setNewOrder(categories.length)
        fetchCategories()
      } else {
        const data = await res.json()
        alert(data.error || '추가 실패')
      }
    } catch (error) {
      console.error('Failed to create category:', error)
      alert('추가 실패')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, order: editOrder }),
      })

      if (res.ok) {
        alert('카테고리가 수정되었습니다')
        setEditingId(null)
        fetchCategories()
      } else {
        const data = await res.json()
        alert(data.error || '수정 실패')
      }
    } catch (error) {
      console.error('Failed to update category:', error)
      alert('수정 실패')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('카테고리가 삭제되었습니다')
        fetchCategories()
      } else {
        const data = await res.json()
        alert(data.error || '삭제 실패')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('삭제 실패')
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditOrder(category.order)
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-600">로딩 중...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">카테고리 관리</h1>

      {/* 새 카테고리 추가 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">새 카테고리 추가</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="카테고리 이름"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <input
            type="number"
            value={newOrder}
            onChange={(e) => setNewOrder(parseInt(e.target.value))}
            placeholder="순서"
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          />
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
          >
            추가
          </button>
        </div>
      </div>

      {/* 카테고리 목록 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">순서</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">이름</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                {editingId === category.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleUpdate(category.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">{category.order}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        삭제
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
