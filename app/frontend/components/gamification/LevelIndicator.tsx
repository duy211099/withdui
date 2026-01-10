import { Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/contexts/I18nContext'
import { cn } from '@/lib/utils'
import ProgressBar from './ProgressBar'

interface LevelIndicatorProps {
  level: number
  currentPoints: number
  pointsToNextLevel: number
  progressPercentage: number
  className?: string
}

export default function LevelIndicator({
  level,
  currentPoints,
  pointsToNextLevel,
  progressPercentage,
  className,
}: LevelIndicatorProps) {
  const { t, locale } = useI18n()
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">
              {t('frontend.gamification.level.title', { level })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('frontend.gamification.level.total_points', {
                points: currentPoints.toLocaleString(locale),
              })}
            </p>
          </div>
        </div>
        <ProgressBar
          current={progressPercentage}
          max={100}
          label={
            pointsToNextLevel > 0
              ? t('frontend.gamification.level.points_to_next', {
                  points: pointsToNextLevel.toLocaleString(locale),
                  level: level + 1,
                })
              : t('frontend.gamification.level.max_level')
          }
          color="primary"
        />
      </CardContent>
    </Card>
  )
}
