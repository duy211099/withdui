import { usePage } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface FlashMessages {
  notice?: string
  alert?: string
  error?: string
  success?: string
  info?: string
}

const hasFlashMessages = (flash: FlashMessages | undefined): boolean => {
  return flash !== undefined && Object.keys(flash).length > 0
}

export default function Flash() {
  const { flash } = usePage<{ flash: FlashMessages }>().props
  const previousFlashRef = useRef<FlashMessages>({})
  const [mounted, setMounted] = useState(false)

  // Wait for component to mount before showing toasts
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !hasFlashMessages(flash)) {
      return
    }

    // Add a small delay to ensure Toaster is ready
    const timer = setTimeout(() => {
      // Only show toasts for new flash messages (avoid duplicates on re-renders)
      Object.entries(flash).forEach(([type, message]) => {
        if (!message || previousFlashRef.current[type as keyof FlashMessages] === message) {
          return
        }

        switch (type) {
          case 'success':
            toast.success(message)
            break
          case 'error':
            toast.error(message)
            break
          case 'alert':
            toast.error(message)
            break
          case 'info':
            toast.info(message)
            break
          case 'notice':
            toast.info(message)
            break
        }
      })

      previousFlashRef.current = flash
    }, 100)

    return () => clearTimeout(timer)
  }, [flash, mounted])

  return null
}
