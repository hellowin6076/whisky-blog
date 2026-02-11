'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'

interface WhiskyFormProps {
  whiskyId?: string
}

// 위스키 타입 옵션
const TYPES = [
  '싱글몰트',
  '블렌디드',
  '버번',
  '라이',
  '아이리시',
  '재패니즈',
  '아메리칸',
  '기타',
]

export default function WhiskyForm({ whiskyId }: WhiskyFormProps) {
  const router = useRouter()
  const isEditMode = !!whiskyId

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [title, setTitle] = useState('')
  const [distillery, setDistillery] = useState('')
  const [type, setType] = useState('싱글몰트')
  const [age, setAge] = useState('')
  const [abv, setAbv] = useState('')
  const [rating, setRating] = useState(0)
  const [coverImage, setCoverImage] = useState('')
  
  const [nose, setNose] = useState('')
  const [palate, setPalate] = useState('')
  const [finish, setFinish] = useState('')
  const [impression, setImpression] = useState('')
  
  const [price, setPrice] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (isEditMode && whiskyId) {
      setFetching(true)
      fetch(`/api/whiskies/${whiskyId}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title)
          setDistillery(data.distillery || '')
          setType(data.type)
          setAge(data.age?.toString() || '')
          setAbv(data.abv?.toString() || '')
          setRating(data.rating || 0)
          setCoverImage(data.coverImage || '')
          setNose(data.nose || '')
          setPalate(data.palate || '')
          setFinish(data.finish || '')
          setImpression(data.impression || '')
          setPrice(data.price?.toString() || '')
          setPurchaseDate(data.purchaseDate ? data.purchaseDate.split('T')[0] : '')
          setDescription(data.description || '')
          setNotes(data.notes || '')
          setTags(data.tags.map((wt: any) => wt.tag.name))
        })
        .catch((error) => {
          console.error('Failed to fetch whisky:', error)
          alert('위스키를 불러오는데 실패했습니다.')
        })
        .finally(() => setFetching(false))
    }
  }, [isEditMode, whiskyId])

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/jpeg',
      }

      console.log('원본 크기:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      const compressedFile = await imageCompression(file, options)
      console.log('압축 후 크기:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB')

      const formData = new FormData()
      formData.append('file', compressedFile)

      if (coverImage) {
        formData.append('oldUrl', coverImage)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        setCoverImage(data.url)
        alert('이미지 업로드 완료!')
      } else {
        alert('업로드 실패')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('업로드 오류')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const url = isEditMode ? `/api/whiskies/${whiskyId}` : '/api/whiskies'
    const method = isEditMode ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          distillery: distillery || null,
          type,
          age: age || null,
          abv: abv || null,
          rating: rating || null,
          coverImage: coverImage || null,
          nose: nose || null,
          palate: palate || null,
          finish: finish || null,
          impression: impression || null,
          price: price || null,
          purchaseDate: purchaseDate || null,
          description: description || null,
          notes: notes || null,
          tags,
        }),
      })

      if (response.ok) {
        alert(isEditMode ? '위스키가 수정되었습니다!' : '위스키가 저장되었습니다!')
        router.push('/admin')
      } else {
        alert('저장 실패')
      }
    } catch (error) {
      console.error(error)
      alert('오류 발생')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-center py-12 text-gray-600">로딩 중...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-6 pb-8">
      {/* 이름 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          이름 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          placeholder="탈리스커 10년"
        />
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            증류소
          </label>
          <input
            type="text"
            value={distillery}
            onChange={(e) => setDistillery(e.target.value)}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
            placeholder="Talisker"
          />
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            타입 *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            연수 (년)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
            placeholder="10"
          />
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            도수 (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
            placeholder="45.8"
          />
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            가격 (¥)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
            placeholder="4000"
          />
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            구매일
          </label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          />
        </div>
      </div>

      {/* 평점 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          평점
        </label>
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setRating(level)}
              className={`text-3xl transition ${
                level <= rating ? 'opacity-100' : 'opacity-30'
              } hover:opacity-100`}
            >
              ⭐
            </button>
          ))}
          <span className="text-sm text-gray-600 ml-2">
            ({rating > 0 ? `${rating}.0` : '미평가'})
          </span>
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          이미지
        </label>
        <div className="mb-3 md:mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:text-sm"
          />
          {uploading && <p className="text-sm text-gray-500 mt-2">업로드 중...</p>}
        </div>
        <div>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
            placeholder="또는 URL 직접 입력"
          />
        </div>
        {coverImage && (
          <div className="mt-3 md:mt-2">
            <img src={coverImage} alt="미리보기" className="w-full md:w-48 rounded-lg" />
          </div>
        )}
      </div>

      {/* 설명 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          placeholder="위스키에 대한 전반적인 설명"
        />
      </div>

      {/* 테이스팅 노트 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">테이스팅 노트</h3>
        
        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            👃 Nose (향)
          </label>
          <textarea
            value={nose}
            onChange={(e) => setNose(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            👅 Palate (맛)
          </label>
          <textarea
            value={palate}
            onChange={(e) => setPalate(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
            ✨ Finish (피니시)
          </label>
          <textarea
            value={finish}
            onChange={(e) => setFinish(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          />
        </div>
      </div>

      {/* 추가 감상 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          감상
        </label>
        <textarea
          value={impression}
          onChange={(e) => setImpression(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          placeholder="전체적인 감상이나 인상"
        />
      </div>

      {/* 메모 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          메모
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          placeholder="기타 메모"
        />
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">태그</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            className="flex-1 px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
            placeholder="태그 입력 후 엔터"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-6 md:px-4 py-3 md:py-2 bg-amber-500 text-white rounded-lg text-base md:text-sm font-medium hover:bg-amber-600"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 md:mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-2 md:py-1 bg-gray-200 text-gray-900 rounded-full text-base md:text-sm flex items-center gap-2"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-red-500 hover:text-red-700 text-xl md:text-lg font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 제출 */}
      <div className="space-y-3 md:space-y-0 md:flex md:gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:flex-1 px-6 py-4 md:py-3 bg-amber-600 text-white rounded-lg text-lg md:text-base font-bold disabled:bg-gray-400 hover:bg-amber-700"
        >
          {loading ? '저장 중...' : isEditMode ? '수정하기' : '저장 및 공개하기'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="w-full md:w-auto px-6 py-4 md:py-3 bg-gray-200 text-gray-900 rounded-lg text-lg md:text-base font-medium hover:bg-gray-300"
        >
          취소
        </button>
      </div>
    </form>
  )
}
