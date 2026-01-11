import { Head } from '@inertiajs/react'
import { Award, Target, Trophy, Zap } from 'lucide-react'
import BadgeDisplay from '@/components/gamification/BadgeDisplay'
import LevelIndicator from '@/components/gamification/LevelIndicator'
import StreakCounter from '@/components/gamification/StreakCounter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/contexts/I18nContext'
import type { BasePageProps, UserStats } from '@/types'
import type { Achievement, GamificationEvent, UserAchievement } from '@/types/serializers'

interface DashboardProps extends BasePageProps {
  stats: UserStats
  unlocked_achievements: UserAchievement[]
  available_achievements: Achievement[]
  recent_events: GamificationEvent[]
}

export default function Dashboard({
  stats,
  unlocked_achievements,
  available_achievements,
  recent_events,
}: DashboardProps) {
  const { t, locale } = useI18n()
  const formatEventType = (eventType?: string) => {
    if (!eventType) return t('frontend.gamification.events.unknown', { defaultValue: 'Unknown' })

    return t(`frontend.gamification.events.${eventType}`, {
      defaultValue: eventType.replace(/_/g, ' '),
    })
  }

  console.log(stats)

  return (
    <>
      <Head title={t('frontend.gamification.dashboard.title')} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">{t('frontend.gamification.dashboard.heading')}</h1>
        </div>

        {/* Level & Streaks Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <LevelIndicator
              className="h-full"
              level={stats.currentLevel}
              currentPoints={stats.totalPoints}
              pointsToNextLevel={stats.pointsToNextLevel}
              progressPercentage={stats.levelProgress}
            />
          </div>
          <div className="space-y-4">
            <StreakCounter
              currentStreak={stats.currentMoodStreak}
              longestStreak={stats.longestMoodStreak}
              type="mood"
              label={t('frontend.gamification.dashboard.mood_streak_label')}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('frontend.gamification.dashboard.quick_stats.moods_logged')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMoodsLogged}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('frontend.gamification.dashboard.quick_stats.posts_written')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPostsWritten}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('frontend.gamification.dashboard.quick_stats.great_moods')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGreatMoods}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('frontend.gamification.dashboard.quick_stats.events_attended')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEventsAttended}</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Tabs defaultValue="unlocked" className="mb-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="unlocked" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              {t('frontend.gamification.dashboard.tabs.unlocked', {
                count: unlocked_achievements.length,
              })}
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('frontend.gamification.dashboard.tabs.available', {
                count: available_achievements.length,
              })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="mt-6">
            {unlocked_achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {unlocked_achievements.map((ua) => (
                  <BadgeDisplay
                    key={ua.achievement.id}
                    achievement={ua.achievement}
                    unlocked={true}
                    unlockedAt={ua.unlocked_at}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t('frontend.gamification.dashboard.tabs.empty')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {available_achievements.map((achievement) => (
                <BadgeDisplay key={achievement.id} achievement={achievement} unlocked={false} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t('frontend.gamification.dashboard.recent_activity.title')}
            </CardTitle>
            <CardDescription>
              {t('frontend.gamification.dashboard.recent_activity.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recent_events.length > 0 ? (
              <div className="space-y-2">
                {recent_events.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <span className="text-sm capitalize">{formatEventType(event.eventType)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.createdAt).toLocaleDateString(locale)}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {t('frontend.gamification.dashboard.recent_activity.points', {
                          points: event.pointsEarned.toLocaleString(locale),
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {t('frontend.gamification.dashboard.recent_activity.none')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
