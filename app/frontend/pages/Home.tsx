import { Head, Link, router, usePage } from '@inertiajs/react'
import { lazy, Suspense, useState } from 'react'
import StreakCounter from '@/components/gamification/StreakCounter'
import MoodCalendar from '@/components/MoodCalendar'
import MultiMoodModal from '@/components/MultiMoodModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/contexts/I18nContext'
import { gamification_dashboard_path, moods_path, note_index_path } from '@/lib/routes'
import type { BasePageProps, Mood, MoodLevels, PostListItem, UserStats } from '@/types'

// Lazy load NoteGraphView to keep force-graph library in a separate chunk
const NoteGraphView = lazy(() => import('@/components/NoteGraphView'))

interface HomePageProps extends BasePageProps {
  posts: PostListItem[]
  moods?: Mood[]
  year?: number
  month?: number
  moodLevels?: MoodLevels
}

export default function Home() {
  const { currentUser, moods, year, month, moodLevels, posts, userStats } = usePage<
    HomePageProps & { userStats?: UserStats }
  >().props
  const { t } = useTranslation()
  const [selectedDayMoods, setSelectedDayMoods] = useState<Mood[]>([])
  const [isMultiMoodModalOpen, setIsMultiMoodModalOpen] = useState(false)

  // Handle month navigation
  const handleMonthChange = (newYear: number, newMonth: number) => {
    router.visit('/', {
      data: { year: newYear, month: newMonth },
      preserveScroll: true,
    })
  }

  // Handle day click - show all users' moods
  const handleDayClick = (day: number, dayMoods: Mood[]) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    // If there are no moods for this day, let user create one
    if (dayMoods.length === 0) {
      if (currentUser) {
        router.visit(`/moods/new?date=${date}`)
      }
      return
    }

    // Show all users' moods for this day
    setSelectedDayMoods(dayMoods)
    setIsMultiMoodModalOpen(true)
  }

  return (
    <>
      <Head title={t('frontend.home.title')} />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="w-full mb-6 hover:translate-x-0 hover:translate-y-0">
            <CardHeader>
              <CardTitle>{t('frontend.home.welcome')}</CardTitle>
              <CardDescription>
                {currentUser
                  ? t('frontend.home.signed_in_as', { email: currentUser.email })
                  : t('frontend.home.please_sign_in')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">{t('frontend.home.success_message')}</p>
                  <div className="grid gap-2">
                    <div>
                      <span className="font-semibold">{t('frontend.home.name_label')}</span>{' '}
                      {currentUser.name}
                    </div>
                    <div>
                      <span className="font-semibold">{t('frontend.home.email_label')}</span>{' '}
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t('frontend.home.sign_in_instruction')}</p>
              )}
            </CardContent>
          </Card>

          {/* Mood Calendar - only show for logged-in users */}
          {moods && year && month && moodLevels && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{t('frontend.moods.index.title')}</h2>
                </div>
                <Link href={moods_path()}>
                  <Button variant="outline" size="sm">
                    {t('frontend.moods.home.view_full')}
                  </Button>
                </Link>
              </div>

              <MoodCalendar
                year={year}
                month={month}
                moods={moods}
                onMonthChange={handleMonthChange}
                onDayClick={handleDayClick}
                showUserAvatars={true}
              />

              {userStats && userStats.currentMoodStreak > 0 && (
                <div className="mt-4 max-w-xs mx-auto">
                  <Link href={gamification_dashboard_path()}>
                    <StreakCounter
                      currentStreak={userStats.currentMoodStreak}
                      longestStreak={userStats.longestMoodStreak}
                      type="mood"
                      label="Current Mood Streak"
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                    />
                  </Link>
                </div>
              )}

              <p className="text-sm text-muted-foreground text-center mt-4">
                {t('frontend.moods.home.summary_hint')}
              </p>
            </div>
          )}

          {posts && posts.length > 0 && (
            <div className="w-full mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{t('frontend.home.blog_graph_title')}</h2>
                <Link href={note_index_path({ view: 'graph' })}>
                  <Button variant="outline" size="sm">
                    {t('frontend.home.blog_graph_cta')}
                  </Button>
                </Link>
              </div>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
                    <div className="animate-pulse text-muted-foreground">Loading graph...</div>
                  </div>
                }
              >
                <NoteGraphView posts={posts} />
              </Suspense>
            </div>
          )}
        </main>
      </div>

      {/* Multi-Mood Modal - Shows all users' moods for a day */}
      <MultiMoodModal
        isOpen={isMultiMoodModalOpen}
        onClose={() => setIsMultiMoodModalOpen(false)}
        moods={selectedDayMoods}
        currentUser={currentUser}
      />
    </>
  )
}
