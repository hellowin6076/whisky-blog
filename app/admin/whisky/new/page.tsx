import WhiskyForm from '../../_components/WhiskyForm'

export default function NewWhiskyPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">새 위스키 추가</h1>
        <WhiskyForm />
      </div>
    </div>
  )
}
