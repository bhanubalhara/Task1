import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'Shorten your URLs and track clicks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

