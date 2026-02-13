import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: {
    default: 'LuvWhisky - 위스키 테이스팅 노트',
    template: '%s | LuvWhisky'
  },
  description: '오사카에서 기록하는 위스키 테이스팅 노트와 컬렉션. 싱글몰트, 블렌디드, 버번 등 다양한 위스키의 솔직한 감상.',
  keywords: ['위스키', '테이스팅', '노트', '싱글몰트', '블렌디드', '버번', '스카치', '위스키 리뷰', '글렌케언', 'whisky'],
  authors: [{ name: 'bufgix' }],
  creator: 'bufgix',
  publisher: 'bufgix',
  metadataBase: new URL('https://whisky-blog-bufgix.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LuvWhisky - 위스키 테이스팅 노트',
    description: '오사카에서 기록하는 위스키 테이스팅 노트와 컬렉션',
    url: 'https://whisky-blog-bufgix.vercel.app',
    siteName: 'LuvWhisky',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LuvWhisky',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuvWhisky - 위스키 테이스팅 노트',
    description: '오사카에서 기록하는 위스키 테이스팅 노트와 컬렉션',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Iwb0bx5O6TMuXbAuEcYsFCoCDXEzZqBvxHIMDDcAxws',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {children}
      </body>
    </html>
  )
}