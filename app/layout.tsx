import './global.css'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { baseUrl } from './sitemap'
import { Navbar } from './components/nav'
import { ScrollEffects } from '@/app/components/scroll-effects'
import { ScrollPrompt } from './components/scroll-prompt'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Michael Zhang Portfolio',
    template: '%s | Michael Zhang Portfolio',
  },
  description: 'Personal portfolio site.',
  openGraph: {
    title: 'Michael Zhang Portfolio',
    description: 'Personal portfolio site.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website',
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
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white overflow-hidden h-full',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased h-full overflow-hidden">
        <Navbar />
        <ScrollEffects />
        <ScrollPrompt />
        <main className={cx(
          "flex flex-col snap-y snap-mandatory overflow-y-scroll items-center justify-start gap-0 min-w-0 h-screen w-full",
          "bg-[linear-gradient(200deg,#946D44_20%,#D9C19D_84%)]"
        )}>
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
