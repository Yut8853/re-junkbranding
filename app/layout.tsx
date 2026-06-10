import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { LenisProvider } from '@/components/lenis-provider'
import './globals.css'

export const metadata: Metadata = {
  title: '伝わる Web | 体験で魅力を伝えるWebサイト制作',
  description:
    '普通のホームページでは伝わりきらない魅力を、3D・アニメーション・インタラクションで「体験として伝わるWebサイト」にします。',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#f7f4ee',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="bg-background">
      <body className="font-sans antialiased">
        <LenisProvider />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
