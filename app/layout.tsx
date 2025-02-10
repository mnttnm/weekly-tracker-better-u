import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BetterU Weekly Tracker 2025',
  description: 'A tool to help you track your progress and your betterment journey',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
