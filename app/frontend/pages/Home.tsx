import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import BlogGraphView from '@/components/BlogGraphView'
import MoodCalendar from '@/components/MoodCalendar'
import MultiMoodModal from '@/components/MultiMoodModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/contexts/I18nContext'
import type { BasePageProps, Mood, MoodLevels, PostListItem } from '@/types'

interface HomePageProps extends BasePageProps {
  posts: PostListItem[]
  moods?: Mood[]
  year?: number
  month?: number
  mood_levels?: MoodLevels
}

export default function Home() {
  const { current_user, moods, year, month, mood_levels, posts } = usePage<HomePageProps>().props
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
      if (current_user) {
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
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Card className="w-full mb-6 hover:translate-x-0 hover:translate-y-0">
            <CardHeader>
              <CardTitle>{t('frontend.home.welcome')}</CardTitle>
              <CardDescription>
                {current_user
                  ? t('frontend.home.signed_in_as', { email: current_user.email })
                  : t('frontend.home.please_sign_in')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {current_user ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">{t('frontend.home.success_message')}</p>
                  <div className="grid gap-2">
                    <div>
                      <span className="font-semibold">{t('frontend.home.name_label')}</span>{' '}
                      {current_user.name}
                    </div>
                    <div>
                      <span className="font-semibold">{t('frontend.home.email_label')}</span>{' '}
                      {current_user.email}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t('frontend.home.sign_in_instruction')}</p>
              )}
            </CardContent>
          </Card>

          {/* Mood Calendar - only show for logged-in users */}
          {moods && year && month && mood_levels && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{t('frontend.moods.index.title')}</h2>
                </div>
                <Link href="/moods">
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

              <p className="text-sm text-muted-foreground text-center mt-4">
                {t('frontend.moods.home.summary_hint')}
              </p>
            </div>
          )}

          {posts && posts.length > 0 && (
            <div className="w-full mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{t('frontend.home.blog_graph_title')}</h2>
                <Link href="/blog?view=graph">
                  <Button variant="outline" size="sm">
                    {t('frontend.home.blog_graph_cta')}
                  </Button>
                </Link>
              </div>
              <BlogGraphView posts={posts} />
            </div>
          )}
        </main>
      </div>

      {/* Multi-Mood Modal - Shows all users' moods for a day */}
      <MultiMoodModal
        isOpen={isMultiMoodModalOpen}
        onClose={() => setIsMultiMoodModalOpen(false)}
        moods={selectedDayMoods}
        current_user={current_user}
      />
    </>
  )
}
