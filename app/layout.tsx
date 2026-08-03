import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { baseUrl } from './sitemap'
import { Navbar } from './components/nav'
import { ScrollEffects } from '@/app/components/scroll-effects'
import { cn } from './helpers'
import { ScrollPrompt } from './components/scroll-prompt'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'kale',
    template: '%s | kale',
  },
  description: 'why you stalkin',
  openGraph: {
    title: 'kale',
    description: 'why you stalkin',
    url: baseUrl,
    siteName: 'kale port',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        'text-black bg-white overflow-hidden h-full',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased h-full overflow-hidden">
        <Navbar />
        <ScrollEffects />
        <ScrollPrompt />
        <main className={cn(
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
