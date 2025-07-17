import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TasteTrip AI - Your Cultural Discovery Assistant',
  description: 'Discover personalized cultural recommendations across food, travel, music, and more with AI-powered taste intelligence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="">
      <body className={`${inter.className} m-0 p-0 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}