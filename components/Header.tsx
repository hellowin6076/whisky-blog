import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            🥃 LuvWhisky
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              HOME
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900">
              BLOG
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              ABOUT
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
