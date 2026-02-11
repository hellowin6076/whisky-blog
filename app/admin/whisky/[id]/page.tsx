import { use } from 'react'
import WhiskyForm from '../../../_components/WhiskyForm'

export default function EditWhiskyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">위스키 수정</h1>
        <WhiskyForm whiskyId={resolvedParams.id} />
      </div>
    </div>
  )
}
