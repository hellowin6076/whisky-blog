import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LuvWhisky - 위스키 테이스팅 노트',
  description: '개인 위스키 컬렉션 및 테이스팅 노트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
