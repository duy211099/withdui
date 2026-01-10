import { cn } from '@/lib/utils'

interface ProgressBarProps {
  current: number
  max: number
  label?: string
  showPercentage?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

export default function ProgressBar({
  current,
  max,
  label,
  showPercentage = true,
  color = 'primary',
  className,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100)

  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-muted-foreground">{label}</span>
          {showPercentage && <span className="font-medium">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div
          className={cn(
            'h-2.5 rounded-full transition-all duration-300 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
