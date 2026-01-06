import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import Flash from '@/components/Flash'
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/sonner'
import { I18nProvider } from '@/contexts/I18nContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <I18nProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster />
        <Flash />
        <Header />
        <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </main>
      </ThemeProvider>
    </I18nProvider>
  )
}
