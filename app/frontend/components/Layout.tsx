import { ReactNode } from 'react'
import Flash from '@/components/Flash'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Flash />
      {children}
    </>
  )
}
