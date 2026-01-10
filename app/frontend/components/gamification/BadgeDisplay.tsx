import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Achievement {
  id: string
  key: string
  name: string
  description: string
  icon: string
  tier: string
  category: string
  points_reward: number
  hidden: boolean
}

interface BadgeDisplayProps {
  achievement: Achievement
  unlocked: boolean
  unlockedAt?: string
  className?: string
}

export default function BadgeDisplay({
  achievement,
  unlocked,
  unlockedAt,
  className,
}: BadgeDisplayProps) {
  const tierColors = {
    bronze: 'border-amber-700 bg-amber-50 dark:bg-amber-950 dark:border-amber-600',
    silver: 'border-gray-400 bg-gray-50 dark:bg-gray-900 dark:border-gray-500',
    gold: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-600',
    platinum: 'border-purple-500 bg-purple-50 dark:bg-purple-950 dark:border-purple-600',
  }

  const tierTextColors = {
    bronze: 'text-amber-900 dark:text-amber-100',
    silver: 'text-gray-900 dark:text-gray-100',
    gold: 'text-yellow-900 dark:text-yellow-100',
    platinum: 'text-purple-900 dark:text-purple-100',
  }

  return (
    <Card
      className={cn(
        'transition-all hover:scale-105 hover:shadow-md border-2',
        unlocked ? tierColors[achievement.tier as keyof typeof tierColors] : 'opacity-50 grayscale',
        className
      )}
    >
      <CardContent className="p-4 flex flex-col items-center text-center">
        {unlocked ? (
          <span className="text-4xl mb-2" role="img" aria-label={achievement.name}>
            {achievement.icon}
          </span>
        ) : (
          <Lock className="h-10 w-10 text-muted-foreground mb-2" />
        )}
        <h3
          className={cn(
            'font-semibold mb-1',
            unlocked ? tierTextColors[achievement.tier as keyof typeof tierTextColors] : ''
          )}
        >
          {achievement.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{achievement.description}</p>
        <div className="flex items-center gap-2 mt-auto">
          <Badge
            variant={unlocked ? 'default' : 'secondary'}
            className={cn(
              'capitalize',
              unlocked ? tierTextColors[achievement.tier as keyof typeof tierTextColors] : ''
            )}
          >
            {achievement.tier}
          </Badge>
          {unlocked && achievement.points_reward > 0 && (
            <Badge variant="outline" className="text-xs">
              +{achievement.points_reward} pts
            </Badge>
          )}
        </div>
        {unlocked && unlockedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Unlocked {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
