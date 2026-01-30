import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: 'OWi - Smart Anti-Inflation Savings',
  description: 'AI-powered savings that automatically protects your money from inflation by intelligently swapping between USDT and Gold (XAUT).',
  keywords: ['web3', 'savings', 'anti-inflation', 'gold', 'XAUT', 'USDT', 'AI', 'Base'],
  authors: [{ name: 'OWi Team' }],
  openGraph: {
    title: 'OWi - Smart Anti-Inflation Savings',
    description: 'Let AI protect your savings from inflation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OWi - Smart Anti-Inflation Savings',
    description: 'Let AI protect your savings from inflation',
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: '#1a1625',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
