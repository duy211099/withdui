import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import Flash from '@/components/Flash'
import { Toaster } from '@/components/ui/sonner'
import Header from '@/components/Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <Flash />
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </ThemeProvider>
  )
}
