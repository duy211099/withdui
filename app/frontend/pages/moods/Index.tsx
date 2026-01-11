import { Head, router, usePage } from '@inertiajs/react'
import { Smile } from 'lucide-react'
import { useState } from 'react'
import LocalTime from '@/components/LocalTime'
import MoodCalendar from '@/components/MoodCalendar'
import MoodDetailModal from '@/components/MoodDetailModal'
import MultiMoodModal from '@/components/MultiMoodModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/contexts/I18nContext'
import { getShortDateFormat } from '@/lib/localTime'
import { edit_mood_by_date_path } from '@/lib/routes'
import type { BasePageProps, MonthlySummary, Mood, MoodLevels, User } from '@/types'

interface IndexProps extends BasePageProps {
  moods: Mood[]
  year: number
  month: number
  summary: MonthlySummary
  moodLevels: MoodLevels
  allUsers: User[]
  viewingUserId: string | null
  canEdit: boolean
}

export default function Index({
  moods,
  year,
  month,
  summary,
  moodLevels,
  allUsers,
  viewingUserId,
  canEdit,
}: IndexProps) {
  const { currentUser } = usePage<BasePageProps>().props
  const { t, locale } = useI18n()
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [selectedDayMoods, setSelectedDayMoods] = useState<Mood[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMultiMoodModalOpen, setIsMultiMoodModalOpen] = useState(false)
  // Handle month navigation
  const handleMonthChange = (newYear: number, newMonth: number) => {
    router.visit('/moods', {
      data: { year: newYear, month: newMonth, user_id: viewingUserId || undefined },
      preserveScroll: true,
    })
  }

  // Handle day click - show modal or navigate to create/edit
  const handleDayClick = (day: number, dayMoods: Mood[]) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    // If there are no moods for this day
    if (dayMoods.length === 0) {
      if (canEditMoods) {
        router.visit(`/moods/new?date=${date}`)
      }
      return
    }

    // If viewing multi-user view and there are multiple moods, show all
    if (isMultiUserView && dayMoods.length > 0) {
      setSelectedDayMoods(dayMoods)
      setIsMultiMoodModalOpen(true)
    } else {
      // Single user view - show the only mood
      setSelectedMood(dayMoods[0])
      setIsModalOpen(true)
    }
  }

  // Handle edit from modal
  const handleEdit = (entryDate: string) => {
    // Date string (YYYY-MM-DD)
    setIsModalOpen(false)
    router.visit(edit_mood_by_date_path({ date: entryDate }))
  }

  // Handle user filter change
  const handleUserFilterChange = (userId: string) => {
    router.visit('/moods', {
      data: {
        year,
        month,
        user_id: userId === 'all' ? undefined : userId,
      },
      preserveScroll: true,
    })
  }

  // Determine if showing multi-user view
  const isMultiUserView = !viewingUserId

  const isFilteredView = viewingUserId !== null && viewingUserId !== currentUser?.id
  // Prevent edits when viewing someone else's calendar
  const canEditMoods = Boolean(currentUser && !isFilteredView && canEdit)

  return (
    <>
      <Head title={t('frontend.moods.index.title')} />

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Smile className="h-8 w-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">{t('frontend.moods.index.title')}</h1>
          </div>

          {canEditMoods && (
            <Button className="w-full sm:w-auto" onClick={() => router.visit('/moods/new')}>
              {t('frontend.moods.index.record_today')}
            </Button>
          )}
        </div>

        {/* User Filter Dropdown */}
        <Card className="mb-6 hover:translate-x-0 hover:translate-y-0">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Label htmlFor="user-filter" className="text-base font-semibold whitespace-nowrap">
                {t('frontend.moods.index.view_from')}
              </Label>
              <select
                id="user-filter"
                className="flex-1 h-10 rounded-md border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={viewingUserId || 'all'}
                onChange={(e) => handleUserFilterChange(e.target.value)}
              >
                <option value="all">{t('frontend.moods.index.everyone_option')}</option>
                {allUsers &&
                  Array.isArray(allUsers) &&
                  allUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Summary Stats */}
        {summary.total_entries > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card className="hover:translate-x-0 hover:translate-y-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('frontend.moods.summary.total_entries')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{summary.total_entries}</p>
              </CardContent>
            </Card>

            <Card className="hover:translate-x-0 hover:translate-y-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('frontend.moods.summary.average_mood')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summary.average_level !== null ? (
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">
                      {moodLevels[Math.round(Number(summary.average_level))].emoji}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Number(summary.average_level).toFixed(1)}
                    </span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">{t('frontend.moods.shared.not_available')}</p>
                )}
              </CardContent>
            </Card>

            <Card className="hover:translate-x-0 hover:translate-y-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('frontend.moods.summary.best_day')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {summary.best_day ? (
                    <LocalTime
                      dateTime={summary.best_day}
                      dateOnly
                      format={getShortDateFormat(locale)}
                    />
                  ) : (
                    t('frontend.moods.shared.not_available')
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:translate-x-0 hover:translate-y-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('frontend.moods.summary.worst_day')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {summary.worst_day ? (
                    <LocalTime
                      dateTime={summary.worst_day}
                      dateOnly
                      format={getShortDateFormat(locale)}
                    />
                  ) : (
                    t('frontend.moods.shared.not_available')
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Calendar */}
        <MoodCalendar
          year={year}
          month={month}
          moods={moods}
          onMonthChange={handleMonthChange}
          onDayClick={handleDayClick}
          showUserAvatars={isMultiUserView}
          canEdit={canEditMoods}
        />

        {/* Empty state */}
        {summary.total_entries === 0 && (
          <Card className="mt-6 hover:translate-x-0 hover:translate-y-0">
            <CardContent className="py-12 text-center">
              <Smile className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {t('frontend.moods.empty_state.title')}
              </h3>
              <p className="text-muted-foreground">
                {canEditMoods
                  ? t('frontend.moods.empty_state.cta')
                  : t('frontend.moods.empty_state.no_entries')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Mood Legend */}
        <Card className="mt-6 hover:translate-x-0 hover:translate-y-0">
          <CardHeader>
            <CardTitle className="text-lg">{t('frontend.moods.legend.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
              {Object.entries(moodLevels).map(([level, config]) => (
                <div
                  key={level}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg border-2"
                  style={{
                    backgroundColor: `${config.color}15`,
                    borderColor: config.color,
                  }}
                >
                  <span className="text-2xl sm:text-3xl">{config.emoji}</span>
                  <span className="text-xs sm:text-sm font-medium capitalize">
                    {t(`frontend.moods.levels.${config.name}`)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Detail Modal */}
      <MoodDetailModal
        mood={selectedMood}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={canEditMoods ? handleEdit : undefined}
        canEdit={canEditMoods && selectedMood ? selectedMood.user.id === currentUser?.id : false}
      />

      {/* Multi-Mood Modal (Everyone view) */}
      <MultiMoodModal
        isOpen={isMultiMoodModalOpen}
        onClose={() => setIsMultiMoodModalOpen(false)}
        moods={selectedDayMoods}
        currentUser={currentUser}
        canEdit={canEditMoods}
      />
    </>
  )
}
