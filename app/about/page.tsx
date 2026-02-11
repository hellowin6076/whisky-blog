import Header from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">ABOUT</h1>
          <div className="w-16 h-1 bg-black mb-8 mx-auto"></div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              안녕하세요! 오사카에서 위스키 테이스팅 노트를 기록하는 블로그입니다.
            </p>
            
            <p className="text-gray-600 leading-relaxed mb-6">
              개인적으로 마신 위스키들의 솔직한 감상을 담고 있습니다.
              개발자로 일하면서 틈틈이 위스키를 즐기고, 그 기록들을 남기고 있어요.
              전문가가 아닌, 한 잔의 위스키를 사랑하는 사람의 이야기입니다.
            </p>

            <h2 className="text-xl font-bold mb-4 mt-8">📝 기록 방식</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Nose (향)</strong> - 첫 인상과 향의 특징</li>
              <li><strong>Palate (맛)</strong> - 입안에서 느껴지는 맛</li>
              <li><strong>Finish (피니시)</strong> - 여운과 뒷맛</li>
              <li><strong>Impression (감상)</strong> - 전체적인 느낌과 생각</li>
            </ul>

            <p className="text-gray-600 leading-relaxed mb-8">
              위스키에 대한 궁금한 점이나 추천은 언제든지 연락 주세요!
            </p>

            <div className="text-center pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4">CONTACT</h2>
              <a 
                href="https://github.com/hellowin6076" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
