import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ChatProvider } from '@/context/ChatContext'
import PageTransition from '@/components/PageTransition'

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
        <ErrorBoundary>
          <ThemeProvider>
            <ChatProvider>
              <PageTransition>
                {children}
              </PageTransition>
            </ChatProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}