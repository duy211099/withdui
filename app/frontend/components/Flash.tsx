import { usePage } from '@inertiajs/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type FlashType = 'notice' | 'alert' | 'error' | 'success' | 'info'

interface FlashMessages {
  notice?: string
  alert?: string
  error?: string
  success?: string
  info?: string
}

const flashConfig: Record<FlashType, {
  variant: 'default' | 'destructive'
  icon: typeof CheckCircle2
  title: string
}> = {
  success: {
    variant: 'default',
    icon: CheckCircle2,
    title: 'Success'
  },
  notice: {
    variant: 'default',
    icon: Info,
    title: 'Notice'
  },
  info: {
    variant: 'default',
    icon: Info,
    title: 'Info'
  },
  alert: {
    variant: 'destructive',
    icon: AlertCircle,
    title: 'Alert'
  },
  error: {
    variant: 'destructive',
    icon: XCircle,
    title: 'Error'
  }
}

export default function Flash() {
  const { flash } = usePage<{ flash: FlashMessages }>().props
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
    if (flash && Object.keys(flash).length > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [flash])

  if (!flash || Object.keys(flash).length === 0 || !visible) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      {Object.entries(flash).map(([type, message]) => {
        if (!message) return null

        const config = flashConfig[type as FlashType]
        const Icon = config.icon

        return (
          <Alert key={type} variant={config.variant} className="shadow-lg">
            <Icon className="h-4 w-4" />
            <AlertTitle>{config.title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}
