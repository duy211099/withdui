import { Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/contexts/I18nContext'
import { cn } from '@/lib/utils'

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
  type: 'mood' | 'writing'
  label: string
  className?: string
}

export default function StreakCounter({
  currentStreak,
  longestStreak,
  type: _type,
  label,
  className,
}: StreakCounterProps) {
  const { t, locale } = useI18n()
  const isActive = currentStreak > 0
  const flameCount = Math.min(currentStreak, 7)
  const flames = Array.from({ length: flameCount }, (_, i) => ({
    id: `streak-flame-${i}-of-${flameCount}`,
    delay: i * 0.05,
  }))
  const dayLabel = t('frontend.gamification.streak.day', { count: currentStreak })
  const bestLabel = t('frontend.gamification.streak.best', { count: longestStreak })

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Flame
            className={cn(
              'transition-colors',
              isActive ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'
            )}
            size={20}
          />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              'text-3xl font-bold',
              isActive ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {currentStreak.toLocaleString(locale)}
          </span>
          <span className="text-sm text-muted-foreground">{dayLabel}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{bestLabel}</p>
        {currentStreak > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-1">
              {flames.map((flame) => (
                <div
                  key={flame.id}
                  className="w-1.5 h-6 bg-orange-500 rounded-full animate-grow"
                  style={{ animationDelay: `${flame.delay}s` }}
                />
              ))}
              {currentStreak > 7 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{(currentStreak - 7).toLocaleString(locale)}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
