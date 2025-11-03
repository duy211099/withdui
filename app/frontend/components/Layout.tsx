import { ReactNode } from 'react'
// import { ThemeProvider } from 'next-themes'
import Flash from '@/components/Flash'
import { Toaster } from '@/components/ui/sonner'
import { Button } from './ui/button'
import { toast } from 'sonner'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Toaster />
      <Flash />
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      />
      <Button
        variant="outline"
        onClick={() =>
          toast.error("message")
        }
      >
        Show Toast
      </Button>
      {children}
    </>
  )
}
