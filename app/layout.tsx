import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { TestModeProvider } from '@/context/TestModeContext'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: '積罪 - GuiltyStack',
  description: '積みコンテンツを断罪するアプリ。後悔スコアで容赦なく裁かれろ。',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '積罪',
  },
  openGraph: {
    title: '積罪 - GuiltyStack',
    description: '積みコンテンツを断罪するアプリ。後悔スコアで容赦なく裁かれろ。',
    url: 'https://guilty-stack.vercel.app',
    siteName: 'GuiltyStack',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '積罪 - GuiltyStack',
    description: '積みコンテンツを断罪するアプリ。後悔スコアで容赦なく裁かれろ。',
  },
}

export const viewport: Viewport = {
  themeColor: '#dc2626',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 text-gray-900">
        <TestModeProvider>
          <AuthProvider>{children}</AuthProvider>
        </TestModeProvider>
      </body>
    </html>
  )
}
