import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="en">
      <body className={`${poppins.className} m-0 p-0 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}